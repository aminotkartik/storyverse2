import { COMMITMENTS } from "../data/content";

/**
 * Commitments are stored only in this browser (localStorage), as a list of
 * commitment ids with no duplicates. Nothing is sent anywhere, and nothing is
 * shared with other visitors.
 */
export const COMMITMENTS_KEY = "fifteen-seconds-commitments";
/** The earlier free-text notes key. Its entries are migrated once, if they match a commitment. */
const LEGACY_NOTES_KEY = "fifteen-seconds-notes";

const VALID_IDS = new Set(COMMITMENTS.map((c) => c.id));

const normalise = (text: string): string => text.trim().toLowerCase().replace(/\s+/g, " ");

function readJson(key: string): unknown {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

/** Returns the saved commitment ids, de-duplicated and limited to the known list. */
export function readCommitments(): string[] {
  const saved = readJson(COMMITMENTS_KEY);
  if (Array.isArray(saved)) {
    return [...new Set(saved.filter((id): id is string => typeof id === "string" && VALID_IDS.has(id)))];
  }

  // First visit on this browser: carry over legacy notes that match a commitment exactly.
  const legacy = readJson(LEGACY_NOTES_KEY);
  if (!Array.isArray(legacy)) return [];
  const byText = new Map(COMMITMENTS.map((c) => [normalise(c.text), c.id]));
  const migrated = new Set<string>();
  for (const note of legacy) {
    if (typeof note !== "string") continue;
    const id = byText.get(normalise(note));
    if (id) migrated.add(id);
  }
  return [...migrated];
}

export function writeCommitments(ids: readonly string[]): void {
  try {
    window.localStorage.setItem(COMMITMENTS_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    /* storage unavailable (private mode, quota): the choices still work for this visit */
  }
}
