const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

const SYSTEM_PROMPT = `You are MediGenius, a pharmacy assistant for an online pharmacy.
You ONLY discuss non-prescription (OTC) medications and general health topics.
You NEVER recommend prescription drugs, diagnose medical conditions, or suggest treatments outside the product list provided.
You will receive a list of OTC products and may receive the patient's allergy and health information.

ALLERGY RULES (strictly enforce):
- If the patient has stated any allergies, even with typos or informal spelling (e.g. "aspirn", "penicilin", "ibuprofin"), use your best understanding to identify the substance and NEVER recommend any product that contains it, is derived from it, or shares the same drug class.
- Cross-check allergy terms against each product's name, active ingredients, and drug class before recommending.
- If you are unsure whether a product is safe given an allergy, exclude it and say so.
- If all products are excluded due to allergies, say so clearly and recommend consulting a pharmacist.

You MUST only recommend products from the provided list. Do not invent, rename, or suggest products not in the list.
Write a natural, friendly paragraph response in English.
Use markdown bold (**product name**) when mentioning a specific product name.
Always end with a brief disclaimer that a pharmacist should be consulted before taking any medication.
Keep the total response under 200 words.`;

async function generateChatReply({ userMessage, symptoms, products, profile }) {
  if (!products?.length) return null;

  const patientContext = [];
  if (profile?.allergies) {
    patientContext.push(`The patient has the following allergies: ${profile.allergies}.`);
  }
  if (profile?.chronicDiseases) {
    patientContext.push(`The patient has the following chronic conditions: ${profile.chronicDiseases}.`);
  }

  const productLines = products.map((p, i) => {
    const price = p.unit?.[0]
      ? `${Number(p.unit[0].price).toLocaleString()} VND (${p.unit[0].unitType})`
      : "";
    return [
      `${i + 1}. **${p.name}**${price ? ` — ${price}` : ""}`,
      p.shortDesc ? `   ${p.shortDesc}` : "",
      p.detail?.indications ? `   Indications: ${p.detail.indications}` : "",
      p.detail?.activeIngredients ? `   Active ingredients: ${p.detail.activeIngredients}` : "",
      p.detail?.warnings ? `   Warnings: ${p.detail.warnings}` : "",
    ].filter(Boolean).join("\n");
  }).join("\n\n");

  const userTurn = [
    patientContext.length ? patientContext.join(" ") : null,
    `The user said: "${userMessage}"`,
    `Detected symptoms: ${symptoms.join(", ")}`,
    ``,
    `Available OTC products (already allergy-filtered):`,
    productLines,
    ``,
    `Please write a helpful pharmacy assistant response.`,
  ].filter((s) => s !== null).join("\n");

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userTurn },
        ],
      }),
      signal: AbortSignal.timeout(55000),
    });

    if (!res.ok) {
      throw new Error(`Ollama returned ${res.status}`);
    }

    const data = await res.json();
    return data.message?.content?.trim() || null;
  } catch (err) {
    console.warn("[LLM] Ollama generateChatReply failed:", err.message);
    return null;
  }
}

module.exports = { generateChatReply };
