export function mergeDeep<T extends object, U extends object>(
  target: T,
  source: U,
): T & U {
  // biome-ignore lint/suspicious/noExplicitAny: output type can be generalized
  const output: any = { ...target };

  for (const key in source) {
    if (Object.hasOwn(source, key) && source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = mergeDeep(
          (target as Record<string, unknown>)[key] ?? {},
          source[key],
        );
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}
