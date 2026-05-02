# MediBot Chatbot — Testing Guide & Flow Documentation

## Overview

MediBot is a simulated AI pharmacy assistant that helps users find non-prescription (OTC) medications based on their symptoms. It is **not** a real AI model — it uses keyword matching against a symptom dictionary and queries the product catalog.

---

## Architecture & Request Flow

```
User types message
  │
  ▼
Frontend: handleSend() in src/app/ai-assistant/page.tsx
  │  POST /api/v1/chat  { message, history: [{role, content}] }
  ▼
Backend: routes/chat.route.js
  │  → optionalAuth middleware  (sets req.user if valid JWT, else guest)
  │  → validateData(chatMessageSchema)  (Zod: message 1–1000 chars, history max 20 items)
  ▼
chat.controller.js → chatService.processMessage(userId, message, history)
  │
  ├─ Is it a greeting (and NO symptoms)?
  │     → Return standard greeting response
  │
  ├─ Fetch patient profile (if userId present)
  │     PatientProfileRepository.findByUserId(userId)
  │
  ├─ Was an allergy question asked earlier in history?
  │   ├─ User says "no / none / don't have" → find last symptom in history → generate suggestion (no filter)
  │   └─ User provides allergy text → find last symptom in history → generate suggestion (with filter)
  │
  ├─ Detect symptoms from current message (keyword matching against 12 categories)
  │   └─ No symptoms found → ask user to describe symptoms
  │
  ├─ Symptoms detected:
  │   ├─ Logged in + NO health profile → ask about allergies first
  │   ├─ Guest (no userId) → ask about allergies first
  │   └─ Logged in + HAS profile → generate personalized suggestion
  │
  └─ generateSuggestion():
       ProductRepository.findByChatKeywords(keywords)
         → filters: requiresRx=false, isActive=true, keyword in name/shortDesc/AI context/indications
         → take: 5 products
       filterByAllergies(products, profile)
         → removes products where name/ingredients/AI context matches allergy keywords
       buildResponse(symptoms, safeProducts, profile)
  │
  ▼
Response: { reply: string, products: ChatProduct[] }
  │
  ▼
Frontend renders AssistantMessage with optional ProductCard list
```

---

## Symptom Categories (Keyword Triggers)

| Symptom     | Message must contain           |
| ----------- | ------------------------------ |
| headache    | "headache"                     |
| cold        | "cold"                         |
| fever       | "fever"                        |
| cough       | "cough"                        |
| sore_throat | "sore throat" or "sore_throat" |
| stomach     | "stomach"                      |
| diarrhea    | "diarrhea"                     |
| allergy     | "allergy"                      |
| insomnia    | "insomnia"                     |
| muscle_pain | "muscle pain" or "muscle_pain" |
| skin_rash   | "skin rash" or "skin_rash"     |
| eye         | "eye"                          |

---

## Test Scenarios

### Setup

Start both servers:

- **Frontend:** `pnpm dev` in `FE-Pharmacy/` → http://localhost:3000
- **Backend:** `npm run dev` in `BE-Pharmacy/` → http://localhost:5000

Navigate to http://localhost:3000/ai-assistant

---

### Test 1 — Page Load (No Auto-Scroll)

**Steps:** Open `/ai-assistant` on a fresh page load
**Expected:** The page does NOT automatically scroll down to the chat area. The chat container is visible at its natural position without forced scrolling.

---

### Test 2 — Guest: Greeting

**Precondition:** Not logged in
**Steps:** Type `Hello`
**Expected:** Bot introduces itself as MediBot and asks about symptoms. No product cards shown.

---

### Test 3 — Guest: Symptom → Allergy Question → No Allergies → Products

**Precondition:** Not logged in
**Steps:**

1. Type: `I have a headache`
2. Expected: Bot asks about drug allergies
3. Type: `none`
4. Expected: Bot suggests headache medications (paracetamol, ibuprofen, etc.) with up to 5 product cards

---

### Test 4 — Guest: Symptom → Has Allergies → Filtered Products

**Precondition:** Not logged in
**Steps:**

1. Type: `I have a headache`
2. Expected: Bot asks about allergies
3. Type: `aspirin, ibuprofen`
4. Expected: Bot suggests headache medications **excluding** aspirin and ibuprofen products

---

### Test 5 — Authenticated: No Health Profile

**Precondition:** Logged in as PATIENT, health profile NOT set up
**Steps:**

1. Type: `I have a cold`
2. Expected: Bot acknowledges symptoms AND asks about allergies. Mentions setting up health profile in account settings.
3. Type: `no allergies`
4. Expected: Bot suggests cold/flu medications with product cards

---

### Test 6 — Authenticated: With Health Profile (Allergies & Conditions)

**Precondition:** Logged in as PATIENT, health profile set up with:

- Allergies: `ibuprofen`
- Chronic diseases: `diabetes`

**Steps:**

1. Type: `I have a fever`
2. Expected:
   - Products shown do NOT include ibuprofen-based products
   - Response note mentions allergy filtering
   - Response note mentions being mindful of diabetes when taking medication

**Setup health profile:** Go to http://localhost:3000/users/profile/health

---

### Test 7 — Multiple Symptoms

**Steps:** Type `I have a headache and stomach pain`
**Expected:** Bot detects both "headache" and "stomach" symptoms. Returns products relevant to both categories.

---

### Test 8 — No Symptoms Detected

**Steps:** Type `How is the weather today?`
**Expected:** Bot says it can help with symptoms and lists example categories (headache, cold, cough, etc.). No product cards.

---

### Test 9 — Greeting with Symptom (Bypass Greeting)

**Steps:** Type `Hi, I have a cough`
**Expected:** Bot processes the cough symptom (NOT just return a greeting), asks about allergies or suggests products depending on auth state.

---

### Test 10 — All 12 Symptom Categories

Test each keyword one by one. Each should trigger the allergy question or product suggestion flow:

| Message                | Symptom triggered |
| ---------------------- | ----------------- |
| `I have a headache`    | headache          |
| `I have a cold`        | cold              |
| `I have a fever`       | fever             |
| `I have a cough`       | cough             |
| `I have a sore throat` | sore_throat       |
| `I have stomach pain`  | stomach           |
| `I have diarrhea`      | diarrhea          |
| `I have an allergy`    | allergy           |
| `I have insomnia`      | insomnia          |
| `I have muscle pain`   | muscle_pain       |
| `I have a skin rash`   | skin_rash         |
| `My eye hurts`         | eye               |

---

### Test 11 — Allergy Filtering Removes All Products

**Precondition:** Logged in, health profile with very broad allergies matching all available OTC products
**Steps:** Type a symptom
**Expected:** Bot responds that it couldn't find matching medications, mentions allergy filtering, recommends consulting a pharmacist.

---

### Test 12 — Product Card Navigation

**Precondition:** Get a response with product cards
**Steps:** Click on any product card
**Expected:** Navigates to `/products/{slug}` for that product. Product detail page loads correctly.

---

### Test 13 — Send Button / Enter Key

**Steps:**

1. Type a message and press **Enter** → message sends
2. Type a message and click the **Send** button → message sends
3. While bot is loading → both Enter and Send button are disabled
4. Empty input → Send button is disabled

---

### Test 14 — Health Profile Link (Authenticated Only)

**Precondition:** Logged in
**Steps:** Look at the chatbot header
**Expected:** "Manage health profile →" link is visible. Clicking it navigates to `/users/profile/health`.
**Not logged in:** Link is NOT shown.

---

### Test 15 — Auto-Scroll After Sending Messages

**Steps:**

1. Have a long enough conversation to fill the chat area
2. Send a new message
3. Expected: Chat scrolls to the latest message automatically
4. Receive a bot reply
5. Expected: Chat scrolls to the bot reply automatically

---

## Common Issues & Tips

| Issue                                        | Check                                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No products returned                         | Ensure the database has active (`isActive: true`), non-prescription (`requiresRx: false`) products seeded. Run `node prisma/seed.js` and `node prisma/demoFlow.seed.js`. |
| Chatbot always asks about allergies          | This is correct behavior for guests and for authenticated users without a health profile. Set up a health profile at `/users/profile/health`.                            |
| Product cards not clickable                  | Ensure product slugs are set in the database.                                                                                                                            |
| "Sorry, I'm having trouble connecting" error | Ensure the backend is running on port 5000 and `NEXT_PUBLIC_API_URL` is set correctly in `.env`.                                                                         |

---

## Admin Testing

Admins cannot use the chatbot (they are redirected to `/admin/products` on login). To test the chatbot, use a PATIENT account.

Create a test patient account at http://localhost:3000/register or use seeded demo data.
