import { z } from "zod";
import { MAX_TEXT_LENGTH, RISKS, TONES } from "@/config/constants";

export const checkToneInputSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "text must not be empty")
    .max(MAX_TEXT_LENGTH, `text must be at most ${MAX_TEXT_LENGTH} characters`),
});

export const checkToneOutputSchema = z.object({
  tone: z.enum(TONES),
  risk: z.enum(RISKS),
  fix: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export type CheckToneInput = z.infer<typeof checkToneInputSchema>;
export type CheckToneOutput = z.infer<typeof checkToneOutputSchema>;