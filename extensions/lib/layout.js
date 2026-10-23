/**
 * Shared horizontal geometry for the input block and the footer line.
 *
 * Both the input block (centered-input-block.js) and the footer notes
 * (fleet-footer.js) use these values so they stay aligned with each other.
 *
 * This file lives in a subdirectory without an index file, so pi does not
 * load it as an extension on its own.
 */

/** Side gutter as a fraction of the terminal width (0.022 → 2.2% each side). */
export const INSET_FRACTION = 0.022;

/** Minimum side gutter in columns. */
export const INSET_MIN = 2;

/** Columns of empty gutter kept on each side of the block and the footer. */
export function blockInset(width) {
  return Math.max(INSET_MIN, Math.floor(width * INSET_FRACTION));
}

/** Width of the content area between the gutters. */
export function blockContentWidth(width) {
  return Math.max(20, width - blockInset(width) * 2);
}
