import { ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";
import { ApiError } from "@/lib/api-error";
import type { CheckToneInput, CheckToneOutput } from "@/llm/schema";
import { getStubResponse, isStubMode } from "@/llm/stub";

export const checkTone = async (
  input: CheckToneInput
): Promise<CheckToneOutput> => {
  if (isStubMode()) {
    return getStubResponse();
  }

  throw new ApiError(
    HTTP_STATUS.NOT_IMPLEMENTED,
    ERROR_MESSAGES.MODEL_NOT_IMPLEMENTED
  );
};