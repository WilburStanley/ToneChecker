import type { CheckToneOutput } from "@/llm/schema";
import {
  formatConfidence,
  RISK_DISPLAY,
  TONE_DISPLAY,
} from "@/lib/tone-display";

type ToneResultProps = {
  result: CheckToneOutput;
};

const ToneResult = ({ result }: ToneResultProps) => {
  const toneStyle = TONE_DISPLAY[result.tone];
  const riskStyle = RISK_DISPLAY[result.risk];

  const badges = [
    { key: "tone", label: toneStyle.label, badgeClass: toneStyle.badgeClass },
    { key: "risk", label: riskStyle.label, badgeClass: riskStyle.badgeClass },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((badge) => (
          <span
            key={badge.key}
            className={`rounded-full px-3 py-1 text-sm font-medium ${badge.badgeClass}`}
          >
            {badge.label}
          </span>
        ))}
        <span className="text-sm text-gray-400">
          {formatConfidence(result.confidence)} confident
        </span>
      </div>
      <p className="text-gray-100">{result.fix}</p>
    </div>
  );
};

export default ToneResult;