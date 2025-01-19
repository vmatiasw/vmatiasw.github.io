/**
 * Converts a string to a valid ID by replacing spaces with hyphens and converting to lowercase.
 *
 * @param text - The text to convert to an ID.
 * @returns A string with all spaces replaced by hyphens and converted to lowercase.
 */
export function createID(text: string): string {
  return `${text.replace(/\s+/g, "-")}`.toLowerCase();
}

/**
 * Capitalizes the first letter of a word and trim any leading/trailing whitespace.
 *
 * @param word - The word to capitalize.
 * @returns The word with the first letter capitalized.
 */
export function capitalize(word: string): string {
  const trimmed = word.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
