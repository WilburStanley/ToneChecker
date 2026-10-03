import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { MODEL_TEMPERATURE } from "@/config/constants";
import { getLlmConfig } from "@/config/env";
import { createLlmClient } from "@/llm/client";
import { logModelCall } from "@/llm/cost-log";
import { mapProviderError } from "@/llm/map-provider-error";
import { loadSystemPrompt } from "@/llm/prompt-loader";
import { withRetry } from "@/llm/retry";

const attemptCompletion = async (
  messages: ChatCompletionMessageParam[],
  isRepair: boolean
): Promise<string> => {
  const { model } = getLlmConfig();
  const client = createLlmClient();
  const startedAt = Date.now();

  try {
    const response = await client.chat.completions.create({
      model,
      temperature: MODEL_TEMPERATURE,
      messages,
    });

    logModelCall({
      model,
      outcome: "ok",
      status: null,
      inputTokens: response.usage?.prompt_tokens ?? null,
      outputTokens: response.usage?.completion_tokens ?? null,
      durationMs: Date.now() - startedAt,
      repair: isRepair,
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    logModelCall({
      model,
      outcome: "error",
      status: error instanceof OpenAI.APIError ? (error.status ?? null) : null,
      inputTokens: null,
      outputTokens: null,
      durationMs: Date.now() - startedAt,
      repair: isRepair,
    });

    throw error;
  }
};

const requestCompletion = async (
  messages: ChatCompletionMessageParam[],
  isRepair: boolean
): Promise<string> => {
  try {
    return await withRetry(() => attemptCompletion(messages, isRepair));
  } catch (error) {
    throw mapProviderError(error);
  }
};

const buildBaseMessages = async (
  draftText: string
): Promise<ChatCompletionMessageParam[]> => {
  const systemPrompt = await loadSystemPrompt();

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify({ text: draftText }) },
  ];
};

export const askModel = async (draftText: string): Promise<string> => {
  const messages = await buildBaseMessages(draftText);

  return requestCompletion(messages, false);
};

export const askModelToRepair = async (
  draftText: string,
  brokenOutput: string,
  errorMessage: string
): Promise<string> => {
  const baseMessages = await buildBaseMessages(draftText);

  return requestCompletion(
    [
      ...baseMessages,
      { role: "assistant", content: brokenOutput },
      {
        role: "user",
        content: `Your previous answer was rejected for this reason: ${errorMessage}. Return only corrected JSON matching the schema.`,
      },
    ],
    true
  );
};