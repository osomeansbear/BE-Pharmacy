const PatientProfileRepository = require("../repositories/patient-profile.repository.js");
const ProductRepository = require("../repositories/product.repository.js");

const SYMPTOM_KEYWORDS = {
  headache: ["paracetamol", "ibuprofen", "aspirin", "analgesic", "pain relief", "headache"],
  cold: ["vitamin c", "decongestant", "antihistamine", "cold", "flu", "nasal"],
  fever: ["paracetamol", "ibuprofen", "antipyretic", "fever"],
  cough: ["cough", "dextromethorphan", "antitussive", "expectorant", "syrup"],
  sore_throat: ["lozenge", "throat", "antiseptic", "gargle", "sore throat"],
  stomach: ["antacid", "digestive", "stomach", "bismuth", "indigestion", "heartburn"],
  diarrhea: ["loperamide", "electrolyte", "oral rehydration", "probiotic", "diarrhea"],
  allergy: ["antihistamine", "cetirizine", "loratadine", "allergy", "allergic"],
  insomnia: ["melatonin", "sleep", "valerian", "insomnia"],
  muscle_pain: ["ibuprofen", "topical", "muscle", "pain relief", "diclofenac"],
  skin_rash: ["hydrocortisone", "calamine", "skin", "rash", "itch"],
  eye: ["eye drops", "eye", "artificial tears", "ophthalmic"],
};

const GREETING_PATTERNS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "help"];

class ChatService {
  async processMessage(userId, message, history) {
    const lower = message.toLowerCase().trim();

    // Check for greetings
    if (GREETING_PATTERNS.some((g) => lower.includes(g)) && !this.#containsSymptoms(lower)) {
      return {
        reply:
          "Hello! I'm MediGenius, your pharmacy assistant. I can help you find non-prescription medications for common symptoms like headaches, colds, allergies, stomach issues, and more. What symptoms are you experiencing?",
        products: [],
      };
    }

    // Get patient profile if logged in
    let profile = null;
    if (userId) {
      profile = await PatientProfileRepository.findByUserId(userId);
    }

    // Check if user is providing allergy info in response to our question
    const askedAboutAllergies = history.some(
      (h) => h.role === "assistant" && h.content.includes("allergies"),
    );
    if (askedAboutAllergies && !this.#containsSymptoms(lower)) {
      // User might be responding with allergy info
      if (lower.includes("no") || lower.includes("none") || lower.includes("don't have")) {
        // No allergies — find last symptom from history and suggest
        const lastSymptomMessage = [...history].reverse().find(
          (h) => h.role === "user" && this.#containsSymptoms(h.content.toLowerCase()),
        );
        if (lastSymptomMessage) {
          return this.#generateSuggestion(
            lastSymptomMessage.content.toLowerCase(),
            null,
            userId,
          );
        }
        return {
          reply: "Great! What symptoms are you experiencing? I can suggest some non-prescription medications.",
          products: [],
        };
      }
      // User provided allergy info — remember it and look back for symptoms
      const allergyText = message.trim();
      const lastSymptomMessage = [...history].reverse().find(
        (h) => h.role === "user" && this.#containsSymptoms(h.content.toLowerCase()),
      );
      if (lastSymptomMessage) {
        return this.#generateSuggestion(
          lastSymptomMessage.content.toLowerCase(),
          { allergies: allergyText },
          userId,
        );
      }
      return {
        reply: `Thank you for letting me know about your allergies (${allergyText}). I'll keep that in mind. What symptoms are you experiencing?`,
        products: [],
      };
    }

    // Detect symptoms
    const detectedSymptoms = this.#detectSymptoms(lower);
    if (detectedSymptoms.length === 0) {
      return {
        reply:
          "I can help you find non-prescription medications for common symptoms. Could you describe what you're experiencing? For example: headache, cold, cough, stomach pain, allergies, skin rash, etc.",
        products: [],
      };
    }

    // If logged in but no profile, ask about allergies first
    if (userId && !profile) {
      return {
        reply: `I see you're experiencing ${detectedSymptoms.join(", ")}. Before I recommend any medication, do you have any known allergies or chronic diseases? You can also set up your health profile in your account settings for personalized recommendations.\n\nIf you have no allergies, just say "no allergies".`,
        products: [],
      };
    }

    // If guest (no userId), ask about allergies
    if (!userId) {
      return {
        reply: `I see you're experiencing ${detectedSymptoms.join(", ")}. Before I suggest medications, do you have any known drug allergies? This helps me avoid recommending something that could cause a reaction.\n\nIf you have no allergies, just say "none".`,
        products: [],
      };
    }

    // Logged in with profile — generate personalized suggestion
    return this.#generateSuggestion(lower, profile, userId);
  }

  async #generateSuggestion(messageLower, profile, userId) {
    const detectedSymptoms = this.#detectSymptoms(messageLower);
    const keywords = detectedSymptoms.flatMap((s) => SYMPTOM_KEYWORDS[s] || []);

    // Find matching products
    const products = await this.#findMatchingProducts(keywords);

    // Filter by allergy profile
    const safeProducts = this.#filterByAllergies(products, profile);

    // Build response
    return this.#buildResponse(detectedSymptoms, safeProducts, profile);
  }

  #detectSymptoms(message) {
    return Object.keys(SYMPTOM_KEYWORDS).filter((symptom) => {
      const variants = [symptom, symptom.replace("_", " ")];
      return variants.some((v) => message.includes(v));
    });
  }

  #containsSymptoms(message) {
    return this.#detectSymptoms(message).length > 0;
  }

  async #findMatchingProducts(keywords) {
    if (!keywords.length) return [];
    return ProductRepository.findByChatKeywords(keywords);
  }

  #filterByAllergies(products, profile) {
    if (!profile?.allergies) return products;

    const allergyList = profile.allergies
      .toLowerCase()
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    if (!allergyList.length) return products;

    return products.filter((p) => {
      const contextText = (p.productAIs || [])
        .map((ai) => ai.context.toLowerCase())
        .join(" ");
      const ingredients = (p.detail?.activeIngredients || "").toLowerCase();
      const name = p.name.toLowerCase();

      return !allergyList.some(
        (allergy) =>
          contextText.includes(allergy) ||
          ingredients.includes(allergy) ||
          name.includes(allergy),
      );
    });
  }

  #buildResponse(symptoms, products, profile) {
    if (products.length === 0) {
      let reply = `I couldn't find non-prescription medications matching your symptoms (${symptoms.join(", ")}).`;
      if (profile?.allergies) {
        reply += ` This may be due to filtering based on your allergies (${profile.allergies}).`;
      }
      reply += " Please consult a pharmacist for personalized advice.";
      return { reply, products: [] };
    }

    let reply = `Based on your symptoms (${symptoms.join(", ")}), here are some non-prescription suggestions:\n\n`;

    const productList = products.map((p) => {
      const price = p.unit?.[0]
        ? `${Number(p.unit[0].price).toLocaleString()} (${p.unit[0].unitType})`
        : "";
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc || "",
        price,
      };
    });

    productList.forEach((p, i) => {
      reply += `${i + 1}. **${p.name}**${p.price ? ` - ${p.price}` : ""}\n   ${p.shortDesc}\n\n`;
    });

    if (profile?.allergies) {
      reply += `_Note: Results filtered based on your allergy profile (${profile.allergies})._\n\n`;
    }

    if (profile?.chronicDiseases) {
      reply += `_Please be mindful of your conditions (${profile.chronicDiseases}) when taking any medication._\n\n`;
    }

    reply += "**Disclaimer:** Always consult a pharmacist before taking any medication.";

    return {
      reply,
      products: productList.map(({ id, name, slug, shortDesc }) => ({
        id,
        name,
        slug,
        shortDesc,
      })),
    };
  }
}

module.exports = new ChatService();
