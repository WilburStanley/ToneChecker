import { checkToneOutputSchema, type CheckToneOutput } from "@/llm/schema";

export type ParseResult =
  | { success: true; data: CheckToneOutput }
  | { success: false; error: string };

const NOT_JSON_ERROR = "The answer did not contain a JSON object.";
const INVALID_JSON_ERROR = "The answer was not valid JSON.";

const extractJsonObject = (rawText: string): string | null => {
  const startIndex = rawText.indexOf("{");
  const endIndex = rawText.lastIndexOf("}");

  if (startIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  return rawText.slice(startIndex, endIndex + 1);
};

export const parseModelOutput = (rawText: string): ParseResult => {
  const jsonText = extractJsonObject(rawText);

  if (!jsonText) {
    return { success: false, error: NOT_JSON_ERROR };
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    return { success: false, error: INVALID_JSON_ERROR };
  }

  const validation = checkToneOutputSchema.safeParse(parsedJson);

  if (!validation.success) {
    const issueSummary = validation.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");

    return { success: false, error: issueSummary };
  }

  return { success: true, data: validation.data };
};