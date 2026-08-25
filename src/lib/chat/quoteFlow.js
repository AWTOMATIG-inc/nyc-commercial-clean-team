import { industryOptions } from "@/constant/booking/booking";

export const QUOTE_FIELDS = [
  "fullName",
  "email",
  "phone",
  "facilityType",
  "zipCode",
];

export const MAX_ATTEMPTS = 3;

// Mirrors the HTML5 input[type=email] pattern — a practical stand-in for
// quoteYupSchema.js's .email() check, good enough for chat-side validation.
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function normalizePhoneDigits(value) {
  return (value || "").replace(/\D/g, "");
}

// Mirrors the US phone check in quoteYupSchema.js (strip to digits, allow a
// leading "1" country code, area code can't start with 0/1).
function isValidUsPhone(value) {
  let digits = normalizePhoneDigits(value);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  if (digits.length !== 10) return false;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
}

function normalizeUsPhone(value) {
  let digits = normalizePhoneDigits(value);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
}

const FACILITY_KEYWORD_MAP = [
  {
    match: "Office / Corporate",
    keywords: ["office", "corporate", "workplace", "coworking"],
  },
  {
    match: "Restaurant / Food Service",
    keywords: ["restaurant", "food", "cafe", "café", "diner", "kitchen", "bar"],
  },
  { match: "Retail Store", keywords: ["retail", "store", "shop", "boutique"] },
  {
    match: "Medical / Dental / Healthcare",
    keywords: [
      "medical",
      "dental",
      "clinic",
      "hospital",
      "healthcare",
      "doctor",
      "dentist",
    ],
  },
  {
    match: "School / Educational",
    keywords: ["school", "university", "college", "educational", "campus"],
  },
  {
    match: "Warehouse / Industrial",
    keywords: ["warehouse", "industrial", "factory", "plant", "distribution"],
  },
  {
    match: "Gym / Fitness Center",
    keywords: ["gym", "fitness", "workout", "yoga", "crossfit"],
  },
  {
    match: "Hotel / Hospitality",
    keywords: ["hotel", "hospitality", "motel", "inn"],
  },
];

export function matchFacilityType(rawAnswer) {
  const text = (rawAnswer || "").toLowerCase();
  for (const { match, keywords } of FACILITY_KEYWORD_MAP) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      // Confirm the match is one of the real dropdown options (belt-and-suspenders).
      return industryOptions.includes(match) ? match : "Other";
    }
  }
  return "Other";
}

const FIELD_CONFIG = {
  fullName: {
    validate: (value) => value.trim().length >= 3,
    normalize: (value) => value.trim(),
    examplePrompt: "Please enter your full name (at least 3 characters).",
    prompt: "Great, let's get you a quote! What's your full name?",
  },
  email: {
    validate: (value) => EMAIL_REGEX.test(value.trim()),
    normalize: (value) => value.trim(),
    examplePrompt: "Please enter a valid email address, e.g. jane@company.com",
    prompt: "Thanks! What's the best email address to reach you at?",
  },
  phone: {
    validate: (value) => isValidUsPhone(value),
    normalize: (value) => normalizeUsPhone(value),
    examplePrompt:
      "Please enter a 10-digit US phone number, e.g. 212-555-0134",
    prompt: "What's a good phone number to reach you at?",
  },
  facilityType: {
    // Never fails — resolves to "Other" when there's no confident match.
    validate: () => true,
    normalize: (value) => matchFacilityType(value),
    examplePrompt: null,
    prompt:
      "What type of facility is this for? (e.g. office, restaurant, gym, medical...)",
  },
  zipCode: {
    validate: (value) => /^\d{5}$/.test(value.trim()),
    normalize: (value) => value.trim(),
    examplePrompt: "Please enter a 5-digit zip code, e.g. 10001",
    prompt: "Last question — what's the zip code for the facility?",
  },
};

export function createInitialQuoteFlowState() {
  return {
    active: true,
    field: QUOTE_FIELDS[0],
    collected: {},
    attempts: {},
  };
}

export function getFieldPrompt(field) {
  return FIELD_CONFIG[field]?.prompt;
}

const QUOTE_INTENT_PATTERN =
  /\b(quote|estimate|pricing|price|proposal|how much)\b/i;

export function detectsQuoteIntent(message) {
  return QUOTE_INTENT_PATTERN.test(message || "");
}

function advanceOrComplete(collected, currentField) {
  const index = QUOTE_FIELDS.indexOf(currentField);
  const nextField = QUOTE_FIELDS[index + 1];
  if (!nextField) {
    return { status: "complete", collected };
  }
  return { status: "advance", nextField, collected };
}

// Given the current quote-flow state + the user's latest answer, returns
// one of: { status: "invalid", attempts, examplePrompt }
//         { status: "advance", nextField, collected }
//         { status: "complete", collected }
export function advanceQuoteFlow(state, rawAnswer) {
  const field = state.field;
  const config = FIELD_CONFIG[field];
  const answer = (rawAnswer || "").trim();

  if (field === "facilityType") {
    const collected = { ...state.collected, facilityType: matchFacilityType(answer) };
    return advanceOrComplete(collected, field);
  }

  if (!config.validate(answer)) {
    const attempts = (state.attempts?.[field] || 0) + 1;
    return { status: "invalid", attempts, examplePrompt: config.examplePrompt };
  }

  const collected = { ...state.collected, [field]: config.normalize(answer) };
  return advanceOrComplete(collected, field);
}
