/** Collapses Open Library's `string | { value }` text fields to a trimmed string, or undefined when empty. */
export function normalizeText(text: string | { value: string } | undefined): string | undefined {
  const value = typeof text === 'string' ? text : text?.value;
  const trimmed = value?.replace(/\r\n/g, '\n').trim();
  return trimmed ? trimmed : undefined;
}

/** `/works/OL27482W` -> `OL27482W`, `/authors/OL26320A` -> `OL26320A`. */
export function keyToId(key: string): string {
  return key.slice(key.lastIndexOf('/') + 1);
}
