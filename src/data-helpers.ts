/**
 * Filters an object based on a provided condition.
 *
 * This function traverses the input object recursively and applies the filter condition
 * to each element. If an element is an object, it continues to traverse and filter its properties.
 * If an element is an array, it filters and maps each item in the array.
 *
 * @param object - The object to be filtered.
 * @param filterCondition - A function that determines whether an element should be included.
 * @returns A new object with elements filtered based on the provided condition.
 */
export function getFilteredObject(
  object: Record<string, any>,
  filterCondition: (obj: any) => boolean,
): any {
  const traverseFilter = (obj: any): any => {
    for (const key of Object.keys(obj))
      if (typeof obj[key] === "object" && obj[key] !== null)
        obj[key] = Array.isArray(obj[key])
          ? obj[key]
              .filter(filterCondition)
              .map((item: any) => traverseFilter(item))
          : traverseFilter(obj[key]);
    return obj;
  };

  // FIXME: there are undefined values in the result:
  // const result = traverseFilter(JSON.parse(JSON.stringify(object)));
  // console.log(result.languages.flatMap((lang: any) => lang.technologies));

  return traverseFilter(JSON.parse(JSON.stringify(object)));
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
