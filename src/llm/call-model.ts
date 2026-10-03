import { MODEL_TEMPERATURE } from "@/config/constants";
import { getLlmConfig } from "@/config/env";
import { createLlmClient } from "@/llm/client";
import { loadSystemPrompt } from "@/llm/prompt-loader";

export const askModel = async (draftText: string): Promise<string> => {
  const { model } = getLlmConfig();
  const client = createLlmClient();
  const systemPrompt = await loadSystemPrompt();

  const response = await client.chat.completions.create({
    model,
    temperature: MODEL_TEMPERATURE,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify({ text: draftText }) },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
};