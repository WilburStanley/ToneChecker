import type { CheckToneOutput } from "@/llm/schema";

const STUB_RESPONSE: CheckToneOutput = {
  tone: "neutral",
  risk: "low",
  fix: "Stub mode: no model was called.",
  confidence: 0.9,
};

export const isStubMode = () => process.env.LLM_STUB === "1";

export const getStubResponse = (): CheckToneOutput => STUB_RESPONSE;