'use client'

/**
 * Nexa: an interactive portfolio "design canvas" hero.
 *
 * A headline you can click and retype, a character whose eyes follow the pointer, a tool rail
 * (select, marquee, zoom, brush, text, pen), a cursor-lit grid, and a one-tap accent colour that repaints it all.
 * Every word, link, image and number is a prop, so the component is only structure, motion and behaviour.
 *
 * Dependencies: `framer-motion`, `lucide-react`, and the project's class-name helper.
 *
 * Usage:
 *   import Nexa from './nexa'
 *   <Nexa title={'JANE
DOE'} description='Designer.' character={{ src, width: 1351, height: 1164 }} />
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import type {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
  SVGProps
} from 'react'
import Image from 'next/image'
import {
  AnimatePresence,
  LazyMotion,
  animate,
  domMax,
  m,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Brush,
  Check,
  Menu,
  MousePointer2,
  Move,
  Navigation2,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  RotateCcw,
  SquareDashedMousePointer,
  Type,
  X,
  ZoomIn
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/** A link in the navigation bar. */
export interface NexaNavLink {
  /** Visible link text. */
  label: string
  /** Link target. In-page anchors (`#work`) and absolute URLs both work. */
  href: string
  /** Marks the link of the page being shown (`aria-current="page"`). Default: `false`. */
  current?: boolean
}

/** A text link rendered as a button-like call to action. */
export interface NexaAction {
  /** Visible label. */
  label: string
  /** Link target. */
  href: string
}

/** The brand lock-up at the left of the navigation bar. */
export interface NexaBrand {
  /** One to three letters set inside the accent-coloured square. */
  mark: string
  /** Wordmark next to the square. */
  name: string
  /** Small superscript after the wordmark, such as a registered-trademark sign. Default: none. */
  sup?: string
  /** Where the lock-up links to. Default: `#`. */
  href?: string
}

/** Icons available for a credibility card. */
export type NexaStatIcon = 'folder' | 'calendar' | 'globe'

/** One credibility card in the bottom-right corner. */
export interface NexaStat {
  /** Stable key for the card. */
  id: string
  /** Small uppercase label next to the icon (hidden below 560px). */
  label: string
  /** Headline figure. A leading number (`120+`, `08`) counts up when the card scrolls into view. */
  value: string
  /** Sentence under the figure. */
  caption: string
  /** Icon shown before the label. Default: `'folder'`. */
  icon?: NexaStatIcon
}

/** One accent colour. It repaints the title word, active tool, grid glow, buttons and the character's details. */
export interface NexaTheme {
  /** Stable identifier. */
  id: string
  /** Name announced for the swatch. */
  label: string
  /** The accent, as a CSS colour. */
  accent: string
  /** Text colour that sits on top of the accent. Keep it dark for light accents. */
  ink: string
}

/** One eye of the character, measured in source-image pixels. */
export interface NexaEye {
  /** Stable key. */
  id: string
  /** Bounds of the eye opening: `[left, top, right, bottom]`. */
  box: [number, number, number, number]
  /** Centre of the pupil when looking straight ahead: `[x, y]`. */
  rest: [number, number]
  /** Pupil diameter. */
  iris: number
  /** Polygon of the eye opening the pupil is clipped to: `[x, y][]`. */
  outline: [number, number][]
}

/** The character illustration and the geometry of its eyes. */
export interface NexaCharacter {
  /** Image with the irises painted out (live pupils are drawn on top). Use an absolute or data URL. */
  src: string
  /** Pixel width of the artwork. Only the aspect ratio and the eye coordinate space matter. */
  width: number
  /** Pixel height of the artwork. */
  height: number
  /** White-where-accented mask. The theme colour is painted through it. Default: no recolouring. */
  accentMaskSrc?: string
  /** Pupil image drawn inside each eye. Default: no live pupils. */
  pupilSrc?: string
  /** Eye geometry in source pixels. Default: no live pupils. */
  eyes?: NexaEye[]
  /** Text alternative for the illustration. Empty (default) marks it decorative. */
  alt?: string
}

/** Cursor-lit grid options. */
export interface NexaGridOptions {
  /** Pixels between grid lines. Smaller reads as a finer canvas. Default: `80`. */
  cell?: number
  /** Grid line strength, 0 to 1. Default: `0.05`. */
  line?: number
  /** Cells around the cursor that light up. Default: `2.35`. */
  reach?: number
  /** Brightest a lit cell's outline gets, 0 to 1. Default: `0.75`. */
  glow?: number
  /** Milliseconds for a lit cell to fade. Default: `520`. */
  fade?: number
}

/** How the character's eyes behave. */
export interface NexaGazeOptions {
  /** Horizontal pupil travel in source-image pixels. Default: `14`. */
  x?: number
  /** Vertical pupil travel in source-image pixels. Default: `7`. */
  y?: number
  /** Pixels from the face where the eyes are about halfway to their limit. Default: `240`. */
  distance?: number
  /** How far the eyes trail the cursor: 0.5 is snappy, 1.5 is lazy. Default: `1.05`. */
  lag?: number
  /** Damping of the eyes: 2 lands without overshoot. Default: `1.85`. */
  settle?: number
  /** How much a pupil narrows when looking sideways, 0 to 1. Default: `0.1`. */
  turn?: number
  /** Random wait range between blinks, in milliseconds: `[min, max]`. Default: `[2800, 6200]`. */
  blinkEvery?: [number, number]
  /** Milliseconds a blink lasts. Default: `150`. */
  blinkLength?: number
}

/** The brush tool. */
export interface NexaBrushOptions {
  /** Stroke width in pixels. Default: `7`. */
  width?: number
  /** Milliseconds before a stroke has fully faded. Default: `1700`. */
  life?: number
  /** Pixels of soft light around the stroke. Default: `14`. */
  glow?: number
}

/** Where the character stands, as shares of the canvas. */
export interface NexaFigureOptions {
  /** Desktop: height as a percentage of the canvas height. Default: `114`. */
  height?: number
  /** Desktop: width cap as a percentage of the canvas width. Default: `62`. */
  widthCap?: number
  /** Desktop: percentage across the canvas where the body is centred. Default: `66`. */
  centre?: number
  /** Percentage of the image hidden below the bottom edge. Default: `20`. */
  cropped?: number
  /** Desktop: pixels of air kept between the description and the shoulder. Default: `140`. */
  clearance?: number
  /** Tablet: width cap as a percentage of the canvas width. Default: `70`. */
  tabletCap?: number
  /** Tablet: percentage across the canvas where the body is centred. Default: `63`. */
  tabletCentre?: number
  /** Tablet: pixels of air kept beside the copy. Default: `44`. */
  tabletClearance?: number
  /** Phone: minimum height in pixels between the copy and the cards. Default: `300`. */
  stackedMin?: number
  /** Phone: maximum height in pixels between the copy and the cards. Default: `520`. */
  stackedMax?: number
}

export interface NexaProps extends Omit< HTMLAttributes< HTMLDivElement >, 'title' > {
  /** Brand lock-up in the navigation bar. Default: none. */
  brand?: NexaBrand
  /** Links in the navigation bar. Default: `[]`. */
  navLinks?: NexaNavLink[]
  /** Availability pill at the right of the navigation bar. Default: none. */
  status?: NexaAction
  /** Headline. One line per `\n`, the second word takes the accent colour. Default: `'YOUR\nNAME'`. */
  title?: string
  /** Paragraph under the headline. Default: none. */
  description?: string
  /** Words the label above the headline rotates through. Default: `[]` (label hidden). */
  disciplines?: string[]
  /** Text before the rotating word in the label. Default: none. */
  craftLabel?: string
  /** Milliseconds each rotating word stays. Default: `2400`. */
  craftInterval?: number
  /** Filled call-to-action button. Default: none. */
  primaryAction?: NexaAction
  /** Outlined call-to-action button. Default: none. */
  secondaryAction?: NexaAction
  /** Credibility cards in the bottom-right corner. Default: `[]`. */
  stats?: NexaStat[]
  /** Text shown in the canvas bar while the Select tool is idle (for example `2160 × 3840 px`). Default: the tool hint. */
  canvasLabel?: string
  /** Label that floats over the character when hovered. `{name}` is replaced with the headline's first word. Default: none. */
  greeting?: string
  /** Character illustration and eye geometry. Default: no character. */
  character?: NexaCharacter
  /** Accent colours offered by the swatches. Default: lime, violet, sky, coral and rose. */
  themes?: NexaTheme[]
  /** `id` of the accent shown first (and restored by the reset button). Default: the first theme. */
  defaultThemeId?: string
  /** Most characters a visitor can type into the headline. Default: `40`. */
  titleMaxLength?: number
  /** Most lines a visitor can type into the headline. Default: `4`. */
  titleMaxLines?: number
  /** Closest the zoom tool can magnify, as a scale factor. Default: `3.5`. */
  maxZoom?: number
  /** Cursor-lit grid options. */
  grid?: NexaGridOptions
  /** Eye behaviour options. */
  gaze?: NexaGazeOptions
  /** Brush tool options. */
  brush?: NexaBrushOptions
  /** Character placement options. */
  figure?: NexaFigureOptions
  /** CSS `font-family` of the headline. Falls back to the theme's `--font-sans`. Default: Archivo stack. */
  displayFontFamily?: string
  /** CSS `font-family` of everything else. Falls back to the theme's `--font-sans`. Default: Figtree stack. */
  bodyFontFamily?: string
  /** Viewport height the hero is measured against (a CSS length). Default: `'100dvh'`. */
  viewportHeight?: string
  /** Shows the design-canvas toolbar and editing tools. Default: `true`. */
  showToolbar?: boolean
  /** Enables single-key tool shortcuts (V, H, M, Z, B, T, P) while the pointer or focus is inside. Default: `true`. */
  keyboardShortcuts?: boolean
  /** Forces reduced motion on or off. Default: follows `prefers-reduced-motion`. */
  reducedMotion?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                  Defaults                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_THEMES: NexaTheme[] = [
  { id: 'lime', label: 'Lime', accent: '#c6f432', ink: '#0b0d05' },
  { id: 'violet', label: 'Violet', accent: '#a78bfa', ink: '#0f0a1f' },
  { id: 'sky', label: 'Sky', accent: '#5ccbff', ink: '#041219' },
  { id: 'coral', label: 'Coral', accent: '#ff7a59', ink: '#1c0804' },
  { id: 'rose', label: 'Rose', accent: '#ff6fb5', ink: '#1c0512' }
]

const DEFAULT_GRID: Required< NexaGridOptions > = { cell: 80, line: 0.05, reach: 2.35, glow: 0.75, fade: 520 }

const DEFAULT_GAZE: Required< NexaGazeOptions > = {
  x: 14,
  y: 7,
  distance: 240,
  lag: 1.05,
  settle: 1.85,
  turn: 0.1,
  blinkEvery: [2800, 6200],
  blinkLength: 150
}

const DEFAULT_BRUSH: Required< NexaBrushOptions > = { width: 7, life: 1700, glow: 14 }

const DEFAULT_FIGURE: Required< NexaFigureOptions > = {
  height: 114,
  widthCap: 62,
  centre: 66,
  cropped: 20,
  clearance: 140,
  tabletCap: 70,
  tabletCentre: 63,
  tabletClearance: 44,
  stackedMin: 300,
  stackedMax: 520
}

const DEFAULT_DISPLAY_FONT = "'Archivo', var(--font-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif"
const DEFAULT_BODY_FONT = "'Figtree', var(--font-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif"

// The greeting shows after the pointer rests on the character: where, how long, and how high it floats.
const HINT = { gap: 12, delay: 140, zone: [0.2, 0.82] as const }

// Strong ease-out: motion lands softly instead of stopping.
const EASE = [0.16, 1, 0.3, 1] as const

// The snap used for selections: quick to arrive, a whisper of overshoot.
const MAGNET = { type: 'spring', stiffness: 520, damping: 34, mass: 0.8 } as const

/* -------------------------------------------------------------------------- */
/*                                 Scoped CSS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Everything Tailwind utilities cannot express. Each rule hangs off `[data-slot='nexa']` and the keyframes carry
 * a `nexa-` prefix, so nothing leaks into the host page. Colours come from the shadcn theme (`--color-*`).
 */
const NEXA_CSS = `
@property --nx-accent {
  syntax: '<color>';
  inherits: true;
  initial-value: #c6f432;
}

@property --nx-accent-ink {
  syntax: '<color>';
  inherits: true;
  initial-value: #0b0d05;
}

[data-slot='nexa'] {
  --color-background: hsl(var(--background));
  --color-border: hsl(var(--border));
  --color-foreground: hsl(var(--foreground));
  --nx-nav: 64px;
  --nx-pad: 20px;
  --nx-rail: 60px;
  --nx-mark: 32px;
  --nx-rail-inset: calc((var(--nx-rail) - 1px - var(--nx-mark)) / 2);
  --nx-accent-text: color-mix(in oklab, var(--nx-accent) 42%, var(--color-foreground));
  font-family: var(--nx-font-sans);
  transition:
    --nx-accent 600ms cubic-bezier(0.16, 1, 0.3, 1),
    --nx-accent-ink 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* On a dark theme the accent is bright enough to read as text as it is; on a light one it is pulled toward the foreground. */
.dark [data-slot='nexa'],
[data-theme='dark'] [data-slot='nexa'] {
  --nx-accent-text: var(--nx-accent);
}

@media (min-width: 640px) {
  [data-slot='nexa'] {
    --nx-nav: 72px;
    --nx-pad: 32px;
    --nx-rail: 72px;
    --nx-mark: 36px;
  }
}

[data-slot='nexa'][data-nav='off'] {
  --nx-nav: 0px;
}

[data-slot='nexa'] .nx-display {
  font-family: var(--nx-font-display);
}

[data-slot='nexa'] .nx-accent-text {
  color: transparent;
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ---------- Nav ---------- */

[data-slot='nexa'] .nx-nav {
  background-color: color-mix(in oklab, var(--color-background) 55%, transparent);
  border-bottom: 1px solid var(--color-border);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: background-color 300ms ease;
}

[data-slot='nexa'] .nx-nav.is-solid {
  background-color: color-mix(in oklab, var(--color-background) 88%, transparent);
}

/* Below 1024px the hero runs under the bar as you scroll: a denser, blurrier bar keeps the logo and menu readable. */
@media (max-width: 1023px) {
  [data-slot='nexa'] .nx-nav {
    background-color: color-mix(in oklab, var(--color-background) 82%, transparent);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    backdrop-filter: blur(18px) saturate(140%);
    box-shadow: 0 10px 30px -18px color-mix(in oklab, var(--color-foreground) 40%, transparent);
  }

  [data-slot='nexa'] .nx-nav.is-solid {
    background-color: color-mix(in oklab, var(--color-background) 94%, transparent);
  }
}

@keyframes nexa-pulse {
  from {
    transform: scale(1);
    opacity: 0.55;
  }

  to {
    transform: scale(2.6);
    opacity: 0;
  }
}

[data-slot='nexa'] .nx-pulse {
  animation: nexa-pulse 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

/* ---------- Hero shell ---------- */

/* The nav is sticky and in flow above this, so the pair fills exactly one screen. */
[data-slot='nexa'] .nx-hero {
  min-height: calc(var(--nx-vh, 100dvh) - var(--nx-nav));
}

[data-slot='nexa'] .nx-hero::after {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: -8rem;
  left: 0;
  height: 12rem;
  background: linear-gradient(
    to bottom,
    hsl(var(--background)) 0%,
    hsl(var(--background) / 0.94) 40%,
    transparent 100%
  );
  content: '';
  pointer-events: none;
}

@media (min-width: 768px) {
  [data-slot='nexa'] .nx-hero {
    height: calc(var(--nx-vh, 100dvh) - var(--nx-nav));
    min-height: 620px;
  }
}

/* The tablet layout stacks the two buttons, which makes the copy taller than a short landscape screen. */
@media (min-width: 768px) and (max-width: 1199px) {
  [data-slot='nexa'] .nx-hero {
    min-height: 770px;
  }
}

/* Container units size the title and the character against the canvas, not the window. */
[data-slot='nexa'] .nx-canvas {
  container-type: inline-size;
}

@media (min-width: 768px) {
  [data-slot='nexa'] .nx-stage {
    container-type: size;
    overflow: clip;
  }
}

[data-slot='nexa'] .nx-tip {
  opacity: 0;
  margin-left: 6px;
  transition:
    opacity 150ms ease,
    margin-left 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-slot='nexa'] button:hover > .nx-tip,
[data-slot='nexa'] button:focus-visible > .nx-tip {
  opacity: 1;
  margin-left: 12px;
}

/* Phones and tablets have no hover: the labels would only stick after a tap. */
@media (hover: none) {
  [data-slot='nexa'] .nx-tip {
    display: none;
  }
}

/* Touch targets: at least 44 by 44 CSS pixels on coarse pointers. */
@media (pointer: coarse) {
  [data-slot='nexa'] .nx-hit {
    min-width: 44px;
    min-height: 44px;
  }
}

/* ---------- Canvas ---------- */

[data-slot='nexa'] .nx-grid {
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--color-foreground) var(--nx-grid-line), transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) var(--nx-grid-line), transparent) 1px, transparent 1px);
  background-size: var(--nx-cell) var(--nx-cell);
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    transparent 20%,
    color-mix(in oklab, #000 30%, transparent) 45%,
    #000 65%
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    transparent 20%,
    color-mix(in oklab, #000 30%, transparent) 45%,
    #000 65%
  );
}

/* The room light: a soft pool of the theme colour behind him and along the floor. */
[data-slot='nexa'] .nx-room {
  --nx-room-x: 50%;
  --nx-room-y: 78%;

  background:
    radial-gradient(
      34% 42% at var(--nx-room-x) var(--nx-room-y),
      color-mix(in oklab, var(--nx-accent) 13%, transparent),
      transparent 72%
    ),
    radial-gradient(
      55% 30% at var(--nx-room-x) 104%,
      color-mix(in oklab, var(--nx-accent) 12%, transparent),
      transparent 70%
    );
}

@media (min-width: 768px) {
  [data-slot='nexa'] .nx-room {
    --nx-room-x: var(--nx-fig-x, 66%);
    --nx-room-y: 55%;
  }
}

[data-slot='nexa'] .nx-content {
  padding: 60px var(--nx-pad) 0;
}

@media (min-width: 768px) {
  [data-slot='nexa'] .nx-content {
    padding: 68px 0 0 max(var(--nx-pad), 6cqw);
  }
}

[data-slot='nexa'] .nx-title-col {
  width: 100%;
}

@media (min-width: 768px) {
  [data-slot='nexa'] .nx-title-col {
    width: 42cqw;
  }
}

[data-slot='nexa'] .nx-title {
  --nx-title-size: clamp(2.6rem, 16.5cqw, 5.75rem);

  font-size: calc(var(--nx-title-size) * var(--nx-fit, 1));
  font-weight: 900;
  font-stretch: 125%;
  line-height: 0.92;
  letter-spacing: -0.012em;
  text-transform: uppercase;
  white-space: pre;
}

/* The ceiling is high so the headline keeps pace with the character on very wide screens. */
@media (min-width: 768px) {
  [data-slot='nexa'] .nx-title {
    --nx-title-size: clamp(3.25rem, 6.9cqw, 11rem);
  }
}

/* Sits exactly on the rendered title with see-through text: the coloured words underneath stay visible while typing,
   and only the caret and selection come from the textarea. The extra width is room for the caret. */
[data-slot='nexa'] .nx-title-input {
  width: calc(100% + 1em);
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: transparent;
  caret-color: var(--nx-accent);
  resize: none;
  overflow: hidden;
  outline: 0;
}

[data-slot='nexa'] .nx-title-input::selection {
  background: color-mix(in oklab, var(--nx-accent) 35%, transparent);
  color: transparent;
}

/* ---------- Character ---------- */

/* Phone: he stands right under the copy and above the stats cards, cut at the hips by his own bottom edge. */
[data-slot='nexa'] .nx-figure {
  position: relative;
  z-index: 20;
  margin-top: clamp(4px, 2cqw, 16px);
  height: clamp(var(--nx-fig-min), 98cqw, var(--nx-fig-max));
  overflow: hidden;
  pointer-events: none;
}

@media (max-width: 767px) {
  [data-slot='nexa'] .nx-figure {
    overflow-x: clip;
    overflow-y: visible;
  }
}

/* With a mouse the greeting needs a clear strip between the buttons and his hair. */
@media (max-width: 767px) and (hover: hover) and (pointer: fine) {
  [data-slot='nexa'] .nx-content {
    padding-bottom: 48px;
  }
}

[data-slot='nexa'] .nx-figure-inner {
  position: absolute;
  top: 12px;
  left: 50%;
  height: min(calc(100% / (1 - var(--nx-cropped))), 122cqw);
  translate: -50% 0;
  isolation: isolate;
  mix-blend-mode: normal;
  transform: perspective(1100px) rotateX(var(--nx-tilt-x, 0deg)) rotateY(var(--nx-tilt-y, 0deg));
  transform-style: preserve-3d;
  transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-slot='nexa'] .nx-figure-inner > img {
  filter:
    brightness(1.035)
    contrast(1.1)
    saturate(1.02)
    drop-shadow(0 14px 30px rgb(0 0 0 / 0.32));
  transform: translateZ(0) scale(1);
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-slot='nexa'] .nx-figure-inner[data-hovered='true'] > img {
  transform: translateZ(28px) scale(1.035);
}

[data-slot='nexa'] .nx-rim {
  background: linear-gradient(
    258deg,
    color-mix(in oklab, var(--nx-accent) 82%, white 18%) 0%,
    color-mix(in oklab, var(--nx-accent) 38%, transparent) 24%,
    transparent 54%
  );
  -webkit-mask: var(--nx-src) center / 100% 100% no-repeat;
  mask: var(--nx-src) center / 100% 100% no-repeat;
  mix-blend-mode: screen;
  opacity: 0.34;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='nexa'] .nx-figure-inner,
  [data-slot='nexa'] .nx-figure-inner > img {
    transition: none;
  }
}

/* Tablet and desktop: he stands on the bottom edge of the canvas in the right-hand column. The stage is the
   container, so every size is a share of the stage and his position is worked out from where the copy ends.
   --nx-fig-size: the stage's height, capped by its width so his shoulder never reaches the headline.
   --nx-fig-x: his centre, pushed right only if the copy would otherwise crowd him. The two constants are his
   silhouette measured off the artwork (left edge 0.245 and right edge 0.331 of his height from centre). */
@media (min-width: 768px) {
  [data-slot='nexa'] .nx-stage {
    --nx-cap: var(--nx-tab-cap);
    --nx-centre: var(--nx-tab-centre);
    --nx-clear: var(--nx-tab-clear);
    --nx-fig-size: min(calc(var(--nx-fig-h) * 1cqh), calc(var(--nx-cap) * 1cqw));
    --nx-copy-right: calc(max(var(--nx-pad), 6cqw) + min(max(34rem, 29.5cqw), 44cqw));
    --nx-fig-x: min(
      max(calc(var(--nx-centre) * 1cqw), calc(var(--nx-copy-right) + var(--nx-clear) + 0.245 * var(--nx-fig-size))),
      calc(100cqw - 12px - 0.331 * var(--nx-fig-size))
    );
  }

  [data-slot='nexa'] .nx-figure {
    position: absolute;
    inset: 0;
    height: auto;
    margin: 0;
    overflow: visible;
  }

  [data-slot='nexa'] .nx-figure-inner {
    top: auto;
    bottom: 0;
    left: var(--nx-fig-x);
    height: var(--nx-fig-size);
    translate: -50% calc(var(--nx-cropped) * 100%);
  }
}

/* Desktop: the stage fills the canvas and the stats cards float over its corner. */
@media (min-width: 1200px) {
  [data-slot='nexa'] .nx-stage {
    --nx-cap: var(--nx-fig-cap);
    --nx-centre: var(--nx-fig-centre);
    --nx-clear: var(--nx-fig-clear);
  }
}

[data-slot='nexa'] .nx-char-accent {
  background: var(--nx-accent);
  -webkit-mask: var(--nx-mask) center / 100% 100% no-repeat;
  mask: var(--nx-mask) center / 100% 100% no-repeat;
  mix-blend-mode: color;
}

/* Upper-lid shadow over the live pupil, so it sits in the eye rather than on it. */
[data-slot='nexa'] .nx-eye-shade {
  background: linear-gradient(to bottom, rgb(84 36 18 / 0.5), rgb(84 36 18 / 0) 42%);
}

[data-slot='nexa'] .nx-eyelid {
  background: linear-gradient(to bottom, #e89163 0%, #d9794c 82%, #3b1a0c 100%);
}

/* ---------- Tools ---------- */

[data-slot='nexa'] .nx-ants-base,
[data-slot='nexa'] .nx-ants {
  width: calc(100% - 1px);
  height: calc(100% - 1px);
  fill: none;
  stroke-width: 1;
}

[data-slot='nexa'] .nx-ants-base {
  stroke: rgb(0 0 0 / 0.85);
}

[data-slot='nexa'] .nx-ants {
  stroke: #fff;
  stroke-dasharray: 5 4;
}

@keyframes nexa-march {
  to {
    stroke-dashoffset: -9;
  }
}

[data-slot='nexa'] .nx-ants-march {
  animation: nexa-march 600ms linear infinite;
}

[data-slot='nexa'] .nx-brush-cursor {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='white' stroke-width='1.5'/%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='black' stroke-opacity='.5' stroke-width='.5'/%3E%3C/svg%3E")
      10 10,
    crosshair;
}

[data-slot='nexa'] .nx-pen-cursor {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15.7 21.3a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1 0-1.4l5.6-5.6a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4z' fill='black'/%3E%3Cpath d='m18 13-1.4-6.9a1 1 0 0 0-.7-.8L3.2 2a.5.5 0 0 0-.6.6l3.3 12.7a1 1 0 0 0 .8.7L13.6 17.4z' fill='black'/%3E%3Cpath d='M2.3 2.3 9.6 9.6'/%3E%3Ccircle cx='11' cy='11' r='2'/%3E%3C/svg%3E")
      2 2,
    crosshair;
}

/* Reduced motion is decided in one place (the reducedMotion prop or the OS setting) and reflected here. */
[data-slot='nexa'][data-reduced='true'] {
  transition: none;
}

[data-slot='nexa'][data-reduced='true'] .nx-pulse,
[data-slot='nexa'][data-reduced='true'] .nx-ants-march {
  animation: none;
}
`

/* -------------------------------------------------------------------------- */
/*                               Hooks and helpers                            */
/* -------------------------------------------------------------------------- */

// useLayoutEffect warns during server rendering on older React versions, so fall back to useEffect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Keeps the newest value in a ref, so long-lived listeners and loops read it without being torn down. */
function useLatest< T >(value: T): RefObject< T > {
  const ref = useRef< T >(value)

  useIsoLayoutEffect(() => {
    ref.current = value
  })

  return ref
}

/** A stable callback that always runs the newest closure (a portable stand-in for `useEffectEvent`). */
function useEvent< A extends unknown[], R >(callback: (...args: A) => R): (...args: A) => R {
  const latest = useLatest(callback)

  return useCallback((...args: A) => latest.current(...args), [latest])
}

/** Server snapshot is `false`, so the first client render matches the HTML. */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)

      mql.addEventListener('change', onChange)

      return () => mql.removeEventListener('change', onChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

const pct = (value: number, of: number) => `${(value / of) * 100}%`

/**
 * A tiny pointer feed shared by the grid and the character. It lives outside React so sixty moves
 * a second never re-render anything; subscribers draw straight to canvas or motion values
 */
interface PointerSample {
  x: number
  y: number
  t: number
}

type PointerListener = (sample: PointerSample) => void

const createPointerStore = () => {
  const listeners = new Set< PointerListener >()

  return {
    set: (sample: PointerSample) => {
      listeners.forEach(listener => listener(sample))
    },
    subscribe: (listener: PointerListener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    }
  }
}

type PointerStore = ReturnType< typeof createPointerStore >

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface NexaContextValue {
  theme: NexaTheme
  themes: NexaTheme[]
  defaultThemeId: string
  setTheme: (id: string) => void
  reduce: boolean
  grid: Required< NexaGridOptions >
  gaze: Required< NexaGazeOptions >
  brush: Required< NexaBrushOptions >
}

const NexaContext = createContext< NexaContextValue | null >(null)

const useNexa = (): NexaContextValue => {
  const value = useContext(NexaContext)

  if (!value) throw new Error('Nexa parts must be rendered inside <Nexa>')

  return value
}

/* -------------------------------------------------------------------------- */
/*                                    Tools                                   */
/* -------------------------------------------------------------------------- */

// `hx, hy` is the outgoing handle; the incoming one mirrors it, as with a smooth point in Photoshop.
interface Anchor {
  x: number
  y: number
  hx: number
  hy: number
}

interface PenPath {
  id: number
  anchors: Anchor[]
  closed: boolean
}

type ToolId = 'select' | 'move' | 'marquee' | 'crop' | 'brush' | 'text' | 'pen'

interface Tool {
  id: ToolId
  label: string

  // Keyboard shortcut, Photoshop-style
  key: string
  icon: LucideIcon

  // Shown in the canvas bar while the tool is active
  hint: string
}

const TOOLS: Tool[] = [
  { id: 'select', label: 'Select', key: 'V', icon: MousePointer2, hint: 'Click the name to edit it' },
  { id: 'move', label: 'Move', key: 'H', icon: Move, hint: 'Move tool' },
  { id: 'marquee', label: 'Marquee', key: 'M', icon: SquareDashedMousePointer, hint: 'Drag to select an area' },
  { id: 'crop', label: 'Zoom', key: 'Z', icon: ZoomIn, hint: 'Drag an area to zoom into it' },
  { id: 'brush', label: 'Brush', key: 'B', icon: Brush, hint: 'Paint. Strokes fade on their own' },
  { id: 'text', label: 'Text', key: 'T', icon: Type, hint: 'Click anywhere to add text' },
  { id: 'pen', label: 'Pen', key: 'P', icon: PenTool, hint: 'Click to place points, drag for curves, Enter to finish' }
]

// Tools that take over the pointer. The rest leave the page clickable (links, the title).
const CAPTURING: ToolId[] = ['marquee', 'crop', 'brush', 'text', 'pen']

const segment = (from: Anchor, to: Anchor) =>
  ` C ${from.x + from.hx} ${from.y + from.hy} ${to.x - to.hx} ${to.y - to.hy} ${to.x} ${to.y}`

// A pen path as SVG path data: cubic segments through the anchors, and back to the first when it's closed.
const toPath = (anchors: Anchor[], closed: boolean) => {
  if (!anchors.length) return ''

  let d = `M ${anchors[0].x} ${anchors[0].y}`

  for (let i = 1; i < anchors.length; i++) d += segment(anchors[i - 1], anchors[i])

  if (closed && anchors.length > 2) d += segment(anchors[anchors.length - 1], anchors[0]) + ' Z'

  return d
}

/* -------------------------------------------------------------------------- */
/*                               Inline SVG icons                             */
/* -------------------------------------------------------------------------- */

// Solid icons from Phosphor (MIT), inlined so the component needs no extra package.
const FolderIcon = (props: SVGProps< SVGSVGElement >) => (
  <svg viewBox='0 0 256 256' fill='currentColor' aria-hidden='true' {...props}>
    <path d='M216 72h-84.69L104 44.69A15.88 15.88 0 0 0 92.69 40H40a16 16 0 0 0-16 16v144.62A15.41 15.41 0 0 0 39.39 216h177.5A15.13 15.13 0 0 0 232 200.89V88a16 16 0 0 0-16-16M40 56h52.69l16 16H40Z' />
  </svg>
)

const CalendarIcon = (props: SVGProps< SVGSVGElement >) => (
  <svg viewBox='0 0 256 256' fill='currentColor' aria-hidden='true' {...props}>
    <path d='M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M84 184a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 0a12 12 0 1 1 12-12a12 12 0 0 1-12 12m0-40a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 40a12 12 0 1 1 12-12a12 12 0 0 1-12 12m0-40a12 12 0 1 1 12-12a12 12 0 0 1-12 12m36-64H48V48h24v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24Z' />
  </svg>
)

const GlobeIcon = (props: SVGProps< SVGSVGElement >) => (
  <svg viewBox='0 0 256 256' fill='currentColor' aria-hidden='true' {...props}>
    <path d='M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24m78.36 64h-35.65a135.3 135.3 0 0 0-22.3-45.6A88.29 88.29 0 0 1 206.37 88Zm9.64 40a87.6 87.6 0 0 1-3.33 24h-38.51a157.4 157.4 0 0 0 0-48h38.51a87.6 87.6 0 0 1 3.33 24m-88-85a115.3 115.3 0 0 1 26 45h-52a115.1 115.1 0 0 1 26-45m-26 125h52a115.1 115.1 0 0 1-26 45a115.3 115.3 0 0 1-26-45m-3.9-16a140.8 140.8 0 0 1 0-48h59.88a140.8 140.8 0 0 1 0 48Zm50.35 61.6a135.3 135.3 0 0 0 22.3-45.6h35.66a88.29 88.29 0 0 1-58 45.6Z' />
  </svg>
)

const STAT_ICONS: Record< NexaStatIcon, (props: SVGProps< SVGSVGElement >) => ReactNode > = {
  folder: FolderIcon,
  calendar: CalendarIcon,
  globe: GlobeIcon
}

// A selection's edge: a dark base under white dashes, so it reads on every background. `march` sets the dashes crawling.
const MarchingAnts = ({ march }: { march: boolean }) => (
  <svg aria-hidden='true' className='absolute inset-0 size-full overflow-visible'>
    <rect x='0.5' y='0.5' width='100%' height='100%' className='nx-ants-base' />
    <rect x='0.5' y='0.5' width='100%' height='100%' className={cn('nx-ants', march && 'nx-ants-march')} />
  </svg>
)

// The pen tool's finished paths in the theme colour. A closed shape gets a faint fill.
const PenPathsSvg = ({ paths }: { paths: PenPath[] }) => (
  <svg aria-hidden='true' className='absolute inset-0 size-full overflow-visible'>
    {paths.map(path => (
      <path
        key={path.id}
        d={toPath(path.anchors, path.closed)}
        className={cn('stroke-[var(--nx-accent)]', path.closed ? 'fill-[var(--nx-accent)]/10' : 'fill-none')}
        strokeWidth={1.75}
      />
    ))}
  </svg>
)

interface PenDraftSvgProps {
  anchors: Anchor[]
  pointer: { x: number; y: number } | null
  dragging: boolean
  closing: boolean
}

/**
 * The path being drawn: its segments, a dashed preview to the cursor, the last point's handles
 * and the anchor squares. A ring on the first point shows the next click will close the shape
 */
const PenDraftSvg = ({ anchors, pointer, dragging, closing }: PenDraftSvgProps) => {
  const last = anchors[anchors.length - 1]

  return (
    <svg aria-hidden='true' className='absolute inset-0 size-full overflow-visible'>
      {anchors.length > 0 && (
        <>
          <path d={toPath(anchors, false)} className='fill-none stroke-[var(--nx-accent)]' strokeWidth={1.75} />

          {last && pointer && !dragging && (
            <path
              d={`M ${last.x} ${last.y} C ${last.x + last.hx} ${last.y + last.hy} ${pointer.x} ${pointer.y} ${pointer.x} ${pointer.y}`}
              className='stroke-foreground/40 fill-none'
              strokeWidth={1}
              strokeDasharray='4 4'
            />
          )}

          {last && (last.hx !== 0 || last.hy !== 0) && (
            <g className='stroke-foreground/60'>
              <line x1={last.x - last.hx} y1={last.y - last.hy} x2={last.x + last.hx} y2={last.y + last.hy} />
              <circle cx={last.x - last.hx} cy={last.y - last.hy} r={3.5} className='fill-background' />
              <circle cx={last.x + last.hx} cy={last.y + last.hy} r={3.5} className='fill-background' />
            </g>
          )}

          {anchors.map((a, i) => (
            <rect
              key={i}
              x={a.x - 3.5}
              y={a.y - 3.5}
              width={7}
              height={7}
              className={cn(
                'stroke-[var(--nx-accent)]',
                i === anchors.length - 1 || (i === 0 && closing) ? 'fill-[var(--nx-accent)]' : 'fill-background'
              )}
              strokeWidth={1.25}
            />
          ))}

          {closing && (
            <circle cx={anchors[0].x} cy={anchors[0].y} r={8} className='fill-none stroke-[var(--nx-accent)]' strokeWidth={1} />
          )}
        </>
      )}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Swatches                                  */
/* -------------------------------------------------------------------------- */

const SWATCH_STEP: Record< string, number > = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

// Keeps focus in the title while editing, so picking a colour doesn't end the edit.
const keepFocus = (event: ReactPointerEvent< HTMLButtonElement >) => event.preventDefault()

/**
 * The one colour control. It lives in two places (the rail and the title's edit bar)
 * and both change the same theme. Arrow keys move through the swatches
 */
const Swatches = () => {
  // Hooks
  const { theme, themes, setTheme } = useNexa()
  const uid = useId()

  // Refs
  const groupRef = useRef< HTMLDivElement | null >(null)

  const handleKeyDown = (event: ReactKeyboardEvent< HTMLDivElement >) => {
    const step = SWATCH_STEP[event.key]

    if (!step) return

    event.preventDefault()

    const index = themes.findIndex(item => item.id === theme.id)
    const next = (index + step + themes.length) % themes.length

    setTheme(themes[next].id)
    groupRef.current?.querySelectorAll< HTMLButtonElement >('button')[next]?.focus()
  }

  return (
    <div
      ref={groupRef}
      role='radiogroup'
      aria-label='Theme colour'
      onKeyDown={handleKeyDown}
      className='flex items-center gap-0.5 sm:gap-1.5'
    >
      {themes.map(swatch => {
        const active = swatch.id === theme.id

        return (
          <button
            key={swatch.id}
            type='button'
            role='radio'
            aria-checked={active}
            aria-label={swatch.label}
            tabIndex={active ? 0 : -1}
            onPointerDown={keepFocus}
            onClick={() => setTheme(swatch.id)}
            className='nx-hit focus-visible:ring-ring focus-visible:ring-offset-background relative grid size-7 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          >
            {active && (
              <m.span
                layoutId={`nx-swatch-${uid}`}
                transition={MAGNET}
                className='border-foreground/80 absolute inset-0 rounded-full border'
              />
            )}
            <span style={{ backgroundColor: swatch.accent }} className='size-4.5 rounded-full' />
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Canvas grid                                */
/* -------------------------------------------------------------------------- */

interface GridCell {
  value: number
  target: number
}

/**
 * The lines themselves are a CSS background (.nx-grid): free to paint and always crisp.
 * This canvas only draws the few cells near the cursor, and only while something is lit:
 * the loop stops itself when the last cell has faded
 */
const CanvasGrid = ({ store }: { store: PointerStore }) => {
  // Hooks
  const { theme, grid } = useNexa()

  // Refs
  const ref = useRef< HTMLCanvasElement | null >(null)
  const accent = useLatest(theme.accent)
  const options = useLatest(grid)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    const cells = new Map< number, GridCell >()
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let last = 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }

    const frame = (now: number) => {
      const { cell: size, fade, glow } = options.current
      const dt = Math.min(now - last, 64)

      last = now

      const rise = 1 - Math.exp(-dt / 70)
      const decay = Math.exp(-dt / fade)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = accent.current
      ctx.shadowColor = accent.current
      ctx.shadowBlur = 12

      for (const [key, cell] of cells) {
        cell.value += (cell.target - cell.value) * rise
        cell.target *= decay

        if (cell.value < 0.01 && cell.target < 0.01) {
          cells.delete(key)
          continue
        }

        const col = Math.floor(key / 1000)
        const row = key % 1000

        ctx.globalAlpha = cell.value * glow
        ctx.strokeRect(col * size + 0.5, row * size + 0.5, size, size)
      }

      raf = cells.size ? requestAnimationFrame(frame) : 0
    }

    const light = (clientX: number, clientY: number) => {
      const { cell: size, reach } = options.current
      const rect = canvas.getBoundingClientRect()

      // The stage can be zoomed by the crop tool; divide the zoom back out.
      const scale = rect.width / (width || 1)
      const x = (clientX - rect.left) / scale
      const y = (clientY - rect.top) / scale

      if (x < 0 || y < 0 || x > width || y > height) return

      // Position-based intensity: faint on the left, full on the right
      const normalized = Math.min(1, Math.max(0, x / width))
      const intensity = Math.pow(normalized, 1.5) * 0.985 + 0.015

      const cx = x / size
      const cy = y / size

      for (let col = Math.floor(cx - reach); col <= Math.floor(cx + reach); col++) {
        for (let row = Math.floor(cy - reach); row <= Math.floor(cy + reach); row++) {
          if (col < 0 || row < 0) continue

          const distance = Math.hypot(col + 0.5 - cx, row + 0.5 - cy)
          const strength = Math.max(0, 1 - distance / (reach + 0.5)) ** 2 * intensity

          if (strength <= 0) continue

          const key = col * 1000 + row
          const cell = cells.get(key)

          if (cell) cell.target = Math.max(cell.target, strength)
          else cells.set(key, { value: 0, target: strength })
        }
      }

      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    const observer = new ResizeObserver(resize)

    observer.observe(canvas)
    resize()

    const unsubscribe = store.subscribe(sample => light(sample.x, sample.y))

    return () => {
      observer.disconnect()
      unsubscribe()
      cancelAnimationFrame(raf)
    }
  }, [store, accent, options])

  return <canvas ref={ref} aria-hidden='true' className='pointer-events-none absolute inset-0 size-full' />
}

/* -------------------------------------------------------------------------- */
/*                                 Brush layer                                */
/* -------------------------------------------------------------------------- */

interface BrushPoint {
  x: number
  y: number
  t: number
}

/**
 * Paint that doesn't stay. Every point remembers when it was laid down and fades by its own age,
 * so a stroke dissolves from its tail while it's still being drawn: the hero is never covered for long
 */
const BrushLayer = ({ active }: { active: boolean }) => {
  // Hooks
  const { theme, brush } = useNexa()

  // Refs
  const ref = useRef< HTMLCanvasElement | null >(null)
  const colour = useLatest(theme.accent)
  const options = useLatest(brush)
  const api = useRef< { begin: (event: PointerEvent) => void } | null >(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    const strokes: BrushPoint[][] = []
    let current: BrushPoint[] | null = null

    // The pointer drawing the current stroke; a second finger or cursor must not join it
    let owner = -1
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }

    const draw = () => {
      const { width: lineWidth, life: lifetime, glow } = options.current
      const now = performance.now()

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = colour.current
      ctx.shadowColor = colour.current
      ctx.shadowBlur = glow

      for (let s = strokes.length - 1; s >= 0; s--) {
        const points = strokes[s]

        while (points.length > 1 && now - points[0].t > lifetime && points !== current) points.shift()

        if (points.length < 2) {
          if (points !== current) strokes.splice(s, 1)
          continue
        }

        // Segment by segment, each at its own age: smooth curves through the midpoints.
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1]
          const b = points[i]
          const life = 1 - (now - b.t) / lifetime

          if (life <= 0) continue

          const prev = points[i - 2] ?? a
          const startX = (prev.x + a.x) / 2
          const startY = (prev.y + a.y) / 2

          ctx.globalAlpha = life * life
          ctx.lineWidth = lineWidth * (0.45 + 0.55 * life)
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2)
          ctx.stroke()
        }
      }

      raf = strokes.length ? requestAnimationFrame(draw) : 0
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const point = (event: PointerEvent): BrushPoint => {
      const rect = canvas.getBoundingClientRect()

      return { x: event.clientX - rect.left, y: event.clientY - rect.top, t: performance.now() }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const stroke = current

      if (!stroke || event.pointerId !== owner) return

      // Coalesced events keep fast strokes round instead of polygonal.
      const events = event.getCoalescedEvents?.() ?? [event]

      events.forEach(e => stroke.push(point(e)))
      wake()
    }

    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerId === owner) current = null
    }

    api.current = {
      begin: (event: PointerEvent) => {
        owner = event.pointerId
        current = [point(event)]
        strokes.push(current)
        canvas.setPointerCapture(event.pointerId)
        wake()
      }
    }

    const observer = new ResizeObserver(resize)

    observer.observe(canvas)
    resize()
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerEnd)
    canvas.addEventListener('pointercancel', handlePointerEnd)

    return () => {
      observer.disconnect()
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerEnd)
      canvas.removeEventListener('pointercancel', handlePointerEnd)
      cancelAnimationFrame(raf)
    }
  }, [colour, options])

  const handlePointerDown = (event: ReactPointerEvent< HTMLCanvasElement >) => {
    if (event.button !== 0) return
    event.preventDefault()
    api.current?.begin(event.nativeEvent)
  }

  return (
    <canvas
      ref={ref}
      aria-hidden='true'
      onPointerDown={handlePointerDown}
      className={cn(
        'nx-brush-cursor absolute inset-0 size-full touch-none',
        active ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Pen layer                                 */
/* -------------------------------------------------------------------------- */

type PathsUpdate = (update: (paths: PenPath[]) => PenPath[]) => void

// Px from the first point that closes the shape
const CLOSE_RADIUS = 10
const MAX_PATHS = 10

const isNearFirst = (anchors: Anchor[], point: { x: number; y: number } | null) =>
  !!point && anchors.length > 2 && Math.hypot(point.x - anchors[0].x, point.y - anchors[0].y) < CLOSE_RADIUS

const PenDraft = ({ onPaths }: { onPaths: PathsUpdate }) => {
  // States
  const [anchors, setAnchors] = useState< Anchor[] >([])
  const [dragging, setDragging] = useState(false)
  const [pointer, setPointer] = useState< { x: number; y: number } | null >(null)

  // Refs
  const ref = useRef< HTMLDivElement | null >(null)

  // Switching tools mid-path keeps what was drawn, as in Photoshop.
  const latest = useLatest(anchors)

  // Vars
  const closing = isNearFirst(anchors, pointer)

  const local = (event: ReactPointerEvent) => {
    const rect = ref.current!.getBoundingClientRect()

    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const save = (list: Anchor[], closed: boolean) => {
    // A double-click lands two points on the same spot; drop the duplicate.
    const clean = list.filter((a, i) => i === 0 || Math.hypot(a.x - list[i - 1].x, a.y - list[i - 1].y) > 2)

    if (clean.length >= 2) {
      onPaths(all => [...all.slice(-(MAX_PATHS - 1)), { id: Date.now(), anchors: clean, closed }])
    }
  }

  const finish = (closed: boolean) => {
    save(anchors, closed)
    setAnchors([])
    setPointer(null)
  }

  const handleKeyDown = useEvent((event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') return

    event.preventDefault()
    event.stopPropagation()
    finish(false)
  })

  useEffect(() => {
    // Capture phase: Escape here should end the path, not also drop the tool.
    window.addEventListener('keydown', handleKeyDown, true)

    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])

  const saveOnExit = useEvent(() => save(latest.current, false))

  useEffect(() => () => saveOnExit(), [saveOnExit])

  const handlePointerDown = (event: ReactPointerEvent) => {
    if (event.button !== 0) return

    event.preventDefault()

    const point = local(event)

    if (isNearFirst(anchors, point)) {
      finish(true)

      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    setAnchors(list => [...list, { ...point, hx: 0, hy: 0 }])
    setDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent) => {
    const point = local(event)

    setPointer(point)

    if (!dragging) return

    setAnchors(list => {
      const last = list[list.length - 1]

      if (!last) return list

      const hx = point.x - last.x
      const hy = point.y - last.y

      return [...list.slice(0, -1), Math.hypot(hx, hy) > 3 ? { ...last, hx, hy } : { ...last, hx: 0, hy: 0 }]
    })
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  const handlePointerLeave = () => {
    if (!dragging) setPointer(null)
  }

  const handleDoubleClick = () => {
    finish(false)
  }

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onDoubleClick={handleDoubleClick}
      className='nx-pen-cursor pointer-events-auto absolute inset-0 touch-none'
    >
      <PenDraftSvg anchors={anchors} pointer={pointer} dragging={dragging} closing={closing} />
    </div>
  )
}

interface PenLayerProps {
  active: boolean
  paths: PenPath[]
  onPaths: PathsUpdate
}

// Finished paths stay on the canvas whatever tool is picked; the draft only exists while the pen is out.
const PenLayer = ({ active, paths, onPaths }: PenLayerProps) => (
  <div className='pointer-events-none absolute inset-0'>
    <PenPathsSvg paths={paths} />

    {active && <PenDraft onPaths={onPaths} />}
  </div>
)

/* -------------------------------------------------------------------------- */
/*                               Selection layer                              */
/* -------------------------------------------------------------------------- */

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface SelectionLayerProps {
  mode: 'marquee' | 'crop'
  zoomed: boolean
  onMeasure: (size: { w: number; h: number } | null) => void
  onCrop: (rect: Rect) => void
  onUncrop: () => void
}

// Px: anything smaller is a click, not a selection
const MIN_SELECTION = 8

const CROP_CORNERS = [
  '-left-0.5 -top-0.5 border-t-2 border-l-2',
  '-right-0.5 -top-0.5 border-t-2 border-r-2',
  '-left-0.5 -bottom-0.5 border-b-2 border-l-2',
  '-right-0.5 -bottom-0.5 border-b-2 border-r-2'
] as const

/**
 * Marquee and crop share the drag. Marquee keeps the selection on screen with marching ants;
 * crop hands it to the stage, which zooms to fill the canvas with it
 */
const SelectionLayer = ({ mode, zoomed, onMeasure, onCrop, onUncrop }: SelectionLayerProps) => {
  // States
  const [rect, setRect] = useState< Rect | null >(null)
  const [dragging, setDragging] = useState(false)

  // Refs
  const ref = useRef< HTMLDivElement | null >(null)
  const anchor = useRef< { x: number; y: number } | null >(null)

  // Hooks
  const { reduce } = useNexa()

  const local = (event: ReactPointerEvent) => {
    const box = ref.current!.getBoundingClientRect()

    return {
      x: Math.min(Math.max(event.clientX - box.left, 0), box.width),
      y: Math.min(Math.max(event.clientY - box.top, 0), box.height)
    }
  }

  const handlePointerDown = (event: ReactPointerEvent) => {
    if (event.button !== 0) return

    // A drag across the page would otherwise also select its text.
    event.preventDefault()

    if (zoomed) {
      onUncrop()

      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    anchor.current = local(event)
    setRect({ ...anchor.current, w: 0, h: 0 })
    setDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent) => {
    if (!dragging || !anchor.current) return

    const point = local(event)

    const next = {
      x: Math.min(point.x, anchor.current.x),
      y: Math.min(point.y, anchor.current.y),
      w: Math.abs(point.x - anchor.current.x),
      h: Math.abs(point.y - anchor.current.y)
    }

    setRect(next)
    onMeasure({ w: next.w, h: next.h })
  }

  const handlePointerUp = () => {
    if (!dragging) return

    setDragging(false)
    anchor.current = null

    if (!rect || rect.w < MIN_SELECTION || rect.h < MIN_SELECTION) {
      setRect(null)
      onMeasure(null)

      return
    }

    if (mode === 'crop') {
      onCrop(rect)
      setRect(null)
      onMeasure(null)
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn('pointer-events-auto absolute inset-0 touch-none', zoomed ? 'cursor-zoom-out' : 'cursor-crosshair')}
    >
      {rect && (
        <div
          style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
          className='pointer-events-none absolute shadow-[0_0_0_9999px_rgb(0_0_0/0.42)]'
        >
          <MarchingAnts march={!reduce} />

          {mode === 'crop' && (
            <>
              <span className='bg-foreground/25 absolute inset-y-0 left-1/3 w-px' />
              <span className='bg-foreground/25 absolute inset-y-0 left-2/3 w-px' />
              <span className='bg-foreground/25 absolute inset-x-0 top-1/3 h-px' />
              <span className='bg-foreground/25 absolute inset-x-0 top-2/3 h-px' />
              {CROP_CORNERS.map(corner => (
                <span key={corner} className={cn('absolute size-3.5 border-[var(--nx-accent)]', corner)} />
              ))}
            </>
          )}

          {rect.w >= MIN_SELECTION && rect.h >= MIN_SELECTION && (
            <m.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className='absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-sm bg-[var(--nx-accent)] px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-[var(--nx-accent-ink)] tabular-nums'
            >
              {Math.round(rect.w)} × {Math.round(rect.h)}
            </m.span>
          )}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Text layer                                */
/* -------------------------------------------------------------------------- */

interface TextItem {
  id: number
  x: number
  y: number
  text: string
}

interface TextLayerProps {
  active: boolean
  items: TextItem[]
  editingId: number | null
  onItems: (update: (items: TextItem[]) => TextItem[]) => void
  onEditing: (id: number | null) => void
}

interface TextBoxProps {
  item: TextItem
  editing: boolean
  selectable: boolean
  onEdit: () => void
  onCommit: (text: string) => void
}

const MAX_TEXT_ITEMS = 12

const blurActive = () => (document.activeElement as HTMLElement | null)?.blur()

const TextBox = ({ item, editing, selectable, onEdit, onCommit }: TextBoxProps) => {
  // Refs
  const ref = useRef< HTMLDivElement | null >(null)

  // Hooks
  const { reduce } = useNexa()

  // Uncontrolled while editing: React re-rendering a contentEditable's text moves the caret.
  useEffect(() => {
    const el = ref.current

    if (!editing || !el) return

    el.textContent = item.text
    el.focus({ preventScroll: true })

    const range = document.createRange()

    range.selectNodeContents(el)
    range.collapse(false)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps -- runs only when editing starts; `item.text` is read once

  const handlePointerDown = (event: ReactPointerEvent< HTMLDivElement >) => {
    if (!selectable || editing) return
    event.stopPropagation()
    event.preventDefault()
    blurActive()
    onEdit()
  }

  const handleBlur = (event: FocusEvent< HTMLDivElement >) => {
    onCommit(event.currentTarget.textContent ?? '')
  }

  const handleKeyDown = (event: ReactKeyboardEvent< HTMLDivElement >) => {
    if (event.key === 'Escape' || (event.key === 'Enter' && !event.shiftKey)) {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={MAGNET}
      style={{ left: item.x, top: item.y }}
      className='absolute -translate-y-1/2'
    >
      <div
        ref={ref}
        role={editing ? 'textbox' : undefined}
        aria-label={editing ? 'Text layer' : undefined}
        contentEditable={editing ? 'plaintext-only' : false}
        suppressContentEditableWarning
        spellCheck={false}
        onPointerDown={handlePointerDown}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'text-foreground min-w-6 px-1.5 py-0.5 text-xl font-semibold whitespace-pre caret-[var(--nx-accent)] outline-none sm:text-2xl',
          editing ? 'border border-dashed border-[var(--nx-accent)]' : 'border border-transparent',
          !editing && selectable && 'hover:border-foreground/30 pointer-events-auto'
        )}
      >
        {editing ? null : item.text}
      </div>
    </m.div>
  )
}

const TextLayer = ({ active, items, editingId, onItems, onEditing }: TextLayerProps) => {
  // Refs
  const ref = useRef< HTMLDivElement | null >(null)

  const handlePointerDown = (event: ReactPointerEvent) => {
    if (!active || event.button !== 0 || event.target !== event.currentTarget) return

    // Close the box being edited first (its blur saves it), then keep the browser from pulling focus off the new box.
    event.preventDefault()
    blurActive()

    const rect = ref.current!.getBoundingClientRect()
    const id = Date.now()

    onItems(list => [
      ...list.slice(-(MAX_TEXT_ITEMS - 1)),
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top, text: '' }
    ])
    onEditing(id)
  }

  const handleCommit = (id: number, text: string) => {
    onItems(list => (text.trim() ? list.map(i => (i.id === id ? { ...i, text } : i)) : list.filter(i => i.id !== id)))
    onEditing(null)
  }

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      className={cn('absolute inset-0', active ? 'pointer-events-auto cursor-text' : 'pointer-events-none')}
    >
      {items.map(item => (
        <TextBox
          key={item.id}
          item={item}
          editing={item.id === editingId}
          selectable={active}
          onEdit={() => onEditing(item.id)}
          onCommit={text => handleCommit(item.id, text)}
        />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Character                                 */
/* -------------------------------------------------------------------------- */

// Anything the pointer can act on. Over these he stays quiet: the greeting is for the empty canvas around him.
const INTERACTIVE = '[data-nx-cursor="off"], button, a, textarea, [role="slider"], [role="menu"]'

interface EyeProps {
  eye: NexaEye
  character: NexaCharacter
  pupilSrc: string
  lookX: MotionValue< number >
  lookY: MotionValue< number >
  blinking: boolean
}

const Eye = ({ eye, character, pupilSrc, lookX, lookY, blinking }: EyeProps) => {
  // Hooks
  const { gaze } = useNexa()

  // Percent of the pupil's own width, so the travel scales with the character.
  const x = useTransform(lookX, v => `${((v * gaze.x) / eye.iris) * 100}%`)
  const y = useTransform(lookY, v => `${((v * gaze.y) / eye.iris) * 100}%`)

  // A disc seen at an angle narrows: the sideways glance reads as the eye turning, not sliding.
  const scaleX = useTransform(lookX, v => 1 - gaze.turn * Math.abs(v))

  // Vars
  const [x0, y0, x1, y1] = eye.box
  const w = x1 - x0
  const h = y1 - y0
  const outline = eye.outline.map(([px, py]) => `${pct(px - x0, w)} ${pct(py - y0, h)}`).join(', ')

  return (
    <div
      aria-hidden='true'
      style={{
        left: pct(x0, character.width),
        top: pct(y0, character.height),
        width: pct(w, character.width),
        height: pct(h, character.height),
        clipPath: `polygon(${outline})`
      }}
      className='absolute'
    >
      <m.img
        src={pupilSrc}
        alt=''
        draggable={false}
        style={{
          x,
          y,
          scaleX,
          left: pct(eye.rest[0] - x0, w),
          top: pct(eye.rest[1] - y0, h),
          width: pct(eye.iris, w),

          // Percentage margins resolve against the width, which is what centres a square here.
          marginLeft: `-${(eye.iris / 2 / w) * 100}%`,
          marginTop: `-${(eye.iris / 2 / w) * 100}%`
        }}
        className='absolute aspect-square max-w-none select-none'
      />
      <div className='nx-eye-shade absolute inset-0' />
      <m.div
        initial={false}
        animate={{ scaleY: blinking ? 1 : 0 }}
        transition={{ duration: 0.07, ease: 'easeInOut' }}
        className='nx-eyelid absolute inset-0 origin-top'
      />
    </div>
  )
}

interface CharacterProps {
  store: PointerStore
  name: string
  character: NexaCharacter
  greeting?: string
  className?: string
  hint?: boolean
}

const Character = ({ store, name, character, greeting, className, hint = true }: CharacterProps) => {
  // States
  const [blinking, setBlinking] = useState(false)
  const [hovering, setHovering] = useState(false)

  // Refs
  const rootRef = useRef< HTMLDivElement | null >(null)

  // Hooks
  const { reduce, gaze } = useNexa()

  // Vars
  const pupilSrc = character.pupilSrc
  const eyes = useMemo(() => (character.pupilSrc ? (character.eyes ?? []) : []), [character.pupilSrc, character.eyes])

  // Midpoint between the two pupils, as a fraction of the image: the point the gaze is measured from.
  const mid = useMemo(
    () =>
      eyes.length
        ? {
            x: eyes.reduce((sum, eye) => sum + eye.rest[0], 0) / eyes.length / character.width,
            y: eyes.reduce((sum, eye) => sum + eye.rest[1], 0) / eyes.length / character.height
          }
        : { x: 0.5, y: 0.25 },
    [eyes, character.width, character.height]
  )

  const midRef = useLatest(mid)
  const gazeRef = useLatest(gaze)

  // Gaze direction, -1 to 1 on each axis. Slightly under-damped, so the eyes trail the cursor and land with the
  // faintest overshoot, the way eyes actually settle
  const gazeX = useMotionValue(0)
  const gazeY = useMotionValue(0)
  const stiffness = 120 / (gaze.lag * gaze.lag)
  const spring = useMemo(() => ({ stiffness, damping: gaze.settle * Math.sqrt(stiffness), mass: 1 }), [stiffness, gaze.settle])
  const lookX = useSpring(gazeX, spring)
  const lookY = useSpring(gazeY, spring)

  useEffect(() => {
    const unsubscribe = store.subscribe(sample => {
      const root = rootRef.current

      if (!root) return

      const rect = root.getBoundingClientRect()
      const dx = sample.x - (rect.left + rect.width * midRef.current.x)
      const dy = sample.y - (rect.top + rect.height * midRef.current.y)
      const { distance } = gazeRef.current

      // Saturating curve: quick response near the face, settling toward the limit far away.
      gazeX.set(dx / (Math.abs(dx) + distance))
      gazeY.set(dy / (Math.abs(dy) + distance))
    })

    // Pointer gone: he stops following it and looks ahead again.
    const lookAhead = () => {
      gazeX.set(0)
      gazeY.set(0)
    }

    const handlePointerOut = (event: PointerEvent) => event.relatedTarget === null && lookAhead()
    const root = document.documentElement

    root.addEventListener('pointerout', handlePointerOut)
    window.addEventListener('blur', lookAhead)

    return () => {
      unsubscribe()
      root.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('blur', lookAhead)
    }
  }, [store, gazeX, gazeY, midRef, gazeRef])

  // He blinks at random intervals while on screen in a visible tab
  useEffect(() => {
    const root = rootRef.current

    if (reduce || !root || !eyes.length) return

    let timer = 0
    let onScreen = true
    let running = false

    const schedule = () => {
      const [min, max] = gazeRef.current.blinkEvery

      timer = window.setTimeout(
        () => {
          setBlinking(true)
          timer = window.setTimeout(() => {
            setBlinking(false)
            schedule()
          }, gazeRef.current.blinkLength)
        },
        min + Math.random() * (max - min)
      )
    }

    const sync = () => {
      const active = onScreen && !document.hidden

      if (active && !running) {
        running = true
        schedule()
      } else if (!active && running) {
        running = false
        window.clearTimeout(timer)
        setBlinking(false)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })

    sync()
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.clearTimeout(timer)
    }
  }, [reduce, eyes.length, gazeRef])

  // "On him": inside his box, not over a control. Entering has to be deliberate; leaving is immediate.
  useEffect(() => {
    let timer = 0
    let inside = false
    const canTilt =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resetTilt = (root: HTMLDivElement) => {
      root.style.setProperty('--nx-tilt-x', '0deg')
      root.style.setProperty('--nx-tilt-y', '0deg')
    }

    const set = (next: boolean) => {
      if (next === inside) return
      inside = next
      window.clearTimeout(timer)

      if (next) timer = window.setTimeout(() => setHovering(true), HINT.delay)
      else setHovering(false)
    }

    const unsubscribe = store.subscribe(sample => {
      const root = rootRef.current
      const rect = root?.getBoundingClientRect()

      if (!root || !rect) return

      const overFigure =
        sample.x >= rect.left &&
        sample.x <= rect.right &&
        sample.y >= rect.top &&
        sample.y <= rect.bottom
      const overControl = !!document.elementFromPoint(sample.x, sample.y)?.closest(INTERACTIVE)

      if (canTilt && overFigure && !overControl) {
        const x = ((sample.x - rect.left) / rect.width - 0.5) * 2
        const y = ((sample.y - rect.top) / rect.height - 0.5) * 2
        root.style.setProperty('--nx-tilt-x', `${-y * 5}deg`)
        root.style.setProperty('--nx-tilt-y', `${x * 6}deg`)
      } else {
        resetTilt(root)
      }

      const [from, to] = HINT.zone

      const over =
        sample.x >= rect.left + rect.width * from &&
        sample.x <= rect.left + rect.width * to &&
        sample.y >= rect.top &&
        sample.y <= rect.bottom

      set(over && !overControl)
    })

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return

      set(false)
      if (rootRef.current) resetTilt(rootRef.current)
    }
    const root = document.documentElement

    root.addEventListener('pointerout', handlePointerOut)

    return () => {
      unsubscribe()
      root.removeEventListener('pointerout', handlePointerOut)
      window.clearTimeout(timer)
    }
  }, [store])

  return (
    <div
      ref={rootRef}
      {...(character.alt ? { role: 'img', 'aria-label': character.alt } : { 'aria-hidden': true })}
      data-hovered={hovering}
      style={{ aspectRatio: `${character.width} / ${character.height}` }}
      className={cn('relative isolate', className)}
    >
      {/* A layer label over his head, in the workspace's own panel style. The pointer never touches it. */}
      <AnimatePresence>
        {greeting && hint && hovering && (
          <m.div
            key='hint'
            aria-hidden='true'
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
            style={{ left: `${mid.x * 100}%`, marginBottom: HINT.gap }}
            className='nx-accent-text bg-card/90 border-border pointer-events-none absolute bottom-full z-20 -translate-x-1/2 rounded-lg border px-3 py-1.5 text-[13px] leading-none font-medium whitespace-nowrap shadow-xl shadow-black/40 backdrop-blur-md'
          >
            {greeting.replace('{name}', name)}
          </m.div>
        )}
      </AnimatePresence>

      <Image
        src={character.src}
        alt=''
        width={character.width}
        height={character.height}
        unoptimized
        decoding='async'
        className='absolute inset-0 size-full object-contain select-none'
        draggable={false}
      />

      <div
        aria-hidden='true'
        style={{ '--nx-src': `url("${character.src}")` } as CSSProperties}
        className='nx-rim absolute inset-0'
      />

      {pupilSrc &&
        eyes.map(eye => (
          <Eye
            key={eye.id}
            eye={eye}
            character={character}
            pupilSrc={pupilSrc}
            lookX={lookX}
            lookY={lookY}
            blinking={blinking}
          />
        ))}

      {/* Recolours the accented details to the current theme; `color` blending keeps their shading. */}
      {character.accentMaskSrc && (
        <div
          aria-hidden='true'
          style={{ '--nx-mask': `url("${character.accentMaskSrc}")` } as CSSProperties}
          className='nx-char-accent absolute inset-0'
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Craft label                                */
/* -------------------------------------------------------------------------- */

const LABEL_LAYOUT = { layout: { duration: 0.45, ease: EASE } }

interface CraftLabelProps {
  label?: string
  words: string[]
  interval: number
}

/**
 * The rotating label. Screen readers get the whole list once (aria-label) while the animated word is hidden from
 * them, so nothing is announced every few seconds. With reduced motion it stays on the first word
 */
const CraftLabel = ({ label, words, interval }: CraftLabelProps) => {
  // States
  const [index, setIndex] = useState(0)

  // Refs
  const rootRef = useRef< HTMLDivElement | null >(null)

  // Hooks
  const { reduce } = useNexa()

  // Vars
  const count = words.length
  const word = words[index % Math.max(count, 1)]

  // The word changes every `interval` ms, held while the label is off screen or the tab is hidden
  useEffect(() => {
    const element = rootRef.current

    if (!element || reduce || count < 2) return

    let timer = 0
    let dueAt = 0
    let remaining = interval
    let onScreen = true
    let running = false

    const start = () => {
      running = true
      dueAt = performance.now() + remaining
      timer = window.setTimeout(() => {
        setIndex(i => (i + 1) % count)
        remaining = interval
        start()
      }, remaining)
    }

    const stop = () => {
      running = false
      window.clearTimeout(timer)
      remaining = Math.max(0, dueAt - performance.now())
    }

    const sync = () => {
      const active = onScreen && !document.hidden

      if (active && !running) start()
      else if (!active && running) stop()
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })

    sync()
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.clearTimeout(timer)
    }
  }, [count, interval, reduce])

  if (!count) return null

  // borderRadius lives in style so Motion keeps the corners true while the width animates.
  return (
    <m.div
      ref={rootRef}
      layout
      transition={LABEL_LAYOUT}
      style={{ borderRadius: 10 }}
      role='group'
      aria-label={`${label ?? ''} ${words.join(', ')}`.trim()}
      className='bg-card/90 border-border inline-flex items-center gap-2 border px-5 py-2.5 text-[13px] font-medium shadow-lg shadow-black/30 backdrop-blur-md sm:text-sm'
    >
      <m.span
        layout='position'
        transition={LABEL_LAYOUT}
        aria-hidden='true'
        className='size-2 shrink-0 rounded-full bg-[var(--nx-accent)] shadow-[0_0_8px_var(--nx-accent)]'
      />

      {label && (
        <m.span layout='position' transition={LABEL_LAYOUT} aria-hidden='true' className='text-foreground/60'>
          {label}
        </m.span>
      )}

      <span aria-hidden='true' className='inline-flex overflow-hidden'>
        <AnimatePresence mode='wait' initial={false}>
          <m.span
            key={word}
            layout='position'
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: EASE } }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }
            }
            className='nx-accent-text font-bold whitespace-nowrap'
          >
            {word}
          </m.span>
        </AnimatePresence>
      </span>
    </m.div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Stats row                                 */
/* -------------------------------------------------------------------------- */

// "120+" counts to 120 and keeps the "+"; "08" keeps its leading zero the whole way up. Text with no number is left alone.
const parseStat = (value: string) => {
  const match = value.match(/^(\d+)(.*)$/)

  if (!match) return null

  const [, digits, suffix] = match

  return { target: Number(digits), pad: digits.startsWith('0') ? digits.length : 0, suffix }
}

const formatStat = (value: string, latest: number) => {
  const parsed = parseStat(value)

  return parsed ? `${String(Math.round(latest)).padStart(parsed.pad, '0')}${parsed.suffix}` : value
}

interface CounterProps {
  value: string
  delay: number
  reduce: boolean
}

const Counter = ({ value, delay, reduce }: CounterProps) => {
  // Refs
  const ref = useRef< HTMLSpanElement | null >(null)

  // Hooks
  const seen = useInView(ref, { once: true, amount: 0.6 })
  const count = useMotionValue(reduce ? (parseStat(value)?.target ?? 0) : 0)
  const text = useTransform(count, latest => formatStat(value, latest))

  // Vars
  const target = parseStat(value)?.target ?? 0

  // Counts when the card is actually on screen, so on a phone it waits until it is scrolled to.
  useEffect(() => {
    if (!seen || reduce) return

    const controls = animate(count, target, { duration: 1.8, delay, ease: EASE })

    return () => controls.stop()
  }, [seen, reduce, count, target, delay])

  return (
    <span
      ref={ref}
      className='text-foreground block text-[19px] leading-none font-bold tabular-nums min-[360px]:text-[22px] min-[400px]:text-[26px] xl:text-[30px]'
    >
      <span className='sr-only'>{value}</span>
      <m.span aria-hidden='true'>{text}</m.span>
    </span>
  )
}

/**
 * Panel-style cards: on phones three columns pulled up over the character's hips (the label drops below 560px);
 * from tablet up they float over the stage's bottom-right corner. While a drawing tool owns the pointer they let
 * clicks through, so a brush stroke can cross them
 */
const StatsRow = ({ stats, interactive }: { stats: NexaStat[]; interactive: boolean }) => {
  // Hooks
  const { reduce } = useNexa()

  if (!stats.length) return null

  return (
    <ul
      aria-label='Highlights'
      className='pointer-events-none relative z-40 -mt-14 grid grid-flow-col auto-cols-fr gap-1.5 px-[var(--nx-pad)] pb-6 min-[360px]:gap-2 md:absolute md:right-[clamp(40px,3cqw,56px)] md:bottom-[clamp(36px,3cqw,56px)] md:mt-0 md:flex md:gap-3 md:p-0'
    >
      {stats.map((stat, index) => {
        const enter = 0.7 + index * 0.08
        const Icon = STAT_ICONS[stat.icon ?? 'folder']

        return (
          <m.li
            key={stat.id}
            data-nx-cursor='off'
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: enter, ease: EASE }}
            className={cn(
              'bg-card/70 border-border flex min-h-24 min-w-0 flex-col justify-between gap-2 rounded-xl border px-1.5 py-2 backdrop-blur-md transition-[translate] duration-300 ease-out select-none min-[360px]:p-2.5 min-[400px]:p-3 md:h-24 md:w-[148px] md:shrink-0 md:gap-0 xl:h-28 xl:w-[170px] xl:p-4',
              interactive && 'pointer-events-auto hover:-translate-y-[3px]'
            )}
          >
            <span className='flex h-4 items-center gap-2'>
              <Icon className='size-4 shrink-0 text-[var(--nx-accent-text)]' />
              <span className='text-foreground/60 truncate text-[11px] leading-none font-medium tracking-[0.12em] uppercase max-[559px]:hidden'>
                {stat.label}
              </span>
            </span>

            <Counter value={stat.value} delay={enter + 0.25} reduce={reduce} />

            <span className='text-foreground/70 block text-[9.5px] leading-tight hyphens-auto min-[360px]:text-[11px] min-[400px]:text-xs xl:text-[13px]'>
              {stat.caption}
            </span>
          </m.li>
        )
      })}
    </ul>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Navbar                                   */
/* -------------------------------------------------------------------------- */

interface NavbarProps {
  brand?: NexaBrand
  navLinks: NexaNavLink[]
  status?: NexaAction
}

const FOCUS_RING =
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const Navbar = ({ brand, navLinks, status }: NavbarProps) => {
  // States
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Hooks
  const { reduce } = useNexa()
  const { scrollY } = useScroll()
  const wide = useMediaQuery('(min-width: 1024px)')
  const menuId = useId()

  // Vars
  const open = menuOpen && !wide

  useMotionValueEvent(scrollY, 'change', y => setScrolled(y > 12))

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <m.header
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn('nx-nav sticky top-0 z-50', (scrolled || open) && 'is-solid')}
    >
      <nav
        aria-label='Primary'
        className='flex h-[var(--nx-nav)] items-center justify-between gap-6 pr-4 pl-[var(--nx-rail-inset)] sm:pr-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:pr-7'
      >
        {brand ? (
          <a href={brand.href ?? '#'} className={cn('nx-hit flex items-center gap-3 justify-self-start rounded-md', FOCUS_RING)}>
            <span className='nx-display grid size-[var(--nx-mark)] place-items-center rounded-md bg-[var(--nx-accent)] text-[12px] font-black tracking-tight text-[var(--nx-accent-ink)] sm:text-[13px]'>
              {brand.mark}
            </span>
            <span className='text-foreground text-[17px] font-semibold tracking-[0.04em] sm:text-lg'>
              {brand.name}
              {brand.sup && <sup className='ml-0.5 text-[9px] font-medium'>{brand.sup}</sup>}
            </span>
          </a>
        ) : (
          <span />
        )}

        <ul className='hidden items-center gap-9 lg:flex xl:gap-10'>
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={cn(
                  'text-foreground/85 relative py-2 text-[15px] font-medium transition-colors duration-200 hover:text-[var(--nx-accent-text)] focus-visible:rounded-sm',
                  "after:bg-foreground after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100",
                  link.current && 'text-foreground after:scale-x-100',
                  FOCUS_RING
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-2 justify-self-end sm:gap-4'>
          {status && (
            <a
              href={status.href}
              className={cn('nx-hit text-foreground group flex items-center gap-3 rounded-md py-2 text-[15px] font-medium', FOCUS_RING)}
            >
              <span aria-hidden='true' className='relative grid size-3 place-items-center'>
                <span className='nx-pulse absolute inset-0 rounded-full bg-green-400' />
                <span className='relative size-3 rounded-full bg-green-400' />
              </span>
              <span className='hidden sm:inline'>{status.label}</span>
              <span className='sr-only sm:hidden'>{status.label}</span>
              <ArrowUpRight
                aria-hidden='true'
                className='hidden size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block'
                strokeWidth={1.75}
              />
            </a>
          )}

          {navLinks.length > 0 && (
            <button
              type='button'
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setMenuOpen(v => !v)}
              className={cn('nx-hit text-foreground hover:bg-foreground/[0.06] grid size-10 place-items-center rounded-lg lg:hidden', FOCUS_RING)}
            >
              {open ? <X aria-hidden='true' className='size-5' /> : <Menu aria-hidden='true' className='size-5' />}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id={menuId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className='bg-background/95 border-border absolute inset-x-0 top-full border-b backdrop-blur-xl lg:hidden'
          >
            <ul className='flex flex-col px-4 py-3 sm:px-6'>
              {navLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={link.current ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn('text-foreground/90 hover:text-foreground block rounded-md py-3 text-lg font-medium', FOCUS_RING)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                  */
/* -------------------------------------------------------------------------- */

interface ToolbarProps {
  tool: ToolId
  onTool: (tool: ToolId) => void
  onReset: () => void
  open: boolean
  onClose: () => void
}

const Toolbar = ({ tool, onTool, onReset, open, onClose }: ToolbarProps) => {
  // States
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Refs
  const asideRef = useRef< HTMLElement | null >(null)
  const paletteRef = useRef< HTMLDivElement | null >(null)
  const paletteButtonRef = useRef< HTMLButtonElement | null >(null)

  // Hooks
  const { reduce } = useNexa()
  const phone = !useMediaQuery('(min-width: 768px)')
  const uid = useId()

  // Vars
  const hidden = phone && !open

  // A closed phone panel is out of the tab order and the accessibility tree.
  useEffect(() => {
    if (asideRef.current) asideRef.current.inert = hidden
  }, [hidden])

  useEffect(() => {
    if (!phone || !open) return

    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phone, open, onClose])

  useEffect(() => {
    if (!paletteOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!paletteRef.current?.contains(event.target as Node)) setPaletteOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setPaletteOpen(false)
      paletteButtonRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [paletteOpen])

  // Arrow keys, Home and End move between the tools (every tool also stays reachable with Tab).
  const handleToolbarKeyDown = (event: ReactKeyboardEvent< HTMLDivElement >) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

    const buttons = Array.from(event.currentTarget.querySelectorAll< HTMLButtonElement >('button'))
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)

    if (index < 0) return

    event.preventDefault()

    const step = event.key === 'ArrowDown' ? 1 : -1
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + step + buttons.length) % buttons.length

    buttons[next].focus()
  }

  // Phone: a panel that slides in over the canvas, so the hero gets the full width. Tablet up: a fixed rail.
  return (
    <aside
      ref={asideRef}
      aria-label='Canvas tools'
      className={cn(
        'bg-background border-border z-50 flex w-[var(--nx-rail)] flex-col items-center border-r py-3 max-md:fixed max-md:top-[var(--nx-nav)] max-md:bottom-0 max-md:left-0 max-md:overflow-y-auto max-md:shadow-2xl max-md:shadow-black/60 max-md:transition-transform max-md:duration-300 max-md:ease-out sm:py-4 md:relative md:z-40',
        hidden && 'max-md:-translate-x-full'
      )}
    >
      <div
        role='toolbar'
        aria-label='Tools'
        aria-orientation='vertical'
        onKeyDown={handleToolbarKeyDown}
        className='flex flex-col items-center gap-1 sm:gap-1.5'
      >
        {TOOLS.map((item, index) => {
          const active = item.id === tool
          const Icon = item.icon

          return (
            <m.button
              key={item.id}
              type='button'
              aria-pressed={active}
              aria-label={`${item.label} (${item.key})`}
              onClick={() => onTool(item.id)}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.04, ease: EASE }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              className={cn(
                'nx-hit group relative grid size-10 place-items-center rounded-lg',
                FOCUS_RING,
                active ? 'text-[var(--nx-accent-ink)]' : 'text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground'
              )}
            >
              {active && (
                <m.span layoutId={`nx-active-tool-${uid}`} transition={MAGNET} className='absolute inset-0 rounded-lg bg-[var(--nx-accent)]' />
              )}
              <Icon aria-hidden='true' className='relative size-[18px]' strokeWidth={active ? 2.25 : 1.75} />

              <span
                aria-hidden='true'
                className='nx-tip bg-card border-border text-foreground pointer-events-none absolute top-1/2 left-full z-50 ml-3 hidden -translate-y-1/2 items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-xl shadow-black/40 sm:flex'
              >
                {item.label}
                <kbd className='bg-foreground/10 text-foreground/70 rounded px-1 font-sans text-[10px]'>{item.key}</kbd>
              </span>
            </m.button>
          )
        })}
      </div>

      <span aria-hidden='true' className='bg-foreground/10 my-3 h-px w-6' />

      <div ref={paletteRef} className='relative'>
        <button
          ref={paletteButtonRef}
          type='button'
          aria-label='Theme colour'
          aria-expanded={paletteOpen}
          aria-controls={`nx-palette-${uid}`}
          onClick={() => setPaletteOpen(value => !value)}
          className={cn('nx-hit group hover:bg-foreground/[0.06] grid size-10 place-items-center rounded-lg', FOCUS_RING)}
        >
          <span className='size-6 rounded-md bg-[var(--nx-accent)] shadow-[0_0_18px_-2px_var(--nx-accent)] transition-transform duration-200 group-hover:scale-110' />
        </button>

        <AnimatePresence>
          {paletteOpen && (
            <m.div
              id={`nx-palette-${uid}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className='bg-card border-border absolute top-1/2 left-full z-50 ml-3 flex origin-left -translate-y-1/2 items-center gap-3 rounded-xl border py-2 pr-2 pl-3 shadow-2xl shadow-black/50'
            >
              <span className='text-foreground/60 text-[11px] font-medium tracking-[0.12em] uppercase max-sm:hidden'>Fill</span>
              <Swatches />
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type='button'
        aria-label='Reset hero'
        title='Reset hero to default'
        onClick={onReset}
        className={cn('nx-hit group hover:bg-foreground/[0.06] grid size-10 place-items-center rounded-lg', FOCUS_RING)}
      >
        <RotateCcw
          aria-hidden='true'
          className='text-foreground/70 group-hover:text-foreground size-[18px] transition-colors duration-200'
          strokeWidth={1.75}
        />
      </button>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Editable headline                            */
/* -------------------------------------------------------------------------- */

// Where the edit was started from, in px from the title box's top-left corner.
type EditOrigin = { x: number; y: number } | null

/**
 * Typed on one line ("maya design lab"), a name is re-stacked one word per line when the edit ends,
 * so it keeps the poster shape. Empty falls back to what was there before
 */
const tidy = (raw: string, fallback: string, maxLines: number) => {
  let lines = raw
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  if (lines.length === 1) {
    const words = lines[0].split(' ')

    lines = [...words.slice(0, maxLines - 1), words.slice(maxLines - 1).join(' ')].filter(Boolean)
  }

  return lines.length ? lines.join('\n') : fallback
}

// The second word takes the theme colour, whichever line it lands on.
const TitleLines = ({ text }: { text: string }) => {
  let word = 0

  return text.split('\n').map((line, index) => (
    <span key={index} className='block'>
      {line === ''
        ? '​'
        : line.split(/(\s+)/).map((part, i) =>
            part.trim() === '' ? (
              part
            ) : (
              <span key={i} className={word++ === 1 ? 'nx-accent-text' : undefined}>
                {part}
              </span>
            )
          )}
    </span>
  ))
}

// The frame's resize handles, one per corner and one per edge.
const FRAME_CORNERS = ['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'] as const

const FRAME_EDGES = [
  'left-1/2 -top-1 -ml-1',
  'left-1/2 -bottom-1 -ml-1',
  'top-1/2 -left-1 -mt-1',
  'top-1/2 -right-1 -mt-1'
] as const

interface EditableTitleProps {
  headingId: string
  text: string
  onText: (text: string) => void
  editing: boolean
  origin: EditOrigin
  onStart: (origin: EditOrigin) => void
  onDone: () => void
  interactive: boolean
  maxLength: number
  maxLines: number
  boxRef: RefObject< HTMLDivElement | null >
}

const EditableTitle = ({
  headingId,
  text,
  onText,
  editing,
  origin,
  onStart,
  onDone,
  interactive,
  maxLength,
  maxLines,
  boxRef
}: EditableTitleProps) => {
  // States
  const [size, setSize] = useState({ w: 0, h: 0 })

  // Refs
  const titleRef = useRef< HTMLHeadingElement | null >(null)
  const areaRef = useRef< HTMLTextAreaElement | null >(null)
  const before = useRef(text)

  // Hooks
  const { reduce } = useNexa()

  // Vars
  const start = origin ?? { x: size.w / 2, y: size.h / 2 }
  const lineCount = text.split('\n').length

  // Shrink-to-fit: the widest line never runs past the column, so a long name scales
  // down live while it's typed instead of wrapping under the character
  useLayoutEffect(() => {
    const box = boxRef.current
    const title = titleRef.current
    const column = box?.parentElement

    if (!box || !title || !column) return

    let cancelled = false

    const fit = () => {
      box.style.setProperty('--nx-fit', '1')

      // scrollWidth, not the box: the box is already clamped to the column.
      const natural = title.scrollWidth
      const scale = Math.min(1, column.clientWidth / Math.max(natural, 1))

      box.style.setProperty('--nx-fit', String(scale))

      const rect = title.getBoundingClientRect()

      setSize(prev => (prev.w === rect.width && prev.h === rect.height ? prev : { w: rect.width, h: rect.height }))

      if (areaRef.current) areaRef.current.scrollLeft = 0
    }

    fit()

    const observer = new ResizeObserver(fit)

    observer.observe(column)
    document.fonts?.ready.then(() => {
      if (!cancelled) fit()
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [text, boxRef])

  useEffect(() => {
    if (!editing) return

    before.current = text

    const area = areaRef.current

    area?.focus({ preventScroll: true })
    area?.select()
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps -- only on the way in: `text` changes every keystroke and must not re-select

  const handleCommit = useEvent(() => {
    onText(tidy(text, before.current, maxLines).toUpperCase())
    onDone()
  })

  // Ends the edit on a click anywhere else. The swatches and the Done button sit inside the box.
  useEffect(() => {
    if (!editing) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) handleCommit()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [editing, boxRef, handleCommit])

  const handleChange = (event: ChangeEvent< HTMLTextAreaElement >) => {
    onText(event.target.value)
  }

  const handleKeyDown = (event: ReactKeyboardEvent< HTMLTextAreaElement >) => {
    if (event.key === 'Escape' || (event.key === 'Enter' && (event.metaKey || event.ctrlKey))) {
      event.preventDefault()
      handleCommit()
    } else if (event.key === 'Enter' && lineCount >= maxLines) {
      event.preventDefault()
    }
  }

  // Tabbing away ends the edit; moving focus to a swatch or Done does not.
  const handleBlur = (event: FocusEvent< HTMLTextAreaElement >) => {
    if (event.relatedTarget && !boxRef.current?.contains(event.relatedTarget)) handleCommit()
  }

  const handleEditClick = (event: ReactMouseEvent< HTMLButtonElement >) => {
    const rect = boxRef.current?.getBoundingClientRect()

    // A keyboard click has no pointer position (detail 0): start the frame from the middle instead.
    onStart(rect && event.detail > 0 ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : null)
  }

  // Keeps focus in the textarea, so pressing Done doesn't blur the edit first.
  const handleDonePointerDown = (event: ReactPointerEvent< HTMLButtonElement >) => {
    event.preventDefault()
  }

  return (
    <div ref={boxRef} className='group/title relative w-max max-w-full'>
      <m.h1
        id={headingId}
        ref={titleRef}
        aria-label={text.replace(/\n/g, ' ')}
        animate={editing && !reduce ? { scale: [1, 1.012, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className='nx-title nx-display text-foreground origin-left'
      >
        <TitleLines text={text} />
      </m.h1>

      {editing ? (
        <textarea
          ref={areaRef}
          value={text}
          aria-label='Headline'
          spellCheck={false}
          autoComplete='off'
          wrap='off'
          maxLength={maxLength}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className='nx-title nx-title-input nx-display absolute inset-y-0 left-0'
        />
      ) : (
        interactive && (
          <button
            type='button'
            aria-label='Edit headline'
            onClick={handleEditClick}
            className='absolute -inset-3 z-10 cursor-text rounded-sm outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          >
            {/* Figma-style hover: an outline and a tag, nothing moves. */}
            <span className='pointer-events-none absolute inset-0 border border-[var(--nx-accent)]/70 opacity-0 transition-opacity duration-200 group-hover/title:opacity-100 group-has-[:focus-visible]/title:opacity-100' />
            <span className='pointer-events-none absolute -top-6 left-0 rounded-sm bg-[var(--nx-accent)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--nx-accent-ink)] opacity-0 transition-opacity duration-200 group-hover/title:opacity-100 group-has-[:focus-visible]/title:opacity-100'>
              Click to edit
            </span>
          </button>
        )
      )}

      {/* The frame launches from the click and snaps around the text, like a selection pulled onto the nearest object */}
      <AnimatePresence>
        {editing && (
          <m.div
            key='frame'
            initial={
              reduce
                ? { opacity: 0, left: -12, top: -12, width: size.w + 24, height: size.h + 24 }
                : { opacity: 0.4, left: start.x - 10, top: start.y - 10, width: 20, height: 20 }
            }
            animate={{ opacity: 1, left: -12, top: -12, width: size.w + 24, height: size.h + 24 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={MAGNET}
            className='pointer-events-none absolute z-20'
          >
            <span className='absolute inset-0 border border-[var(--nx-accent)]' />
            {FRAME_CORNERS.map(corner => (
              <span key={corner} className={cn('bg-background absolute size-2 border border-[var(--nx-accent)]', corner)} />
            ))}
            {FRAME_EDGES.map(edge => (
              <span key={edge} className={cn('bg-background absolute size-2 border border-[var(--nx-accent)]', edge)} />
            ))}

            <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-sm bg-[var(--nx-accent)] px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-[var(--nx-accent-ink)] tabular-nums'>
              {Math.round(size.w)} × {Math.round(size.h)}
            </span>

            <m.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: reduce ? 0 : 0.12, ease: EASE }}
              className='bg-card border-border pointer-events-auto absolute bottom-full left-0 mb-4 flex w-max max-w-[calc(100cqw-var(--nx-pad)*2)] flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border py-1.5 pr-1.5 pl-3 shadow-2xl shadow-black/50'
            >
              <span className='text-foreground/60 text-[11px] font-medium tracking-[0.12em] whitespace-nowrap uppercase max-sm:hidden'>
                Text fill
              </span>
              <Swatches />
              <span aria-hidden='true' className='bg-foreground/10 h-5 w-px' />
              <button
                type='button'
                onPointerDown={handleDonePointerDown}
                onClick={handleCommit}
                className={cn(
                  'nx-hit flex h-7 items-center gap-1 rounded-md bg-[var(--nx-accent)] px-2.5 text-xs font-semibold text-[var(--nx-accent-ink)]',
                  FOCUS_RING
                )}
              >
                <Check aria-hidden='true' className='size-3.5' strokeWidth={2.5} />
                Done
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Hero                                    */
/* -------------------------------------------------------------------------- */

// A type alias, not an interface: Motion's animate prop needs the implicit index signature.
type Zoom = { x: number; y: number; scale: number }

const rise = (delay: number, reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE }
})

// The headline is the LCP element, so it only slides: fading it from 0 would hold LCP back until hydration
const slide = (reduce: boolean) => ({
  initial: reduce ? false : { y: 18 },
  animate: { y: 0 },
  transition: { duration: 0.7, ease: EASE }
})

const CTA_SIZE =
  'min-[1900px]:!h-[clamp(56px,3.3cqw,76px)] min-[1900px]:!px-[clamp(32px,1.9cqw,44px)] min-[1900px]:!text-[length:clamp(15px,0.85cqw,20px)]'

interface HeroProps {
  headingId: string
  title: string
  description?: string
  disciplines: string[]
  craftLabel?: string
  craftInterval: number
  primaryAction?: NexaAction
  secondaryAction?: NexaAction
  stats: NexaStat[]
  canvasLabel?: string
  greeting?: string
  character?: NexaCharacter
  titleMaxLength: number
  titleMaxLines: number
  maxZoom: number
  showToolbar: boolean
  keyboardShortcuts: boolean
}

const Hero = ({
  headingId,
  title: initialTitle,
  description,
  disciplines,
  craftLabel,
  craftInterval,
  primaryAction,
  secondaryAction,
  stats,
  canvasLabel,
  greeting,
  character,
  titleMaxLength,
  titleMaxLines,
  maxZoom,
  showToolbar,
  keyboardShortcuts
}: HeroProps) => {
  // States
  const [store] = useState(createPointerStore)
  const [tool, setToolState] = useState< ToolId >('select')
  const [title, setTitle] = useState(initialTitle)
  const [editing, setEditing] = useState(false)
  const [origin, setOrigin] = useState< EditOrigin >(null)
  const [texts, setTexts] = useState< TextItem[] >([])
  const [textEditing, setTextEditing] = useState< number | null >(null)
  const [paths, setPaths] = useState< PenPath[] >([])
  const [measure, setMeasure] = useState< { w: number; h: number } | null >(null)
  const [zoom, setZoom] = useState< Zoom | null >(null)
  const [railOpen, setRailOpen] = useState(false)

  // Refs
  const sectionRef = useRef< HTMLElement | null >(null)
  const canvasRef = useRef< HTMLDivElement | null >(null)
  const titleBoxRef = useRef< HTMLDivElement | null >(null)
  const pointerInside = useRef(false)

  // Hooks
  const { reduce, setTheme, defaultThemeId } = useNexa()

  // Vars
  const active = TOOLS.find(item => item.id === tool) ?? TOOLS[0]

  // The greeting over the character follows the headline's first line as it's edited.
  const firstLine = title.split('\n')[0]?.trim() || 'there'
  const name = firstLine.charAt(0).toUpperCase() + firstLine.slice(1).toLowerCase()

  const readout = zoom
    ? `${Math.round(zoom.scale * 100)}% (click or Esc to reset)`
    : measure
      ? `${Math.round(measure.w)} × ${Math.round(measure.h)} px`
      : tool === 'select' && canvasLabel
        ? canvasLabel
        : active.hint

  const setTool = (next: ToolId) => {
    setToolState(next)
    setZoom(null)
    setMeasure(null)

    // Picking the text tool opens the headline for typing, the same as clicking on it.
    if (next === 'text') {
      setOrigin(null)
      setEditing(true)
    }
  }

  const handleStartEdit = (from: EditOrigin) => {
    setToolState('select')
    setZoom(null)
    setOrigin(from)
    setEditing(true)
  }

  // One window listener feeds the grid glow and the character's eyes.
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) =>
      store.set({ x: event.clientX, y: event.clientY, t: event.timeStamp })

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [store])

  // Single-key shortcuts only act while the pointer or keyboard focus is inside the hero, so the host page keeps its keys.
  const handleShortcut = useEvent((event: KeyboardEvent) => {
    const section = sectionRef.current
    const target = event.target as HTMLElement

    if (!showToolbar || !keyboardShortcuts || !section) return
    if (!pointerInside.current && !section.contains(document.activeElement)) return
    if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return

    if (event.key === 'Escape') {
      if (zoom) setZoom(null)
      else setTool('select')

      return
    }

    const match = TOOLS.find(item => item.key.toLowerCase() === event.key.toLowerCase())

    if (match) setTool(match.id)
  })

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const handleEnter = () => {
      pointerInside.current = true
    }

    const handleLeave = () => {
      pointerInside.current = false
    }

    section.addEventListener('pointerenter', handleEnter)
    section.addEventListener('pointerleave', handleLeave)
    window.addEventListener('keydown', handleShortcut)

    return () => {
      section.removeEventListener('pointerenter', handleEnter)
      section.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [handleShortcut])

  // Zoom so the cropped area fills the canvas, without ever showing past the stage's edges.
  const handleCrop = (rect: Rect) => {
    const canvas = canvasRef.current

    if (!canvas) return

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const scale = Math.min(maxZoom, Math.max(1, Math.min(w / rect.w, h / rect.h)))
    const x = Math.min(0, Math.max(w - w * scale, w / 2 - scale * (rect.x + rect.w / 2)))
    const y = Math.min(0, Math.max(h - h * scale, h / 2 - scale * (rect.y + rect.h / 2)))

    setZoom({ x, y, scale })
  }

  const handleReset = () => {
    setTexts([])
    setTextEditing(null)
    setPaths([])
    setTitle(initialTitle)
    setEditing(false)
    setTheme(defaultThemeId)
    setTool('select')
  }

  const handleTool = (next: ToolId) => {
    setTool(next)
    setRailOpen(false)
  }

  const handleRailClose = useCallback(() => setRailOpen(false), [])

  return (
    <section ref={sectionRef} aria-labelledby={headingId} className='nx-hero relative flex'>
      {showToolbar && <Toolbar tool={tool} onTool={handleTool} onReset={handleReset} open={railOpen} onClose={handleRailClose} />}

      {/* Phone: tapping outside the open tool panel closes it. */}
      {showToolbar && railOpen && (
        <button
          type='button'
          aria-label='Close tools'
          onClick={handleRailClose}
          className='bg-background/60 fixed inset-x-0 top-[var(--nx-nav)] bottom-0 z-[45] backdrop-blur-[2px] md:hidden'
        />
      )}

      <div ref={canvasRef} className='nx-canvas relative flex min-w-0 flex-1 flex-col overflow-hidden'>
        <m.div
          initial={false}
          animate={zoom ?? { x: 0, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.85, ease: EASE }}
          style={{ originX: 0, originY: 0 }}
          className='nx-stage relative flex flex-1 flex-col min-[1200px]:absolute min-[1200px]:inset-0'
        >
          <div aria-hidden='true' className='nx-grid absolute inset-0' />
          <div aria-hidden='true' className='nx-room absolute inset-0' />
          <div aria-hidden='true' className='absolute inset-0'>
            <CanvasGrid store={store} />
          </div>

          <div className='nx-content relative z-10 flex flex-col md:min-h-0 md:flex-1'>
            <div className='flex flex-col min-[1200px]:pb-12 md:flex-1 md:justify-center md:max-[1199px]:pb-[180px]'>
              {disciplines.length > 0 && (
                <m.div {...rise(0.3, reduce)} className='mb-5 flex sm:mb-6'>
                  <CraftLabel label={craftLabel} words={disciplines} interval={craftInterval} />
                </m.div>
              )}

              <m.div {...slide(reduce)} className='nx-title-col'>
                <EditableTitle
                  headingId={headingId}
                  text={title}
                  onText={setTitle}
                  editing={editing}
                  origin={origin}
                  onStart={handleStartEdit}
                  onDone={() => setEditing(false)}
                  interactive={showToolbar && (tool === 'select' || tool === 'move')}
                  maxLength={titleMaxLength}
                  maxLines={titleMaxLines}
                  boxRef={titleBoxRef}
                />
              </m.div>

              {description && (
                <m.p
                  {...rise(0.55, reduce)}
                  className='text-foreground/70 mt-6 max-w-[34rem] text-base leading-relaxed min-[1900px]:text-[length:clamp(19px,1.03cqw,26px)] sm:mt-7 sm:text-lg md:max-w-[min(max(34rem,29.5cqw),44cqw)] md:text-base lg:text-[17px] xl:text-[19px]'
                >
                  {description}
                </m.p>
              )}

              {(primaryAction || secondaryAction) && (
                <m.div
                  {...rise(0.65, reduce)}
                  className='mt-8 grid w-full auto-cols-fr gap-3 min-[1200px]:grid-flow-col sm:mt-9 sm:gap-4 sm:max-md:grid-flow-col md:w-fit'
                >
                  {primaryAction && (
                    <a
                      href={primaryAction.href}
                      className={cn(
                        'group flex h-[3.25rem] items-center justify-center gap-2.5 rounded-lg bg-[var(--nx-accent)] px-6 text-[15px] font-semibold whitespace-nowrap text-[var(--nx-accent-ink)] shadow-[0_10px_40px_-12px_var(--nx-accent)] transition-[filter,translate] duration-200 hover:brightness-110 active:translate-y-px sm:h-14 sm:px-8',
                        FOCUS_RING,
                        CTA_SIZE
                      )}
                    >
                      {primaryAction.label}
                      <ArrowRight
                        aria-hidden='true'
                        className='size-[18px] transition-transform duration-300 group-hover:translate-x-1'
                        strokeWidth={2.25}
                      />
                    </a>
                  )}
                  {secondaryAction && (
                    <a
                      href={secondaryAction.href}
                      className={cn(
                        'bg-background/85 hover:bg-card border-foreground/20 text-foreground hover:border-foreground/35 flex h-[3.25rem] items-center justify-center gap-2.5 rounded-lg border px-6 text-[15px] font-semibold whitespace-nowrap backdrop-blur-md transition-colors duration-200 sm:h-14 sm:px-8',
                        FOCUS_RING,
                        CTA_SIZE
                      )}
                    >
                      {secondaryAction.label}
                    </a>
                  )}
                </m.div>
              )}
            </div>
          </div>

          {character && (
            <m.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className='nx-figure'
            >
              <Character
                store={store}
                name={name}
                character={character}
                greeting={greeting}
                className='nx-figure-inner'
                hint={!CAPTURING.includes(tool) && !editing}
              />
              {/* Phone: his cut edge fades into the canvas under the stats cards instead of ending in a hard line. */}
              <div
                aria-hidden='true'
                className='from-background absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent md:hidden'
              />
            </m.div>
          )}
        </m.div>

        {showToolbar && (
          <>
            {/* Tool layers: above the artwork, below the panels. Idle tools let clicks through. */}
            <div className='pointer-events-none absolute inset-0 z-30'>
              <BrushLayer active={tool === 'brush'} />
              <PenLayer active={tool === 'pen'} paths={paths} onPaths={setPaths} />
              <TextLayer
                active={tool === 'text' && !editing}
                items={texts}
                editingId={textEditing}
                onItems={setTexts}
                onEditing={setTextEditing}
              />
              {(tool === 'marquee' || tool === 'crop') && (
                <SelectionLayer
                  key={tool}
                  mode={tool}
                  zoomed={!!zoom}
                  onMeasure={setMeasure}
                  onCrop={handleCrop}
                  onUncrop={() => setZoom(null)}
                />
              )}
            </div>

            <m.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className='pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center gap-3 px-3 pt-3 sm:px-5 sm:pt-4'
            >
              <button
                type='button'
                aria-label={railOpen ? 'Hide tools' : 'Show tools'}
                aria-expanded={railOpen}
                onClick={() => setRailOpen(open => !open)}
                className={cn(
                  'nx-hit bg-background/80 border-border text-foreground pointer-events-auto grid size-8 place-items-center rounded-md border md:hidden',
                  FOCUS_RING
                )}
              >
                {railOpen ? (
                  <PanelLeftClose aria-hidden='true' className='size-4' strokeWidth={1.75} />
                ) : (
                  <PanelLeftOpen aria-hidden='true' className='size-4' strokeWidth={1.75} />
                )}
              </button>
              <span className='bg-background/80 border-border text-foreground flex h-8 items-center gap-2 rounded-md border px-3 text-sm font-medium'>
                {active.label}
                <Navigation2 aria-hidden='true' className='size-3.5 -rotate-45 fill-current' />
              </span>
              <span
                aria-live='polite'
                className='text-foreground/85 hidden truncate text-sm font-medium tabular-nums sm:block lg:text-[15px]'
              >
                {readout}
              </span>
            </m.div>
          </>
        )}

        <StatsRow stats={stats} interactive={!CAPTURING.includes(tool)} />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Nexa                                    */
/* -------------------------------------------------------------------------- */

/**
 * Nexa: the interactive portfolio canvas hero. It is a normal block-level element that fills its container's width;
 * the height follows `viewportHeight` (one screen by default) and the copy, so place it at the top of a page or a frame.
 */
export const Nexa = ({
  brand,
  navLinks = [],
  status,
  title = 'YOUR\nNAME',
  description,
  disciplines = [],
  craftLabel,
  craftInterval = 2400,
  primaryAction,
  secondaryAction,
  stats = [],
  canvasLabel,
  greeting,
  character,
  themes,
  defaultThemeId,
  titleMaxLength = 40,
  titleMaxLines = 4,
  maxZoom = 3.5,
  grid,
  gaze,
  brush,
  figure,
  displayFontFamily = DEFAULT_DISPLAY_FONT,
  bodyFontFamily = DEFAULT_BODY_FONT,
  viewportHeight = '100dvh',
  showToolbar = true,
  keyboardShortcuts = true,
  reducedMotion,
  className,
  style,
  ...rest
}: NexaProps) => {
  // Hooks
  const headingId = useId()
  const systemReduce = useReducedMotion()

  // Vars
  const palette = themes && themes.length > 0 ? themes : DEFAULT_THEMES
  const initialThemeId = palette.find(item => item.id === defaultThemeId)?.id ?? palette[0].id
  const reduce = reducedMotion ?? systemReduce ?? false
  const hasNav = !!(brand || navLinks.length || status)

  // States
  const [themeId, setThemeId] = useState(initialThemeId)

  const theme = palette.find(item => item.id === themeId) ?? palette[0]

  // Merged over the defaults and clamped, so a zero from a slider can never stall the grid or the eye spring.
  const gridOptions = useMemo(() => {
    const merged = { ...DEFAULT_GRID, ...grid }

    return { ...merged, cell: Math.max(8, merged.cell), fade: Math.max(1, merged.fade) }
  }, [grid])

  const gazeOptions = useMemo(() => {
    const merged = { ...DEFAULT_GAZE, ...gaze }

    return { ...merged, lag: Math.max(0.2, merged.lag), distance: Math.max(1, merged.distance) }
  }, [gaze])

  const brushOptions = useMemo(() => {
    const merged = { ...DEFAULT_BRUSH, ...brush }

    return { ...merged, width: Math.max(1, merged.width), life: Math.max(1, merged.life) }
  }, [brush])

  const placement = useMemo(() => ({ ...DEFAULT_FIGURE, ...figure }), [figure])

  const context = useMemo< NexaContextValue >(
    () => ({
      theme,
      themes: palette,
      defaultThemeId: initialThemeId,
      setTheme: setThemeId,
      reduce,
      grid: gridOptions,
      gaze: gazeOptions,
      brush: brushOptions
    }),
    [theme, palette, initialThemeId, reduce, gridOptions, gazeOptions, brushOptions]
  )

  // Dials that CSS reads, handed over as custom properties so breakpoints stay in the stylesheet.
  const vars = {
    '--nx-accent': theme.accent,
    '--nx-accent-ink': theme.ink,
    '--nx-font-display': displayFontFamily,
    '--nx-font-sans': bodyFontFamily,
    '--nx-vh': viewportHeight,
    '--nx-cell': `${gridOptions.cell}px`,
    '--nx-grid-line': `${gridOptions.line * 100}%`,
    '--nx-fig-h': placement.height,
    '--nx-fig-cap': placement.widthCap,
    '--nx-fig-centre': placement.centre,
    '--nx-fig-clear': `${placement.clearance}px`,
    '--nx-tab-cap': placement.tabletCap,
    '--nx-tab-centre': placement.tabletCentre,
    '--nx-tab-clear': `${placement.tabletClearance}px`,
    '--nx-cropped': placement.cropped / 100,
    '--nx-fig-min': `${placement.stackedMin}px`,
    '--nx-fig-max': `${placement.stackedMax}px`
  } as CSSProperties

  return (
    <div
      {...rest}
      data-slot='nexa'
      data-reduced={reduce}
      data-nav={hasNav ? undefined : 'off'}
      style={{ ...vars, ...style }}
      className={cn('bg-background text-foreground w-full overflow-x-clip antialiased', className)}
    >
      <style>{NEXA_CSS}</style>
      <NexaContext.Provider value={context}>
        <LazyMotion features={domMax}>
          {hasNav && <Navbar brand={brand} navLinks={navLinks} status={status} />}
          <Hero
            key={title}
            headingId={headingId}
            title={title}
            description={description}
            disciplines={disciplines}
            craftLabel={craftLabel}
            craftInterval={craftInterval}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            stats={stats}
            canvasLabel={canvasLabel}
            greeting={greeting}
            character={character}
            titleMaxLength={titleMaxLength}
            titleMaxLines={titleMaxLines}
            maxZoom={maxZoom}
            showToolbar={showToolbar}
            keyboardShortcuts={showToolbar && keyboardShortcuts}
          />
        </LazyMotion>
      </NexaContext.Provider>
    </div>
  )
}

export default Nexa