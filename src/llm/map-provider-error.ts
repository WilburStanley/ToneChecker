import OpenAI from "openai";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";
import { ApiError } from "@/lib/api-error";

const AUTH_STATUSES = [401, 403];
const RATE_LIMIT_STATUS = 429;
const SERVER_ERROR_MIN_STATUS = 500;

export const mapProviderError = (error: unknown): unknown => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return new ApiError(HTTP_STATUS.GATEWAY_TIMEOUT, ERROR_MESSAGES.LLM_TIMEOUT);
  }

  if (error instanceof OpenAI.APIConnectionError) {
    return new ApiError(
      HTTP_STATUS.BAD_GATEWAY,
      ERROR_MESSAGES.LLM_UNAVAILABLE
    );
  }

  if (error instanceof OpenAI.APIError && error.status !== undefined) {
    if (AUTH_STATUSES.includes(error.status)) {
      return new ApiError(
        HTTP_STATUS.BAD_GATEWAY,
        ERROR_MESSAGES.LLM_AUTH_FAILED
      );
    }

    if (error.status === RATE_LIMIT_STATUS) {
      return new ApiError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        ERROR_MESSAGES.LLM_RATE_LIMITED
      );
    }

    if (error.status >= SERVER_ERROR_MIN_STATUS) {
      return new ApiError(
        HTTP_STATUS.BAD_GATEWAY,
        ERROR_MESSAGES.LLM_UNAVAILABLE
      );
    }

    return new ApiError(
      HTTP_STATUS.BAD_GATEWAY,
      ERROR_MESSAGES.LLM_REQUEST_REJECTED
    );
  }

  return error;
};