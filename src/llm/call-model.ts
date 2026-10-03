import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { MODEL_TEMPERATURE } from "@/config/constants";
import { getLlmConfig } from "@/config/env";
import { createLlmClient } from "@/llm/client";
import { loadSystemPrompt } from "@/llm/prompt-loader";

const requestCompletion = async (
  messages: ChatCompletionMessageParam[]
): Promise<string> => {
  const { model } = getLlmConfig();
  const client = createLlmClient();

  const response = await client.chat.completions.create({
    model,
    temperature: MODEL_TEMPERATURE,
    messages,
  });

  return response.choices[0]?.message?.content ?? "";
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

  return requestCompletion(messages);
};

export const askModelToRepair = async (
  draftText: string,
  brokenOutput: string,
  errorMessage: string
): Promise<string> => {
  const baseMessages = await buildBaseMessages(draftText);

  return requestCompletion([
    ...baseMessages,
    { role: "assistant", content: brokenOutput },
    {
      role: "user",
      content: `Your previous answer was rejected for this reason: ${errorMessage}. Return only corrected JSON matching the schema.`,
    },
  ]);
};