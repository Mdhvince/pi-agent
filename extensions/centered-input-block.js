/**
 * Centered input block.
 *
 * Renders the pi input editor as one centered block with a light-black
 * background and generous height, instead of a full-width line with thin
 * "─" borders.
 *
 * The horizontal geometry is shared with the footer notes, see lib/layout.js.
 * Tune the constants there, then run /reload in pi.
 *
 * ── Gradient frame ───────────────────────────────────────────────────────
 *
 * A colored line that travels around the block, drawn as part of the
 * editor: a top edge, a bottom edge and one column on each side. The
 * gradient position advances on a timer, so the colors move along the
 * perimeter.
 *
 * The frame is the working indicator. It shows while the agent is busy
 * and replaces the spinner and the "Working" text. The border columns are
 * reserved even when the frame is off, so the block never resizes.
 *
 *   enabled   draw the frame at all
 *   rounded   rounded corners (╭ ╮ ╰ ╯) instead of square ones
 *   stops     theme tokens the gradient cycles through
 *   steps     color buckets around the perimeter, keeps the output small
 *   animate   "always" | "working" | "never"
 *   speed     phase step per tick
 *   intervalMs milliseconds per tick
 *
 * ── Working indicator ─────────────────────────────────────────────────────
 *
 * The spinner and its message live in the WORKING constant below.
 *
 *   placement    where the status sits
 *                  "top-left" | "top-center" | "top-right"
 *                  "bottom-left" | "bottom-center" | "bottom-right"
 *                  "above-block"          pi's own row above the block
 *   frames       spinner animation, rendered verbatim. [] = message only.
 *   frameColors  one theme token per frame, for a color cycle. Overrides
 *                spinnerColor.
 *   intervalMs   milliseconds per frame.
 *   message      text next to the spinner.
 *   spinnerColor theme token for the spinner.
 *   messageColor theme token for the message.
 *
 * ── Frame examples ───────────────────────────────────────────────────────
 *
 * Geometric
 *   ["◐", "◓", "◑", "◒"]                  half circle
 *   ["◜", "◝", "◞", "◟"]                  circle outline
 *   ["◴", "◵", "◶", "◷"]                  quadrant
 *   ["◰", "◱", "◲", "◳"]                  diagonal
 *   ["☾", "☽"]                            half-moon
 *   ["⦾", "⦿"]                            ring
 *
 * Braille
 *   ["⠈", "⠉", "⠋", "⠓", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋", "⠉", "⠈"]  smooth circle
 *   ["⠁", "⠂", "⠄", "⠂"]                  bounce
 *   ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]          classic
 *   ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]                  growing
 *
 * Bars and waves
 *   ["▁", "▃", "▄", "▅", "▆", "▇", "▆", "▅", "▄", "▃"]             wave
 *   ["▂", "▃", "▄", "▅", "▆", "▇", "▆", "▅", "▄", "▃", "▂"]       smooth wave
 *   ["▌", "▊", "▋", "▊", "▌", "▊"]                                slide
 *   ["▏", "▎", "▍", "▌", "▋", "▊", "▉"]                          thin slide
 *   ["░", "▒", "▓", "█"]                                           shade
 *
 * Dots and arrows
 *   ["·", "•", "●", "•"]                                           dots
 *   ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"]                       rotating arrows
 *
 * ASCII, safe on every font
 *   ["-", "\\", "|", "/"]
 *   [".", "o", "O", "o", "."]
 *   [".  ", ".. ", "...", " ..", "  .", "   "]
 *
 * Color cycle, one token per frame
 *   frameColors: ["accent", "warning", "error", "success"]
 *
 * Rules
 *   - Every frame must have the same visible width, or the text shifts.
 *     A growing frame set like ["▉", "▉▉", "▉▉▉"] shifts the message on
 *     every tick, unless the status is right-aligned.
 *   - Emoji frames are 2 columns wide and break the alignment.
 */
import { CustomEditor } from "@earendil-works/pi-coding-agent";
import { mixColors, visibleWidth } from "@earendil-works/pi-tui";
import { blockContentWidth, blockInset } from "./lib/layout.js";

// ── Tunables ────────────────────────────────────────────────────────────────

/** Theme background token used for the block fill. */
const BG_TOKEN = "customMessageBg";

/** Blank background rows kept above and below the input text. */
const PAD_TOP = 0;
const PAD_BOTTOM = 1;

/** Show the working status (spinner + message) inside the top row of the block. */
const SHOW_STATUS_ROW = true;

/** Left/right padding of the text inside the block, in columns. */
const INNER_PADDING_X = 1;

/**
 * Animated gradient frame drawn around the block.
 *
 * The frame is the working indicator: it appears while the agent is busy
 * and replaces the spinner and the "Working" text. The border columns are
 * always reserved, so the block does not resize when the frame shows.
 *
 * enabled   draw the frame at all
 * rounded   use rounded corners (╭ ╮ ╰ ╯) instead of square ones
 * stops     theme tokens the gradient cycles through
 * steps     color buckets around the perimeter, keeps the ANSI output small
 * animate   "always" | "working" | "never"
 * speed     phase step per tick
 * intervalMs milliseconds per tick
 */
const FRAME = {
  enabled: true,
  rounded: true,
  stops: ["accent", "success", "warning", "error"],
  steps: 48,
  animate: "working",
  speed: 0.04,
  intervalMs: 80,
};

/**
 * Working indicator: animation, colors and placement.
 * See the file header for the options and the frame examples.
 */
const WORKING = {
  placement: "top-center",
  frames: ["▉", "▉▉", "▉▉▉", "▉▉▉▉", "▉▉▉▉▉", "▉▉▉▉▉▉", "▉▉▉▉▉▉▉", "▉▉▉▉▉▉▉▉", "▉▉▉▉▉▉▉▉▉", "▉▉▉▉▉▉▉▉▉▉", "▉▉▉▉▉▉▉▉▉▉▉▉", "▉▉▉▉▉▉▉▉▉▉▉▉"],
  frameColors: null,
  intervalMs: 120,
  message: "Working",
  spinnerColor: "accent",
  messageColor: "muted",
};

// ── Editor ──────────────────────────────────────────────────────────────────

class BlockEditor extends CustomEditor {
  constructor(tui, editorTheme, keybindings, options) {
    super(tui, editorTheme, keybindings, {
      paddingX: options?.paddingX ?? INNER_PADDING_X,
      autocompleteMaxVisible: options?.autocompleteMaxVisible ?? 5,
      embedWorkingStatus: WORKING.placement !== "above-block",
    });
    /** Position of the gradient along the perimeter, 0..1. */
    this.phase = 0;
    /** Timestamp of the last render, used to stop the animation. */
    this.lastRenderAt = 0;
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

  /** Wrap text in the block background color. */
  paint(text) {
    const theme = this.getTheme();
    if (!theme) return text;
    try {
      return theme.bg(BG_TOKEN, text);
    } catch {
      return text;
    }
  }

  /** Pad a plain string to the given visible width. */
  pad(text, width) {
    const used = visibleWidth(text);
    return used >= width ? text : text + " ".repeat(width - used);
  }

  /** Styled "<spinner> <message>", empty when the agent is idle. */
  workingText(width) {
    if (!SHOW_STATUS_ROW || !this.embedWorkingStatus || !this.workingStatusIndicator) return "";
    if (this.frameActive()) return "";
    return this.workingStatusIndicator.renderInBorder(Math.max(1, width - 4));
  }

  /** Fill a row from a left and a right part. */
  composeRow(width, left, right) {
    const leftWidth = visibleWidth(left);
    const rightWidth = visibleWidth(right);
    if (left && right) {
      return left + " ".repeat(Math.max(1, width - leftWidth - rightWidth)) + right;
    }
    if (left) return left + " ".repeat(Math.max(0, width - leftWidth));
    if (right) return " ".repeat(Math.max(0, width - rightWidth)) + right;
    return " ".repeat(width);
  }

  /** Fill a row with a centered part. */
  composeCenteredRow(width, center, left) {
    const centerWidth = visibleWidth(center);
    if (!center) return this.composeRow(width, left, "");
    const before = Math.max(visibleWidth(left), Math.floor((width - centerWidth) / 2));
    return " ".repeat(before) + center + " ".repeat(Math.max(0, width - before - centerWidth));
  }

  /** The row that holds the working indicator, for "top-*" or "bottom-*". */
  workingRow(width, row, hiddenLineCount) {
    const placement = WORKING.placement;
    const status = this.workingText(width);
    const scroll = this.scrollLabel(row === "top" ? "↑" : "↓", hiddenLineCount);
    if (placement === `${row}-left`) return this.composeRow(width, status, scroll);
    if (placement === `${row}-center`) return this.composeCenteredRow(width, status, scroll);
    return this.composeRow(width, scroll, status);
  }

  /** Label for the hidden-lines indicator. */
  scrollLabel(arrow, count) {
    return count > 0 ? `${arrow} ${count} more ` : "";
  }

  renderTopBorder(width, hiddenLineCount) {
    if (this.frameActive()) return this.frameEdgeCells(width, true);
    const row = WORKING.placement.startsWith("top")
      ? this.workingRow(width, "top", hiddenLineCount)
      : this.composeRow(width, this.scrollLabel("↑", hiddenLineCount), "");
    return this.paint(this.pad(row, width));
  }

  renderBottomBorder(width, hiddenLineCount) {
    if (this.frameActive()) return this.frameEdgeCells(width, false);
    const row = WORKING.placement.startsWith("bottom")
      ? this.workingRow(width, "bottom", hiddenLineCount)
      : this.composeRow(width, this.scrollLabel("↓", hiddenLineCount), "");
    return this.paint(this.pad(row, width));
  }

  /**
   * The spinner frames carry a baked color, so they are rebuilt when the
   * theme changes. The message color resolves live, so it needs no rebuild.
   */
  refreshWorkingStyle() {
    const theme = this.getTheme();
    if (!theme) return;
    let signature;
    try {
      signature = theme.fg(WORKING.spinnerColor, "·");
    } catch {
      return;
    }
    if (signature === this.themeSignature) return;
    this.themeSignature = signature;
    this.onThemeChange?.();
  }

  render(width) {
    this.refreshWorkingStyle();
    this.lastRenderAt = Date.now();
    this.updateAnimation();

    const inset = blockInset(width);
    const gutter = " ".repeat(inset);
    const contentWidth = blockContentWidth(width);
    // The border columns are always reserved, so the block does not resize
    // when the frame appears.
    const fillWidth = Math.max(20, FRAME.enabled ? contentWidth - 2 : contentWidth);

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

    const rows = FRAME.enabled ? this.renderFrame(innerRows) : innerRows;
    return rows.map((row) => gutter + row + gutter);
  }

  // ── Gradient frame ────────────────────────────────────────────────────────

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

  /** The working status is on screen. */
  statusActive() {
    return !!this.workingStatusIndicator;
  }

  /** The gradient frame is drawn. It is the working indicator. */
  frameActive() {
    return FRAME.enabled && this.statusActive();
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

  /** Advance the gradient while the frame is on screen. */
  updateAnimation() {
    const active = FRAME.animate === "always" || (FRAME.animate === "working" && this.statusActive());
    if (!active) {
      this.stopAnimation();
      return;
    }
    if (this.animationTimer) return;
    this.animationTimer = setInterval(() => {
      // The editor was replaced, stop animating.
      if (Date.now() - this.lastRenderAt > 1500) {
        this.stopAnimation();
        return;
      }
      this.phase = (this.phase + FRAME.speed) % 1;
      this.tui.requestRender();
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

  /** The border column shifts the content one column to the right. */
  handleMouse(event) {
    if (!FRAME.enabled) return super.handleMouse(event);
    // The autocomplete list sits one row above where the editor expects it.
    const height = this.renderedAutocompleteHeight || 0;
    const start = this.renderedVisibleLineCount + 1;
    const inAutocomplete = height > 0 && event.y >= start && event.y < start + height;
    return super.handleMouse({ ...event, x: event.x - 1, y: inAutocomplete ? event.y + 1 : event.y });
  }
}

// ── Extension ──────────────────────────────────────────────────────────────

export default function centeredInputBlock(pi) {
  let ourFactory;

  /** Spinner frames with the theme color baked in. */
  function spinnerFrames(ui) {
    return WORKING.frames.map((frame, index) => {
      const token = WORKING.frameColors?.[index] ?? WORKING.spinnerColor;
      try {
        return token ? ui.theme.fg(token, frame) : frame;
      } catch {
        return frame;
      }
    });
  }

  /** Apply the animation and the message to pi's working indicator. */
  function applyWorkingStyle(ui) {
    if (typeof ui.setWorkingIndicator === "function") {
      ui.setWorkingIndicator({ frames: spinnerFrames(ui), intervalMs: WORKING.intervalMs });
    }
    if (WORKING.message && typeof ui.setWorkingMessage === "function") {
      ui.setWorkingMessage(WORKING.message);
    }
  }

  function install(ctx) {
    if (!ctx?.hasUI || ctx.mode !== "tui") return;
    const ui = ctx.ui;
    if (typeof ui.setEditorComponent !== "function") return;

    // Spinner animation and message.
    applyWorkingStyle(ui);

    ourFactory = (tui, editorTheme, keybindings) => {
      const editor = new BlockEditor(tui, editorTheme, keybindings, {
        paddingX: INNER_PADDING_X,
        autocompleteMaxVisible: 5,
      });
      // Resolve the live theme at render time so /theme changes apply.
      editor.resolveTheme = () => ui.theme;
      // Rebuild the spinner frames when the theme colors change.
      editor.onThemeChange = () => applyWorkingStyle(ui);
      // The working indicator borrows the editor border color for its text.
      // Pin it so the message keeps our color, whatever pi writes later.
      Object.defineProperty(editor, "borderColor", {
        configurable: true,
        get: () => (text) => {
          try {
            return ui.theme.fg(WORKING.messageColor, text);
          } catch {
            return text;
          }
        },
        set: () => {},
      });
      return editor;
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
