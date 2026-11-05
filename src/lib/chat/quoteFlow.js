import { industryOptions } from "@/constant/booking/booking";

export const QUOTE_FIELDS = [
  "fullName",
  "email",
  "phone",
  "facilityType",
  "zipCode",
];

export const MAX_ATTEMPTS = 3;

export const RETRY_SUBMIT_FIELD = "__retry_submit__";

const MAX_FIELD_LENGTH = 200;

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

function isValidCollectedValue(field, value) {
  if (typeof value !== "string" || value.length > MAX_FIELD_LENGTH) {
    return false;
  }
  if (field === "facilityType") {
    return value === "Other" || industryOptions.includes(value);
  }
  return FIELD_CONFIG[field].validate(value);
}

// The browser holds the quote state between messages, so it can't be trusted.
// Rebuilds a clean copy from a fixed set of fields. Returns { valid: false } if
// anything is off, including answers that were never validated by this server.
export function parseQuoteFlow(raw) {
  if (raw === null || raw === undefined) {
    return { valid: true, state: null };
  }
  if (typeof raw !== "object" || raw.active !== true) {
    return { valid: false };
  }

  const { field, collected, attempts } = raw;
  const isRetry = field === RETRY_SUBMIT_FIELD;
  if (!isRetry && !QUOTE_FIELDS.includes(field)) {
    return { valid: false };
  }
  if (!collected || typeof collected !== "object") {
    return { valid: false };
  }
  if (attempts !== undefined && (!attempts || typeof attempts !== "object")) {
    return { valid: false };
  }

  // Exactly the fields before the current one, or all of them on a retry.
  const expectedFields = isRetry
    ? QUOTE_FIELDS
    : QUOTE_FIELDS.slice(0, QUOTE_FIELDS.indexOf(field));
  if (Object.keys(collected).length !== expectedFields.length) {
    return { valid: false };
  }

  const cleanCollected = {};
  for (const expected of expectedFields) {
    if (!isValidCollectedValue(expected, collected[expected])) {
      return { valid: false };
    }
    cleanCollected[expected] = collected[expected];
  }

  const cleanAttempts = {};
  for (const quoteField of QUOTE_FIELDS) {
    const count = attempts?.[quoteField];
    if (count === undefined) continue;
    if (!Number.isInteger(count) || count < 0 || count > MAX_ATTEMPTS) {
      return { valid: false };
    }
    cleanAttempts[quoteField] = count;
  }

  return {
    valid: true,
    state: {
      active: true,
      field,
      collected: cleanCollected,
      attempts: cleanAttempts,
    },
  };
}

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
