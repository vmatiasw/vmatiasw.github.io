import type { SkillSet } from "@/CVMapper";

/**
 * Generates a slug-like ID from a string, array of strings, or a SkillSet object.
 * Transforms spaces into hyphens and converts all characters to lowercase.
 * If a regular expression is provided, it extracts matching text before transforming.
 *
 * @param text - A string, array of strings, or SkillSet object (extracts 'name' properties if it's an object).
 * @param prefix - An optional prefix added to the resulting slug(s).
 * @param pattern - An optional regex pattern to extract specific text before creating the slug.
 * @returns A slug-like string or concatenated slugs based on the input text(s).
 */
export function createIDFromText(
  text: string | string[] | SkillSet,
  prefix: string = "",
  pattern?: RegExp,
): string {
  const texts: string[] = pattern
    ? [...extractUniqueMatches(pattern, text as string)]
    : Array.isArray(text)
      ? text
      : typeof text === "string"
        ? [text]
        : [...collectNestedKeyValues(text, "name")];

  return texts
    .map((text) => `${prefix + text.replace(/\s+/g, "-")}`.toLowerCase())
    .join(" ");
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

/**
 * Traverses an object copy and removes all objects that satisfy the purge condition.
 *
 * @param obj - The object to traverse.
 * @param purgeCondition - A function that returns true if the object should be purged.
 * @returns A new object with all objects that satisfy the purge condition removed.
 */
export function getPurgedObject(
  obj: Record<string, any>,
  purgeCondition: (obj: any) => boolean,
): any {
  const newObj = JSON.parse(JSON.stringify(obj));

  const traversePurge = (obj: any, purgeCondition: (obj: any) => boolean) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (purgeCondition(obj[key])) {
          delete obj[key];
        } else {
          traversePurge(obj[key], purgeCondition);
        }
      } else if (Array.isArray(obj[key]))
        obj[key].forEach((item: any) => {
          if (typeof item === "object" && item !== null)
            traversePurge(item, purgeCondition);
        });
    }
  };

  traversePurge(newObj, purgeCondition);
  return newObj;
}

/**
 * Collects all values from an object with the specified key name.
 *
 * @param obj - The object to traverse.
 * @param keyName - The key name to collect values from.
 * @returns A set of all values found in the object with the specified key name.
 */
export function collectNestedKeyValues(
  obj: Record<string, any>,
  keyName: string,
): Set<string> {
  const keyValues = new Set<string>();
  const traverseKeys = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach(traverseKeys);
    } else if (typeof obj === "object" && obj !== null) {
      if (keyName in obj) {
        keyValues.add(obj[keyName].toLowerCase());
      }
      Object.values(obj).forEach(traverseKeys);
    }
  };
  traverseKeys(obj);
  return keyValues;
}

/**
 * Maps the fields (keys and values) of an object using the specified function.
 *
 * @param obj - The object to map.
 * @param func - The function to apply to each field.
 * @returns A new object with the fields mapped.
 */
export function mapObjectFields<T>(
  obj: Record<string, any> & T,
  func: (field: any) => any,
): Record<string, any> & T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      func(key),
      Array.isArray(value) ? value.map(func) : func(value),
    ]),
  );
}

/**
 * Extracts unique matches from the text based on a given regex pattern.
 * It returns the first capture group from each match in lowercase.
 *
 * @param pattern - The regex pattern to match.
 * @param text - The input text to search.
 * @returns An array of unique, lowercase strings from the matches.
 */
export function extractUniqueMatches(
  pattern: RegExp,
  text: string,
): Set<string> {
  return new Set(
    (text.match(pattern) ?? []).map((match) =>
      match.replace(pattern, "$1").toLowerCase(),
    ),
  );
}
