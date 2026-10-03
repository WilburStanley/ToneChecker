import { ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";
import { isLlmEnabled } from "@/config/env";
import { ApiError } from "@/lib/api-error";
import { askModel, askModelToRepair } from "@/llm/call-model";
import { parseModelOutput } from "@/llm/parse-output";
import { writeToQuarantine } from "@/llm/quarantine";
import type { CheckToneInput, CheckToneOutput } from "@/llm/schema";
import { getStubResponse, isStubMode } from "@/llm/stub";

export const checkTone = async (
  input: CheckToneInput
): Promise<CheckToneOutput> => {
  if (!isLlmEnabled()) {
    throw new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_MESSAGES.LLM_DISABLED
    );
  }

  if (isStubMode()) {
    return getStubResponse();
  }

  const firstOutput = await askModel(input.text);
  const firstResult = parseModelOutput(firstOutput);

  if (firstResult.success) {
    return firstResult.data;
  }

  const repairOutput = await askModelToRepair(
    input.text,
    firstOutput,
    firstResult.error
  );
  const repairResult = parseModelOutput(repairOutput);

  if (repairResult.success) {
    return repairResult.data;
  }

  await writeToQuarantine({
    input: input.text,
    firstOutput,
    repairOutput,
    error: repairResult.error,
  });

  throw new ApiError(
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    ERROR_MESSAGES.MODEL_OUTPUT_INVALID
  );
};