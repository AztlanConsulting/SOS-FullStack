/**
 * Removes all emoji characters from a string
 * @param str - The input string
 * @returns The string with emojis removed and trimmed
 */
export const stripEmojis = (str: string): string =>
  str
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .trim();
