/**
 * Content moderation for voice check-in transcripts.
 * Detects abusive language and life-threatening statements.
 */

export type SafetySeverity = "safe" | "abusive" | "threat_to_life";

export interface ModerationResult {
  severity: SafetySeverity;
  isFlagged: boolean;
  matchedTerms: string[];
  requiresGuardianAlert: boolean;
  sanitizedTranscript: string;
}

/** Life-threatening phrases — immediate guardian alert. */
const THREAT_TO_LIFE_PATTERNS: readonly RegExp[] = [
  /\b(kill\s+my\s*self|kill\s+myself)\b/i,
  /\b(end\s+my\s+life)\b/i,
  /\b(want\s+to\s+die)\b/i,
  /\b(suicid(e|al))\b/i,
  /\b(self[\s-]?harm)\b/i,
  /\b(don'?t\s+want\s+to\s+live)\b/i,
  /\b(hurt\s+my\s*self|hurt\s+myself)\b/i,
  /\b(no\s+reason\s+to\s+live)\b/i,
  /\b(better\s+off\s+dead)\b/i,
  /\b(take\s+my\s+life)\b/i,
];

/** Abusive / harmful language — guardian alert if guardian opt-in enabled. */
const ABUSIVE_PATTERNS: readonly RegExp[] = [
  /\b(hate\s+my\s*self|hate\s+myself)\b/i,
  /\b(worthless|useless)\b/i,
  /\b(i'?m\s+a\s+failure)\b/i,
  /\b(nobody\s+cares)\b/i,
  /\b(can'?t\s+go\s+on)\b/i,
  /\b(give\s+up\s+on\s+life)\b/i,
  /\b(want\s+to\s+disappear)\b/i,
];

/**
 * Moderates transcript text for safety concerns.
 * @param transcript Raw speech-to-text output.
 * @returns Moderation result with severity and guardian alert flag.
 */
export function moderateTranscript(transcript: string): ModerationResult {
  const normalized = transcript.trim();
  if (!normalized) {
    return {
      severity: "safe",
      isFlagged: false,
      matchedTerms: [],
      requiresGuardianAlert: false,
      sanitizedTranscript: "",
    };
  }

  const threatMatches = findMatches(normalized, THREAT_TO_LIFE_PATTERNS);
  if (threatMatches.length > 0) {
    return {
      severity: "threat_to_life",
      isFlagged: true,
      matchedTerms: threatMatches,
      requiresGuardianAlert: true,
      sanitizedTranscript: redactTerms(normalized, threatMatches),
    };
  }

  const abuseMatches = findMatches(normalized, ABUSIVE_PATTERNS);
  if (abuseMatches.length > 0) {
    return {
      severity: "abusive",
      isFlagged: true,
      matchedTerms: abuseMatches,
      requiresGuardianAlert: true,
      sanitizedTranscript: redactTerms(normalized, abuseMatches),
    };
  }

  return {
    severity: "safe",
    isFlagged: false,
    matchedTerms: [],
    requiresGuardianAlert: false,
    sanitizedTranscript: normalized,
  };
}

function findMatches(text: string, patterns: readonly RegExp[]): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[0]) {
      matches.push(match[0]);
    }
  }
  return matches;
}

function redactTerms(text: string, terms: string[]): string {
  let result = text;
  for (const term of terms) {
    result = result.replace(new RegExp(escapeRegex(term), "gi"), "[REDACTED]");
  }
  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
