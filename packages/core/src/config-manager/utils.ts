/**
 * Generates user-friendly grouping steps based on a minimum tick size.
 * Sequence: 1 -> 2.5 -> 5 -> 10 -> ...
 *
 * @param baseTick The minimum tick size (e.g. 0.0001)
 * @param steps Number of options to generate
 */
export function generateGroupingOptions(baseTick: number, steps = 9): number[] {
  const options: number[] = [baseTick];
  let current = baseTick;

  for (let i = 0; i < steps; i++) {
    // Normalize to scientific notation to determine the "base" (mantissa)
    // e.g. 0.0025 -> 2.5
    const magnitude = 10 ** Math.floor(Math.log10(current));
    const base = current / magnitude;

    // Use epsilon for float comparison safety
    const isCloseTo = (val: number, target: number) =>
      Math.abs(val - target) < 1e-9;

    let next: number;

    if (isCloseTo(base, 1)) {
      next = 2.5 * magnitude;
    } else if (isCloseTo(base, 2.5)) {
      next = 5 * magnitude;
    } else {
      // 5 -> 10
      next = 10 * magnitude;
    }

    // Fix floating point artifacts (e.g. 0.0003000004)
    next = Number(next.toPrecision(2));
    options.push(next);
    current = next;
  }

  return options;
}
