export const MAX_TEXT_LENGTH = 1000;

export const TONES = [
  "friendly",
  "neutral",
  "pushy",
  "rude",
  "casual",
  "formal",
] as const;

export const RISKS = ["low", "medium", "high"] as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
} as const;

export const BODY_FIELD = "body";

export const ERROR_MESSAGES = {
  INVALID_JSON: "Request body must be valid JSON",
  MODEL_NOT_IMPLEMENTED: "Model call is not implemented yet",
  MISSING_LLM_CONFIG:
    "LLM_BASE_URL, LLM_API_KEY and LLM_MODEL must be set in .env",
  UNEXPECTED: "Something went wrong",
} as const;

export const PROMPTS_DIRECTORY = "prompts";
export const PROMPT_FILE_PREFIX = "tone-check";
export const PROMPT_VERSION = "v1";

export const MODEL_TEMPERATURE = 0.2;
export const MODEL_TIMEOUT_MS = 30_000;
export const MODEL_MAX_RETRIES = 0;