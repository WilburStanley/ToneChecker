import { askModel } from "@/llm/call-model";
import type { CheckToneInput, CheckToneOutput } from "@/llm/schema";
import { getStubResponse, isStubMode } from "@/llm/stub";

export type CheckToneResult = CheckToneOutput | { rawModelText: string };

export const checkTone = async (
  input: CheckToneInput
): Promise<CheckToneResult> => {
  if (isStubMode()) {
    return getStubResponse();
  }

  const rawModelText = await askModel(input.text);

  return { rawModelText };
};