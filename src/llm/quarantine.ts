import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  PROMPT_VERSION,
  QUARANTINE_DIRECTORY,
  QUARANTINE_FILE,
} from "@/config/constants";

type QuarantineEntry = {
  input: string;
  firstOutput: string;
  repairOutput: string;
  error: string;
};

export const writeToQuarantine = async (entry: QuarantineEntry) => {
  try {
    const directoryPath = path.join(process.cwd(), QUARANTINE_DIRECTORY);
    await mkdir(directoryPath, { recursive: true });

    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      promptVersion: PROMPT_VERSION,
      ...entry,
    });

    await appendFile(path.join(directoryPath, QUARANTINE_FILE), `${line}\n`);
  } catch (error) {
    console.error("Could not write to quarantine log:", error);
  }
};