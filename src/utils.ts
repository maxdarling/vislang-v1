/**
 * Read a CSS custom property value as a number.
 * Returns the fallback if the property is not set or not a valid number.
 */
export function getCssVar(name: string, fallback: number): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return parseFloat(value) || fallback;
}
