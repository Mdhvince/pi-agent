/**
 * Centered input block.
 *
 * Renders the pi input editor as one centered block with a light-black
 * background, instead of a full-width line with thin "─" borders.
 *
 * The horizontal geometry is shared with the footer notes, see lib/layout.js.
 * Tune the constants there, then run /reload in pi.
 *
 * ── Styles ───────────────────────────────────────────────────────────────
 *
 * FRAME.style selects the working indicator:
 *
 *   "dust"      a field of dots that fades in and out over the block while
 *               the agent works. The default.
 *   "gradient"  a coloured line that travels around the block while the
 *               agent works.
 *   "none"      no indicator, just the plain filled block.
 *
 * Both animated styles are the working indicator. They show only while the
 * agent is busy, and neither changes the size of the block.
 *
 * ── Dust style ───────────────────────────────────────────────────────────
 *
 * The whole block becomes a field of cells. Two layers drive it:
 *
 *   - a slow noise field, which makes the dots gather into clumps and open
 *     voids. Without it the scatter is even, which reads as a lattice.
 *   - a per-cell clock, which makes each dot dissolve and re-form on its own.
 *
 * The noise field drifts sideways, so the whole pattern travels across the
 * block like dust in a light breeze. Dust dots pick one of three glyph heights
 * so they never line up into rows, and rare brighter dots (motes, the "•")
 * sit among them.
 *
 * The field never covers text: a cell holding a glyph, the cursor, or a
 * scroll hint keeps its content and the dust yields. Density is a share of
 * the available blank cells, so a narrow block has proportionally fewer dots.
 *
 * While the dust is up, the block fill dissolves into the page background, so
 * the grey panel disappears and only the dots and the text remain. The fill
 * comes back when the dust fades out. The page colour is read from the
 * theme's export.pageBg.
 *
 *   hue        base theme token for the dust. The busy state overrides it:
 *              working uses this hue, retry uses "warning", and compaction
 *              and branch summary use "dim".
 *   density    share of blank cells that are visible at any moment.
 *   moteShare  share of the visible cells that are bright motes.
 *   cycleMs    duration of one dissolve cycle for a cell.
 *   fadeMs     time to fade the whole field in, and out again.
 *   drift      travel speed of the pattern, in columns per second. 0 = still.
 *   noiseScale size of the clumps, in columns and rows. Larger is calmer.
 *   glyphs     glyphs for a dust dot, picked per cell at three heights, and
 *              the glyph for a mote.
 *
 * Brightness is quantised to eight steps above the background, so the falloff
 * is smooth and the field keeps its shape on a terminal that is not truecolor.
 * The density is calibrated against the measured value distribution; changing
 * noiseScale or drift shifts that calibration slightly.
 *
 * ── Gradient style ───────────────────────────────────────────────────────
 *
 * A coloured line drawn on the block: a top edge, a bottom edge and one
 * column on each side. The gradient position advances on a timer, so the
 * colours travel along the perimeter.
 *
 *   rounded    rounded corners (╭ ╮ ╰ ╯) instead of square ones
 *   stops      theme tokens the gradient cycles through
 *   steps      color buckets around the perimeter, keeps the output small
 *   animate    "always" | "working" | "never"
 *   speed      phase step per tick
 *   intervalMs milliseconds per tick
 */
import { readFileSync } from "node:fs";
import { CustomEditor } from "@earendil-works/pi-coding-agent";
import { colorToHex, mixColors, parseColor, visibleWidth } from "@earendil-works/pi-tui";
import { blockContentWidth, blockInset } from "./lib/layout.js";

// ── Tunables ────────────────────────────────────────────────────────────────

/** Theme background token used for the block fill. */
const BG_TOKEN = "customMessageBg";

/** Blank background rows kept above and below the input text. */
const PAD_TOP = 0;
const PAD_BOTTOM = 0;

/** Left/right padding of the text inside the block, in columns. */
const INNER_PADDING_X = 1;

/** Working indicator style. See the file header. */
const FRAME = {
  style: "dust",
  // Gradient style.
  rounded: true,
  stops: ["accent", "success", "warning", "error"],
  steps: 48,
  animate: "working",
  speed: 0.04,
  intervalMs: 80,
  // Dust style is tuned in DUST below.
};

/** Dust style, used when FRAME.style is "dust". */
const DUST = {
  hue: "accent",
  density: 0.4,
  moteShare: 0.1,
  cycleMs: 500,
  fadeMs: 400,
  /** How fast the pattern travels across the block, in columns per second. */
  drift: 0,
  /** Size of the soft brightness patches, in columns and rows. */
  noiseScale: { x: 7, y: 2.4 },
  /** Glyphs sit at different heights, so dots do not form horizontal lines. */
  glyphs: { dust: [".", "·", "˙"], mote: "•" },
};

/** Hue per busy state. A null value uses DUST.hue. */
const KIND_HUE = {
  working: null,
  retry: "warning",
  compaction: "dim",
  branchSummary: "dim",
};

/** Brightness steps above the background, as a share of the dust hue. */
const DUST_LEVELS = [0, 0.08, 0.16, 0.25, 0.36, 0.48, 0.62, 0.78, 1];

/** Zero-width markers pi wraps around the fake cursor. */
const FAKE_CURSOR_START = "\x1b_pi:fc\x07";
const FAKE_CURSOR_END = "\x1b_pi:/fc\x07";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Stable pseudo-random value in [0, 1) for a cell coordinate. */
function cellHash(x, y, salt) {
  let h = Math.imul(x + 1, 0x27d4eb2d) ^ Math.imul(y + 1, 0x165667b1) ^ Math.imul(salt + 1, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/**
 * Measured field quantiles: the value above which a cell is visible, for a
 * requested density. The noise field is not evenly distributed, so these were
 * measured against the constants shipped here rather than derived.
 * Changing noiseScale or drift shifts the calibration slightly.
 */
const DENSITY_THRESHOLD = [
  [0.02, 0.985],
  [0.1, 0.899],
  [0.2, 0.728],
  [0.3, 0.547],
  [0.4, 0.417],
  [0.5, 0.296],
  [0.6, 0.186],
  [0.7, 0.087],
  [0.8, 0.03],
];

/** Field value above which a cell is visible, for the requested density. */
function visibleThreshold(density) {
  const d = Math.min(0.8, Math.max(0.02, density));
  for (let i = 1; i < DENSITY_THRESHOLD.length; i++) {
    const [d1, t1] = DENSITY_THRESHOLD[i];
    if (d <= d1) {
      const [d0, t0] = DENSITY_THRESHOLD[i - 1];
      const k = (d - d0) / (d1 - d0);
      return t0 + (t1 - t0) * k;
    }
  }
  return DENSITY_THRESHOLD[DENSITY_THRESHOLD.length - 1][1];
}

/**
 * Smooth value noise. Returns 0..1, and neighbouring positions give similar
 * values, which is what makes the dots clump into patches instead of forming
 * an even scatter.
 */
/** Smooth 0..1 remap between two edges. */
function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function valueNoise(x, y, salt) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  // Smoothstep keeps the transition between grid points soft.
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const n00 = cellHash(x0, y0, salt);
  const n10 = cellHash(x0 + 1, y0, salt);
  const n01 = cellHash(x0, y0 + 1, salt);
  const n11 = cellHash(x0 + 1, y0 + 1, salt);
  const top = n00 + (n10 - n00) * sx;
  const bottom = n01 + (n11 - n01) * sx;
  return top + (bottom - top) * sy;
}

/** Cached page background of the active theme. */
let pageColorCache = { path: null, color: null };

/**
 * Background the block sits on, so the fill can dissolve into it while the
 * dust takes over. Read from the theme's export.pageBg, which is the colour
 * the theme uses for the page around panels. Returns null when unknown.
 */
function pageBackground(theme) {
  const path = theme?.sourcePath;
  if (path && pageColorCache.path === path) return pageColorCache.color;
  let color = null;
  if (path) {
    try {
      const json = JSON.parse(readFileSync(path, "utf8"));
      const vars = json?.vars ?? {};
      let value = json?.export?.pageBg;
      const seen = new Set();
      while (typeof value === "string" && value in vars && !seen.has(value)) {
        seen.add(value);
        value = vars[value];
      }
      if (typeof value === "string" && value.length > 0) color = parseColor(value);
    } catch {
      color = null;
    }
  }
  pageColorCache = { path: path ?? null, color };
  return color;
}

// ── Editor ──────────────────────────────────────────────────────────────────

class BlockEditor extends CustomEditor {
  constructor(tui, editorTheme, keybindings, options) {
    super(tui, editorTheme, keybindings, {
      paddingX: options?.paddingX ?? INNER_PADDING_X,
      autocompleteMaxVisible: options?.autocompleteMaxVisible ?? 5,
      // Pi hands the working status to the editor, which is how the styles
      // know the agent is busy.
      embedWorkingStatus: true,
    });
    /** Position of the gradient along the perimeter, 0..1. */
    this.phase = 0;
    /** Monotonic clock in milliseconds, advanced by the animation timer. */
    this.clock = 0;
    /** Current dust opacity, 0..1, driven by the fade. */
    this.dustLevel = 0;
    /** Timestamp of the last render, used to stop the animation. */
    this.lastRenderAt = 0;
    /** Per-cell animation parameters, keyed by "x:y". */
    this.dustCells = new Map();
    /** Colour escape per brightness level, rebuilt when the hue changes. */
    this.dustEscapes = [];
    this.dustHueKey = "";
    /** Background for the current render: undefined = theme fill, null = none. */
    this.renderBg = undefined;
    /** Set when custom rendering failed: the block falls back to the base editor. */
    this.degraded = false;
  }

  /**
   * The host copies the default editor padding onto a custom editor.
   * The block owns its inner padding, so ignore that copy.
   */
  setPaddingX() {}

  /** Full theme (with bg()), resolved lazily so theme switches apply. */
  getTheme() {
    return this.resolveTheme?.() ?? null;
  }

  /** Wrap text in the background colour of the current render. */
  paint(text) {
    const theme = this.getTheme();
    if (!theme) return text;
    try {
      if (this.renderBg === undefined) return theme.bg(BG_TOKEN, text);
      if (this.renderBg === null) return text;
      return theme.style(text, { bg: this.renderBg });
    } catch {
      return text;
    }
  }

  /** Pad a plain string to the given visible width. */
  pad(text, width) {
    const used = visibleWidth(text);
    return used >= width ? text : text + " ".repeat(width - used);
  }

  /** Label for the hidden-lines indicator. */
  scrollLabel(arrow, count) {
    return count > 0 ? `${arrow} ${count} more ` : "";
  }

  /** Active style. A degraded block renders as a plain block. */
  styleMode() {
    if (this.degraded) return "none";
    return FRAME.style === "gradient" || FRAME.style === "dust" ? FRAME.style : "none";
  }

  /** The working status is on screen. */
  statusActive() {
    return !!this.workingStatusIndicator;
  }

  /** Kind of the current busy state, or null when idle. */
  busyKind() {
    return this.workingStatusIndicator?.kind ?? null;
  }

  renderTopBorder(width, hiddenLineCount) {
    if (this.styleMode() === "gradient" && this.frameActive()) return this.frameEdgeCells(width, true);
    return this.paint(this.pad(this.scrollLabel("↑", hiddenLineCount), width));
  }

  renderBottomBorder(width, hiddenLineCount) {
    if (this.styleMode() === "gradient" && this.frameActive()) return this.frameEdgeCells(width, false);
    return this.paint(this.pad(this.scrollLabel("↓", hiddenLineCount), width));
  }

  render(width) {
    if (this.degraded) return super.render(width);
    try {
      return this.renderBlock(width);
    } catch (error) {
      this.disableCustomRendering(error);
      return super.render(width);
    }
  }

  /**
   * The custom render, separate so that a failure can fall back to the base
   * editor without losing the whole session.
   */
  renderBlock(width) {
    this.lastRenderAt = Date.now();
    this.updateAnimation();

    const inset = blockInset(width);
    const gutter = " ".repeat(inset);
    const contentWidth = blockContentWidth(width);
    const style = this.styleMode();
    // While the dust is up the fill dissolves into the page background, so the
    // block stops reading as a grey panel and the dots take over.
    this.renderBg = style === "dust" ? this.dustBackground() : undefined;
    // The gradient style reserves two columns for its vertical borders, so
    // the block never resizes when the frame appears.
    const fillWidth = Math.max(20, style === "gradient" ? contentWidth - 2 : contentWidth);

    // super.render() returns [topBorder, ...content, bottomBorder, ...autocomplete]
    const rendered = super.render(fillWidth);
    const acHeight = this.renderedAutocompleteHeight || 0;
    const bottomIndex = rendered.length - acHeight - 1;

    const top = rendered[0] ?? this.paint(" ".repeat(fillWidth));
    const bottom = rendered[bottomIndex] ?? this.paint(" ".repeat(fillWidth));
    const content = rendered.slice(1, bottomIndex);
    const autocomplete = acHeight > 0 ? rendered.slice(bottomIndex + 1) : [];

    const innerRows = [top];
    for (let i = 0; i < PAD_TOP; i++) innerRows.push(this.paint(" ".repeat(fillWidth)));
    for (const line of content) innerRows.push(this.paint(this.pad(line, fillWidth)));
    for (const line of autocomplete) innerRows.push(this.paint(this.pad(line, fillWidth)));
    for (let i = 0; i < PAD_BOTTOM; i++) innerRows.push(this.paint(" ".repeat(fillWidth)));
    innerRows.push(bottom);

    let rows;
    if (style === "gradient") rows = this.renderFrame(innerRows);
    else if (style === "dust") rows = this.renderDust(innerRows);
    else rows = innerRows;

    return rows.map((row) => gutter + row + gutter);
  }

  /**
   * A custom render failed. Keep the session alive on the base editor for
   * the rest of the session, and say so once instead of crashing the TUI.
   */
  disableCustomRendering(error) {
    this.degraded = true;
    this.stopAnimation();
    console.error(`centered-input-block: fell back to the base editor (${error})`);
  }

  // ── Dust field ────────────────────────────────────────────────────────────

  /**
   * Background of the block for the current dust opacity. Undefined means the
   * theme fill, null means the terminal default, a colour is a blend of both.
   */
  dustBackground() {
    const theme = this.getTheme();
    if (!theme) return undefined;
    if (this.dustLevel <= 0) return undefined;
    const fill = theme.colors[BG_TOKEN];
    const page = pageBackground(theme);
    if (!fill || !page) return this.dustLevel >= 1 ? null : undefined;
    if (this.dustLevel >= 1) return null;
    return mixColors(fill, page, this.dustLevel);
  }

  /** Colour the dust blends into: the current background, or the page. */
  dustBackdrop() {
    const theme = this.getTheme();
    if (!theme) return undefined;
    if (this.renderBg && this.renderBg !== null) return this.renderBg;
    return pageBackground(theme);
  }

  /** Animation parameters for one cell, computed once and cached. */
  dustCell(x, y) {
    const key = `${x}:${y}`;
    const cached = this.dustCells.get(key);
    if (cached) return cached;
    const glyphs = DUST.glyphs.dust;
    const cell = {
      phase: cellHash(x, y, 1) * Math.PI * 2,
      jitter: 0.7 + cellHash(x, y, 2) * 0.6,
      mote: cellHash(x, y, 3) < DUST.moteShare,
      // A fixed height per cell keeps the scatter stable instead of flickering.
      glyph: glyphs[Math.min(glyphs.length - 1, Math.floor(cellHash(x, y, 4) * glyphs.length))],
    };
    this.dustCells.set(key, cell);
    return cell;
  }

  /** Theme token used for the current busy state. */
  dustHue() {
    const kind = this.busyKind();
    return (kind && KIND_HUE[kind]) || DUST.hue;
  }

  /**
   * Colour escape per brightness level. Rebuilt only when the hue or the
   * theme colours change, so a frame reuses the same strings.
   */
  dustEscapesFor(theme, hue, backdrop) {
    const accent = theme.colors[hue] ?? theme.colors.accent;
    if (!accent) return null;
    const target = backdrop ?? theme.colors[BG_TOKEN];
    if (!target) return null;
    const key = `${hue}|${colorToHex(target)}`;
    if (key === this.dustHueKey && this.dustEscapes.length === DUST_LEVELS.length) return this.dustEscapes;
    this.dustEscapes = DUST_LEVELS.map((level) => {
      if (level <= 0) return "";
      // theme.fg takes a token name only; theme.style accepts a color object,
      // and wraps the text in an opening escape and a closing reset.
      const wrapped = theme.style("\u0000", { fg: mixColors(accent, target, 1 - level) });
      return wrapped.slice(0, Math.max(0, wrapped.indexOf("\u0000")));
    });
    this.dustHueKey = key;
    return this.dustEscapes;
  }

  /**
   * Overlay the dust field on one rendered row. Cells that hold a glyph, the
   * cursor, or a label keep their content and the dust yields to them.
   * Consecutive cells of the same brightness share one escape sequence.
   */
  overlayDust(row, y, escapes) {
    const theme = this.getTheme();
    if (!theme || !escapes) return row;
    const opacity = this.dustLevel;
    if (opacity <= 0) return row;

    const threshold = visibleThreshold(DUST.density);
    const width = visibleWidth(row);
    let out = "";
    let run = "";
    let runLevel = -1;
    const flush = () => {
      if (!run) return;
      out += escapes[runLevel] + run + "\x1b[39m";
      run = "";
      runLevel = -1;
    };
    const emit = (level, glyph) => {
      if (level !== runLevel) {
        flush();
        runLevel = level;
      }
      run += glyph;
    };

    let col = 0;
    let i = 0;
    // The cursor must never be covered: pi draws it between two zero-width
    // markers and may also invert the character. The dust yields to both.
    let inCursorSpan = false;
    let inverted = false;
    while (i < row.length) {
      if (row[i] === "\x1b") {
        const esc = this.readEscape(row, i);
        if (esc === FAKE_CURSOR_START) inCursorSpan = true;
        else if (esc === FAKE_CURSOR_END) inCursorSpan = false;
        else if (esc === "\x1b[7m") inverted = true;
        else if (esc === "\x1b[27m") inverted = false;
        flush();
        out += esc;
        i += esc.length;
        continue;
      }
      const ch = String.fromCodePoint(row.codePointAt(i));
      if (ch === " " && !inCursorSpan && !inverted) {
        const cell = this.dustCell(col, y);
        const cycle = (this.clock / (DUST.cycleMs * cell.jitter) + cell.phase) % (Math.PI * 2);
        const twinkle = 0.5 + 0.5 * Math.sin(cycle);
        // A slow noise field supplies the clumps: neighbouring cells share a
        // value, so the field opens voids and gathers patches as it drifts.
        const drift = (this.clock / 1000) * DUST.drift;
        const clump = valueNoise(
          (col + drift) / DUST.noiseScale.x,
          y / DUST.noiseScale.y,
          7,
        );
        // Pull the product toward the extremes so the field spreads evenly.
        const wave = smoothstep(0.18, 0.78, clump * (0.55 + 0.45 * twinkle));
        if (wave > threshold) {
          const bright = Math.min(1, ((wave - threshold) / (1 - threshold)) * opacity);
          const last = DUST_LEVELS.length - 1;
          const level = cell.mote
            ? Math.round(last * 0.55) + Math.min(last - Math.round(last * 0.55), Math.floor(bright * 5))
            : 1 + Math.min(4, Math.floor(bright * 5));
          if (escapes[level]) {
            emit(level, cell.mote ? DUST.glyphs.mote : cell.glyph);
            col += 1;
            i += ch.length;
            continue;
          }
        }
      }
      flush();
      out += ch;
      col += 1;
      i += ch.length;
    }
    flush();
    const used = visibleWidth(out);
    return used >= width ? out : out + " ".repeat(width - used);
  }

  /** Read one escape sequence starting at `i`. */
  readEscape(s, i) {
    const next = s[i + 1];
    if (next === "[") {
      let j = i + 2;
      while (j < s.length && (s[j] === ";" || s[j] === ":" || (s[j] >= "0" && s[j] <= "9"))) j++;
      return s.slice(i, Math.min(s.length, j + 1));
    }
    if (next === "]" || next === "_") {
      let j = i + 2;
      while (j < s.length) {
        if (s[j] === "\x07") return s.slice(i, j + 1);
        if (s[j] === "\x1b" && s[j + 1] === "\\") return s.slice(i, j + 2);
        j++;
      }
      return s.slice(i);
    }
    return s.slice(i, i + 2);
  }

  /** Apply the dust field to every row of the block. */
  renderDust(rows) {
    const theme = this.getTheme();
    if (!theme || this.dustLevel <= 0) return rows;
    const escapes = this.dustEscapesFor(theme, this.dustHue(), this.dustBackdrop());
    if (!escapes) return rows;
    // The rows already carry the block background.
    return rows.map((row, index) => this.overlayDust(row, index, escapes));
  }

  // ── Gradient frame ────────────────────────────────────────────────────────

  /** The gradient frame is drawn. It is the working indicator. */
  frameActive() {
    if (FRAME.animate === "never") return false;
    if (FRAME.animate === "always") return true;
    return this.statusActive();
  }

  /** Color of the gradient at a perimeter position (0..1). */
  frameColor(u) {
    const theme = this.getTheme();
    if (!theme) return undefined;
    const stops = FRAME.stops.map((token) => theme.colors[token]).filter(Boolean);
    if (stops.length === 0) return undefined;
    const scaled = ((((u % 1) + 1) % 1) * stops.length);
    const index = Math.floor(scaled) % stops.length;
    const next = (index + 1) % stops.length;
    return mixColors(stops[index], stops[next], scaled - Math.floor(scaled));
  }

  /**
   * Color a run of border cells. Cells that fall in the same color bucket
   * share one escape sequence, which keeps the output small. The background
   * is painted under the glyph, so the block keeps the same filled area
   * whether the frame is on or off.
   */
  paintCells(cells) {
    const theme = this.getTheme();
    if (!theme) return cells.map((cell) => cell.char).join("");
    let output = "";
    let run = "";
    let runBucket = -1;
    const flush = (bucket) => {
      output += theme.style(run, { fg: this.frameColor((bucket + 0.5) / FRAME.steps), bg: BG_TOKEN });
      run = "";
    };
    for (const cell of cells) {
      const bucket = Math.floor(((((cell.u + this.phase) % 1) + 1) % 1) * FRAME.steps);
      if (bucket !== runBucket) {
        if (run) flush(runBucket);
        runBucket = bucket;
      }
      run += cell.char;
    }
    if (run) flush(runBucket);
    return output;
  }

  /**
   * One border cell: gradient when the frame is on, empty when off.
   * A space is used instead of the glyph, because the background color
   * would still draw the glyph in the default foreground color.
   */
  borderCell(char, u) {
    if (!this.frameActive()) return this.paint(" ");
    return this.paintCells([{ char, u }]);
  }

  /** The horizontal cells of the top or bottom edge. */
  frameEdgeCells(width, isTop) {
    const cells = [];
    for (let x = 0; x < width; x++) {
      const u = isTop
        ? ((x + 1) / (width + 1)) * 0.25
        : 0.5 + ((width - x) / (width + 1)) * 0.25;
      cells.push({ char: "─", u });
    }
    return this.paintCells(cells);
  }

  /**
   * Draw the border on top of the filled area. The first and last rows
   * carry the corners, the rows in between the vertical borders.
   */
  renderFrame(rows) {
    const height = rows.length;
    const side = FRAME.rounded ? "│" : "┃";
    const cornerTopLeft = FRAME.rounded ? "╭" : "┌";
    const cornerTopRight = FRAME.rounded ? "╮" : "┐";
    const cornerBottomLeft = FRAME.rounded ? "╰" : "└";
    const cornerBottomRight = FRAME.rounded ? "╯" : "┘";
    const steps = Math.max(1, height - 2);

    return rows.map((row, index) => {
      if (index === 0) {
        return this.borderCell(cornerTopLeft, 0) + row + this.borderCell(cornerTopRight, 0.25);
      }
      if (index === height - 1) {
        return this.borderCell(cornerBottomLeft, 0.75) + row + this.borderCell(cornerBottomRight, 1);
      }
      const left = { char: side, u: 0.75 + ((steps - index) / steps) * 0.25 };
      const right = { char: side, u: 0.25 + ((index - 1) / steps) * 0.25 };
      return this.borderCell(left.char, left.u) + row + this.borderCell(right.char, right.u);
    });
  }

  // ── Animation ─────────────────────────────────────────────────────────────

  /** True while the current style has something to animate. */
  animationActive() {
    const style = this.styleMode();
    if (style === "dust") return this.statusActive() || this.dustLevel > 0;
    if (style !== "gradient") return false;
    return this.frameActive();
  }

  /** Advance the active animation while it is on screen. */
  updateAnimation() {
    if (!this.animationActive()) {
      this.stopAnimation();
      return;
    }
    this.startTimer();
  }

  /** One animation step, on the timer. */
  tick() {
    // The editor was replaced, stop animating.
    if (Date.now() - this.lastRenderAt > 1500) {
      this.stopAnimation();
      return;
    }
    this.clock += FRAME.intervalMs;
    if (this.styleMode() === "dust") {
      const target = this.statusActive() ? 1 : 0;
      const step = FRAME.intervalMs / Math.max(1, DUST.fadeMs);
      this.dustLevel =
        target > this.dustLevel
          ? Math.min(target, this.dustLevel + step)
          : Math.max(target, this.dustLevel - step);
    } else {
      this.phase = (this.phase + FRAME.speed) % 1;
    }
    this.tui.requestRender();
  }

  startTimer() {
    if (this.animationTimer) return;
    this.animationTimer = setInterval(() => {
      // A failure in the timer must not crash the TUI outside a render.
      try {
        this.tick();
      } catch (error) {
        this.disableCustomRendering(error);
      }
    }, FRAME.intervalMs);
    this.animationTimer.unref?.();
  }

  stopAnimation() {
    if (!this.animationTimer) return;
    clearInterval(this.animationTimer);
    this.animationTimer = undefined;
  }

  dispose() {
    this.stopAnimation();
  }

  /** The gradient style insets its content by one column. */
  handleMouse(event) {
    if (this.styleMode() !== "gradient") return super.handleMouse(event);
    const height = this.renderedAutocompleteHeight || 0;
    const start = this.renderedVisibleLineCount + 1;
    const inAutocomplete = height > 0 && event.y >= start && event.y < start + height;
    return super.handleMouse({ ...event, x: event.x - 1, y: inAutocomplete ? event.y + 1 : event.y });
  }
}

// ── Extension ──────────────────────────────────────────────────────────────

export default function centeredInputBlock(pi) {
  let ourFactory;

  function install(ctx) {
    if (!ctx?.hasUI || ctx.mode !== "tui") return;
    const ui = ctx.ui;
    if (typeof ui.setEditorComponent !== "function") return;

    ourFactory = (tui, editorTheme, keybindings) => {
      try {
        const editor = new BlockEditor(tui, editorTheme, keybindings, {
          paddingX: INNER_PADDING_X,
          autocompleteMaxVisible: 5,
        });
        // Resolve the live theme at render time so /theme changes apply.
        editor.resolveTheme = () => ui.theme;
        return editor;
      } catch (error) {
        // A pi update may break construction: keep the session usable.
        console.error(`centered-input-block: using the base editor (${error})`);
        return new CustomEditor(tui, editorTheme, keybindings, { autocompleteMaxVisible: 5 });
      }
    };
    ui.setEditorComponent(ourFactory);
  }

  /**
   * Pi drops custom editors when the session is invalidated (/new, /resume,
   * /reload), so the block has to be reinstalled on every session_start.
   */
  function ensure(ctx) {
    if (!ctx?.hasUI || ctx.mode !== "tui") return;
    const ui = ctx.ui;
    if (typeof ui.getEditorComponent !== "function") return;
    if (ourFactory && ui.getEditorComponent() === ourFactory) return;
    install(ctx);
  }

  pi.on("session_start", (_event, ctx) => ensure(ctx));
  pi.on("session_info_changed", (_event, ctx) => ensure(ctx));
}
