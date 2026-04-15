const PatientProfileRepository = require("../repositories/patient-profile.repository.js");
const ProductRepository = require("../repositories/product.repository.js");
const { extractKeywords, generateChatReply } = require("./llm.service.js");

const GREETING_PATTERNS = [
  "hello",
  "hi",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "help",
];

// Fast regex to detect health/symptom language — used to avoid LLM calls on pure greetings
const SYMPTOM_HINT =
  /pain|ache|sick|hurt|sore|cough|fever|nausea|vomit|rash|itch|sneez|runny|dizzy|headache|migraine|allerg|stomach|cold|flu|sleep|bleed|burn|swollen|tired|cramp/i;

const GREETING_REPLY =
  "Hello! I'm MediGenius, your pharmacy assistant. I can help you find non-prescription medications for common symptoms like headaches, colds, allergies, stomach issues, and more. What symptoms are you experiencing?";

class ChatService {
  async processMessage(userId, message, history) {
    const lower = message.toLowerCase().trim();

    // 1. Pure greeting — no symptom hint, skip LLM entirely
    if (
      GREETING_PATTERNS.some((g) => lower.includes(g)) &&
      !SYMPTOM_HINT.test(lower)
    ) {
      return { reply: GREETING_REPLY, products: [] };
    }

    let profile = null;
    if (userId) {
      profile = await PatientProfileRepository.findByUserId(userId);
    }

    // 3. Check if user is responding to our earlier allergy question
    const firstAllergyAskIdx = history.findIndex(
      (h) => h.role === "assistant" && h.content.includes("allergies"),
    );
    const askedAboutAllergies = firstAllergyAskIdx !== -1;

    // "no allergies" contains "allerg" which matches SYMPTOM_HINT, so we need a
    // dedicated negative-response check that takes priority over the regex.
    const isNegativeResponse =
      /^(no\b|none\b|don'?t have)/i.test(lower) ||
      /\bno\s+(known\s+)?allerg/i.test(lower);

    if (askedAboutAllergies && (!SYMPTOM_HINT.test(lower) || isNegativeResponse)) {
      // Find the original symptom message sent BEFORE the allergy question was asked
      // (searching the full history can accidentally pick up "no allergies" which
      //  also matches SYMPTOM_HINT via "allerg")
      const lastSymptomMsg = history
        .slice(0, firstAllergyAskIdx)
        .reverse()
        .find((h) => h.role === "user" && SYMPTOM_HINT.test(h.content));

      if (isNegativeResponse) {
        if (lastSymptomMsg) {
          return this.#suggest(lastSymptomMsg.content, null);
        }
        return {
          reply:
            "Great! What symptoms are you experiencing? I can suggest some non-prescription medications.",
          products: [],
        };
      }

      if (lastSymptomMsg) {
        return this.#suggest(lastSymptomMsg.content, {
          allergies: message.trim(),
        });
      }
      return {
        reply: `Thank you for letting me know about your allergies (${message.trim()}). What symptoms are you experiencing?`,
        products: [],
      };
    }

    // If the user already replied to the allergy question (any user message after it),
    // don't ask again — proceed straight to suggestion.
    const alreadyAnsweredAllergies =
      askedAboutAllergies &&
      history.slice(firstAllergyAskIdx + 1).some((h) => h.role === "user");

    // 4. Ask about allergies if no profile yet (before running keyword extraction)
    if (!userId && !alreadyAnsweredAllergies) {
      return {
        reply: `Before I suggest medications, do you have any known drug allergies? This helps me avoid recommending something that could cause a reaction.\n\nIf you have no allergies, just say "none".`,
        products: [],
      };
    }

    if (userId && !profile && !alreadyAnsweredAllergies) {
      return {
        reply: `Before I recommend any medication, do you have any known allergies or chronic diseases? You can also set up your health profile in your account settings for personalized recommendations.\n\nIf you have no allergies, just say "no allergies".`,
        products: [],
      };
    }

    // 5. Logged-in user with profile — extract keywords and suggest
    return this.#suggest(message, profile);
  }

  async #suggest(message, profile, preExtractedKeywords = null) {
    const keywords =
      preExtractedKeywords ?? (await extractKeywords(message));

    if (!keywords.length) {
      return {
        reply:
          "I can help you find non-prescription medications for common symptoms. Could you describe what you're experiencing? For example: headache, cold, stomach pain, allergies, skin rash, etc.",
        products: [],
      };
    }

    const rawProducts = await ProductRepository.findByChatKeywords(keywords);

    const productList = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDesc: p.shortDesc || "",
    }));

    const llmReply = await generateChatReply({
      userMessage: message,
      products: rawProducts,
      profile,
    });

    return {
      reply: llmReply ?? this.#fallbackReply(rawProducts, profile),
      products: productList,
    };
  }

  #fallbackReply(products, profile) {
    if (!products.length) {
      let reply =
        "I couldn't find non-prescription medications matching your symptoms.";
      if (profile?.allergies) {
        reply += ` This may be due to filtering based on your allergy profile (${profile.allergies}).`;
      }
      reply += " Please consult a pharmacist for personalized advice.";
      return reply;
    }

    let reply =
      "Based on your symptoms, here are some non-prescription suggestions:\n\n";
    products.forEach((p, i) => {
      const price = p.unit?.[0]
        ? `${Number(p.unit[0].price).toLocaleString()} (${p.unit[0].unitType})`
        : "";
      reply += `${i + 1}. **${p.name}**${price ? ` - ${price}` : ""}\n   ${p.shortDesc || ""}\n\n`;
    });

    if (profile?.allergies) {
      reply += `_Note: Results filtered based on your allergy profile (${profile.allergies})._\n\n`;
    }
    if (profile?.chronicDiseases) {
      reply += `_Please be mindful of your conditions (${profile.chronicDiseases}) when taking any medication._\n\n`;
    }

    reply +=
      "**Disclaimer:** Always consult a pharmacist before taking any medication.";
    return reply;
  }
}

module.exports = new ChatService();
