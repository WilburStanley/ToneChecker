"use client";

import { useState } from "react";
import type { CheckToneOutput } from "@/llm/schema";

const ENDPOINT_URL = "/api/check-tone";
const NETWORK_ERROR_MESSAGE = "Could not reach the server. Is it running?";
const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const useCheckTone = () => {
  const [result, setResult] = useState<CheckToneOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkTone = async (text: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(
          typeof responseBody?.error === "string"
            ? responseBody.error
            : FALLBACK_ERROR_MESSAGE
        );
        return;
      }

      setResult(responseBody as CheckToneOutput);
    } catch {
      setErrorMessage(NETWORK_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  return { result, errorMessage, isLoading, checkTone };
};