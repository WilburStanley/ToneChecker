import { readFile } from "node:fs/promises";
import path from "node:path";

const ENDPOINT_URL = "http://localhost:3000/api/check-tone";
const CASES_FILE = path.join(process.cwd(), "evals", "cases.json");
// OpenRouter free tier allows 20 requests per minute, so wait between calls.
const PAUSE_BETWEEN_CASES_MS = 3500;
const UNSURE_CONFIDENCE_LIMIT = 0.5;

type EvalCase = {
  id: string;
  text: string;
  expectedTone: string;
  note?: string;
};

type CaseResult = {
  id: string;
  expectedTone: string;
  gotTone: string | null;
  confidence: number | null;
  status: number;
  errorMessage: string | null;
  passed: boolean;
};

const waitFor = (durationMs: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, durationMs));

const loadCases = async (): Promise<EvalCase[]> => {
  const fileText = await readFile(CASES_FILE, "utf-8");

  return JSON.parse(fileText) as EvalCase[];
};

const runCase = async (evalCase: EvalCase): Promise<CaseResult> => {
  const response = await fetch(ENDPOINT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: evalCase.text }),
  });

  let body: Record<string, unknown> = {};

  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const gotTone = typeof body.tone === "string" ? body.tone : null;
  const confidence =
    typeof body.confidence === "number" ? body.confidence : null;
  const errorMessage = typeof body.error === "string" ? body.error : null;

  return {
    id: evalCase.id,
    expectedTone: evalCase.expectedTone,
    gotTone,
    confidence,
    status: response.status,
    errorMessage,
    passed: response.status === 200 && gotTone === evalCase.expectedTone,
  };
};

const formatConfidence = (confidence: number | null) =>
  confidence === null ? "n/a" : confidence.toFixed(2);

const printCaseLine = (result: CaseResult) => {
  const mark = result.passed ? "PASS" : "FAIL";
  const detail =
    result.status === 200
      ? `expected ${result.expectedTone}, got ${result.gotTone}, confidence ${formatConfidence(result.confidence)}`
      : `status ${result.status}: ${result.errorMessage ?? "no error message"}`;

  console.log(`${mark}  ${result.id}  ${detail}`);
};

const printSummary = (results: CaseResult[]) => {
  const passedCount = results.filter((result) => result.passed).length;
  const percentage = Math.round((passedCount / results.length) * 100);
  const failedResults = results.filter((result) => !result.passed);

  console.log("");
  console.log(`Score: ${passedCount}/${results.length} (${percentage}%)`);
  console.log(`Date: ${new Date().toISOString().slice(0, 10)}`);

  if (failedResults.length > 0) {
    console.log("");
    console.log("Failed cases:");
    failedResults.forEach((result) => {
      console.log(
        `- ${result.id}: expected ${result.expectedTone}, got ${result.gotTone ?? `status ${result.status}`}`
      );
    });
  }

  const unsureResult = results.find((result) => result.id.startsWith("unsure"));

  if (unsureResult && unsureResult.confidence !== null) {
    const isLowEnough = unsureResult.confidence < UNSURE_CONFIDENCE_LIMIT;

    console.log("");
    console.log(
      `Unsure case confidence: ${formatConfidence(unsureResult.confidence)} (${isLowEnough ? "below" : "NOT below"} ${UNSURE_CONFIDENCE_LIMIT})`
    );
  }
};

const main = async () => {
  const evalCases = await loadCases();
  const results: CaseResult[] = [];

  for (const [caseIndex, evalCase] of evalCases.entries()) {
    const result = await runCase(evalCase);

    results.push(result);
    printCaseLine(result);

    const isLastCase = caseIndex === evalCases.length - 1;

    if (!isLastCase) {
      await waitFor(PAUSE_BETWEEN_CASES_MS);
    }
  }

  printSummary(results);
};

main().catch((error) => {
  console.error("Eval run failed:", error);
  process.exit(1);
});