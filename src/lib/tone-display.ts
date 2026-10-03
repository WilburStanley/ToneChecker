import type { RISKS, TONES } from "@/config/constants";

type Tone = (typeof TONES)[number];
type Risk = (typeof RISKS)[number];

type DisplayStyle = {
  label: string;
  badgeClass: string;
};

export const TONE_DISPLAY: Record<Tone, DisplayStyle> = {
  friendly: { label: "Friendly", badgeClass: "bg-green-500/15 text-green-300" },
  neutral: { label: "Neutral", badgeClass: "bg-gray-500/20 text-gray-300" },
  pushy: { label: "Pushy", badgeClass: "bg-orange-500/15 text-orange-300" },
  rude: { label: "Rude", badgeClass: "bg-red-500/15 text-red-300" },
  casual: { label: "Casual", badgeClass: "bg-blue-500/15 text-blue-300" },
  formal: { label: "Formal", badgeClass: "bg-purple-500/15 text-purple-300" },
};

export const RISK_DISPLAY: Record<Risk, DisplayStyle> = {
  low: { label: "Low risk", badgeClass: "bg-green-500/15 text-green-300" },
  medium: {
    label: "Medium risk",
    badgeClass: "bg-yellow-500/15 text-yellow-300",
  },
  high: { label: "High risk", badgeClass: "bg-red-500/15 text-red-300" },
};

const PERCENT_MULTIPLIER = 100;

export const formatConfidence = (confidence: number) =>
  `${Math.round(confidence * PERCENT_MULTIPLIER)}%`;