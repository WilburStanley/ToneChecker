import OpenAI from "openai";
import {
  RETRY_BASE_DELAY_MS,
  RETRY_JITTER_MS,
  RETRY_MAX_RETRIES,
  RETRY_MAX_WAIT_MS,
} from "@/config/constants";

const RATE_LIMIT_STATUS = 429;
const SERVER_ERROR_MIN_STATUS = 500;
const MILLISECONDS_PER_SECOND = 1000;

const waitFor = (durationMs: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, durationMs));

const readHeader = (headers: unknown, name: string): string | null => {
  if (!headers) {
    return null;
  }

  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name);
  }

  const headerRecord = headers as Record<string, string | undefined>;

  return headerRecord[name] ?? null;
};

// Retry-After is either a number of seconds or an HTTP date.
const parseRetryAfterMs = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const seconds = Number(value);

  if (!Number.isNaN(seconds)) {
    return seconds * MILLISECONDS_PER_SECOND;
  }

  const dateMs = Date.parse(value);

  if (!Number.isNaN(dateMs)) {
    return Math.max(dateMs - Date.now(), 0);
  }

  return null;
};

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return true;
  }

  if (error instanceof OpenAI.APIError && error.status !== undefined) {
    return (
      error.status === RATE_LIMIT_STATUS ||
      error.status >= SERVER_ERROR_MIN_STATUS
    );
  }

  return false;
};

const getDelayMs = (error: unknown, attemptIndex: number): number => {
  if (error instanceof OpenAI.APIError) {
    const retryAfterMs = parseRetryAfterMs(
      readHeader(error.headers, "retry-after")
    );

    if (retryAfterMs !== null) {
      return retryAfterMs;
    }
  }

  const backoffMs = RETRY_BASE_DELAY_MS * 2 ** attemptIndex;
  const jitterMs = Math.random() * RETRY_JITTER_MS;

  return backoffMs + jitterMs;
};

export const withRetry = async <Result>(
  operation: () => Promise<Result>
): Promise<Result> => {
  for (let attemptIndex = 0; ; attemptIndex += 1) {
    try {
      return await operation();
    } catch (error) {
      const canRetry =
        isRetryableError(error) && attemptIndex < RETRY_MAX_RETRIES;

      if (!canRetry) {
        throw error;
      }

      const delayMs = getDelayMs(error, attemptIndex);

      if (delayMs > RETRY_MAX_WAIT_MS) {
        throw error;
      }

      console.warn(
        JSON.stringify({
          event: "llm_retry",
          attempt: attemptIndex + 1,
          delayMs: Math.round(delayMs),
        })
      );

      await waitFor(delayMs);
    }
  }
};