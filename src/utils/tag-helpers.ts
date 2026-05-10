/**
 * Strips out tag mentions (e.g., @tag) from description text
 * Returns clean description without any mention text
 */
export const stripTagsFromDescription = (text: string): string => {
  return text.replace(/@\S+/g, "").replace(/\s+/g, " ").trim();
};
