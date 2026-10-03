import { ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";
import { ApiError } from "@/lib/api-error";

export const getLlmConfig = () => {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!baseUrl || !apiKey || !model) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.MISSING_LLM_CONFIG
    );
  }

  return { baseUrl, apiKey, model };
};