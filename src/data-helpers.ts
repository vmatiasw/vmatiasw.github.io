
/**
 * Filters out invalid entries (null or undefined values) from an object.
 *
 * @param obj - The object to filter, where each key is a string and the value is an array or null/undefined.
 * @returns An array of [key, value] tuples, or undefined if there are no valid entries.
 */
export function filterNonNullEntries<T>(
    obj: Record<string, T[] | null | undefined>,
  ): [string, T[]][] | undefined {
    const filteredEntries = Object.entries(obj).filter(
      ([_, value]) => value != null,
    );
    return filteredEntries.length > 0
    ? filteredEntries.map(([key, value]) => [key, value as T[]])
    : undefined;
  }