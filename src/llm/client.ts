import OpenAI from "openai";
import { MODEL_MAX_RETRIES, MODEL_TIMEOUT_MS } from "@/config/constants";
import { getLlmConfig } from "@/config/env";

export const createLlmClient = () => {
  const { baseUrl, apiKey } = getLlmConfig();

  return new OpenAI({
    baseURL: baseUrl,
    apiKey,
    timeout: MODEL_TIMEOUT_MS,
    maxRetries: MODEL_MAX_RETRIES,
  });
};