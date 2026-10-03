import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  PROMPT_FILE_PREFIX,
  PROMPT_VERSION,
  PROMPTS_DIRECTORY,
} from "@/config/constants";

export const loadSystemPrompt = async (): Promise<string> => {
  const promptPath = path.join(
    process.cwd(),
    PROMPTS_DIRECTORY,
    `${PROMPT_FILE_PREFIX}-${PROMPT_VERSION}.md`
  );

  return readFile(promptPath, "utf-8");
};