// LLM service — OpenAI-compatible API
// Works with Ollama (local) and Groq (cloud) via env vars:
//
//   Ollama (default):
//     LLM_BASE_URL=http://localhost:11434/v1
//     LLM_API_KEY=ollama          (any non-empty string)
//     LLM_MODEL=llama3.2:3b
//
//   Groq (cloud, free tier):
//     LLM_BASE_URL=https://api.groq.com/openai/v1
//     LLM_API_KEY=gsk_...         (your Groq API key)
//     LLM_MODEL=llama-3.3-70b-versatile

const LLM_BASE_URL = process.env.LLM_BASE_URL || "http://localhost:11434/v1";
const LLM_API_KEY = process.env.LLM_API_KEY || "ollama";
const LLM_MODEL = process.env.LLM_MODEL || "llama3.2:3b";

async function callLLM(messages, options = {}) {
  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      stream: false,
      ...options,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    throw new Error(`LLM returned ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function extractKeywords(message) {
  const prompt = `Extract pharmacy product search keywords from this patient message.
Return ONLY a JSON array of lowercase strings. No explanation, no markdown, no code fences.

Examples:
- "I have a terrible migraine" → ["headache","migraine","pain relief","paracetamol","ibuprofen"]
- "feeling nauseous and bloated" → ["nausea","stomach","digestive","antacid","bloating"]
- "my eyes are red and itchy" → ["eye","itching","antihistamine","eye drops","conjunctivitis"]
- "can't sleep at night" → ["insomnia","sleep","melatonin","valerian"]
- "my back is killing me" → ["muscle pain","back pain","ibuprofen","diclofenac","topical"]

Message: "${message.replace(/"/g, '\\"')}"`;

  try {
    const raw = await callLLM(
      [{ role: "user", content: prompt }],
      { temperature: 0 },
    );
    const match = raw?.match(/\[[\s\S]*?\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    return parsed.filter((k) => typeof k === "string" && k.trim().length > 0);
  } catch (err) {
    console.warn("[LLM] extractKeywords failed:", err.message);
    return [];
  }
}

const REPLY_SYSTEM = `You are MediGenius, a pharmacy assistant for an online pharmacy.
You ONLY discuss non-prescription (OTC) medications and general health topics.
You NEVER recommend prescription drugs, diagnose medical conditions, or suggest treatments outside the product list provided.
You will receive a list of OTC products and may receive the patient's allergy and health information.

ALLERGY RULES (strictly enforce):
- If the patient has stated any allergies, even with typos or informal spelling (e.g. "aspirn", "penicilin", "ibuprofin"), use your best understanding to identify the substance and NEVER recommend any product that contains it, is derived from it, or shares the same drug class.
- Cross-check allergy terms against each product's name, active ingredients, and drug class before recommending.
- If you are unsure whether a product is safe given an allergy, exclude it and say so.
- If all products are excluded due to allergies, say so clearly and recommend consulting a pharmacist.

You MUST only recommend products from the provided list. Do not invent, rename, or suggest products not in the list.
Write a natural, friendly response in English.
Use markdown bold (**product name**) when mentioning a specific product name.
Use numbered lists (1. 2. 3.) when listing multiple products.
Always end with a brief disclaimer that a pharmacist should be consulted before taking any medication.
Keep the total response under 200 words.`;

async function generateChatReply({ userMessage, products, profile }) {
  if (!products?.length) return null;

  const patientContext = [];
  if (profile?.allergies) {
    patientContext.push(`Patient allergies: ${profile.allergies}.`);
  }
  if (profile?.chronicDiseases) {
    patientContext.push(`Patient chronic conditions: ${profile.chronicDiseases}.`);
  }

  const productLines = products
    .map((p, i) => {
      const price = p.unit?.[0]
        ? `${Number(p.unit[0].price).toLocaleString()} VND (${p.unit[0].unitType})`
        : "";
      return [
        `${i + 1}. **${p.name}**${price ? ` — ${price}` : ""}`,
        p.shortDesc ? `   ${p.shortDesc}` : "",
        p.detail?.indications ? `   Indications: ${p.detail.indications}` : "",
        p.detail?.activeIngredients
          ? `   Active ingredients: ${p.detail.activeIngredients}`
          : "",
        p.detail?.warnings ? `   Warnings: ${p.detail.warnings}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const userTurn = [
    patientContext.length ? patientContext.join(" ") : null,
    `Patient message: "${userMessage}"`,
    ``,
    `Available OTC products:`,
    productLines,
    ``,
    `Please write a helpful pharmacy assistant response.`,
  ]
    .filter((s) => s !== null)
    .join("\n");

  try {
    return await callLLM(
      [
        { role: "system", content: REPLY_SYSTEM },
        { role: "user", content: userTurn },
      ],
      { temperature: 0.4 },
    );
  } catch (err) {
    console.warn("[LLM] generateChatReply failed:", err.message);
    return null;
  }
}

module.exports = { extractKeywords, generateChatReply };
