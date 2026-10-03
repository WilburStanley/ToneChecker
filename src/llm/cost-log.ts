import { PROMPT_VERSION } from "@/config/constants";

type ModelCallLog = {
  model: string;
  outcome: "ok" | "error";
  status: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  durationMs: number;
  repair: boolean;
};

export const logModelCall = (entry: ModelCallLog) => {
  console.log(
    JSON.stringify({
      event: "llm_call",
      timestamp: new Date().toISOString(),
      promptVersion: PROMPT_VERSION,
      ...entry,
    })
  );
};