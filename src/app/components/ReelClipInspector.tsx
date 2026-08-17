"use client";
import Icon from "@/components/Icon";
import {
  Clip,
  Overlay,
  POSITIONS,
  Pos,
  clampNum,
  defaultOverlay,
  fmtSecs,
} from "@/lib/reel";

/**
 * The panel for one clip.
 *
 * Everything on it is a control you can hit with a thumb, because the person
 * editing is standing up holding a phone, not sitting at a desk with a mouse.
 * It only ever reports a patch upwards, it owns no state of its own, so undo
 * and reorder stay simple in the parent.
 */

const TEXT_COLOURS = ["#F1F3F7", "#FFFFFF", "#0C1424", "#5B8CFF", "#C6E4F8", "#FBBF24"];
const BG_COLOURS = ["#0C1424", "#101A2E", "#000000", "#FFFFFF", "#1E3A8A", "#5B8CFF"];
const POS_LABEL: Record<Pos, string> = {
  tl: "Top left",
  tc: "Top centre",
  tr: "Top right",
  ml: "Middle left",
  mc: "Middle",
  mr: "Middle right",
  bl: "Bottom left",
  bc: "Bottom centre",
  br: "Bottom right",
};

function Head({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon name={icon} size={22} color="#5B8CFF" />
      <span className="label">{children}</span>
    </div>
  );
}

function Swatches({
  value,
  onPick,
  colours,
  name,
}: {
  value: string;
  onPick: (c: string) => void;
  colours: string[];
  name: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {colours.map((col) => (
        <button
          key={col}
          type="button"
          onClick={() => onPick(col)}
          aria-label={`${name} ${col}`}
          aria-pressed={value.toLowerCase() === col.toLowerCase()}
          className={`h-9 w-9 rounded-[11px] border transition-colors ${
            value.toLowerCase() === col.toLowerCase() ? "border-accent" : "border-white/25"
          }`}
          style={{ background: col }}
        />
      ))}
      <label className="sr-only" htmlFor={`${name}-custom`}>
        {name} custom colour
      </label>
      <input
        id={`${name}-custom`}
        type="color"
        value={value}
        onChange={(e) => onPick(e.target.value)}
        className="h-9 w-12 bg-transparent border border-white/25 cursor-pointer p-0"
      />
    </div>
  );
}

function Toggle({
  on,
  onChange,
  children,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={`min-h-[44px] px-4 text-sm rounded-[11px] border transition-colors ${
        on
          ? "border-accent text-ink bg-accent/15"
          : "border-white/22 text-ink-soft hover:text-ink hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

function Pill({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-[44px] px-4 text-sm rounded-[11px] border transition-colors ${
        on
          ? "border-accent text-ink bg-accent/15"
          : "border-white/22 text-ink-soft hover:text-ink hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

export default function ReelClipInspector({
  clip,
  index,
  count,
  onPatch,
  onMove,
  onDuplicate,
  onDelete,
}: {
  clip: Clip;
  index: number;
  count: number;
  onPatch: (patch: Partial<Clip>) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const isVideo = clip.kind === "video";
  const o: Overlay = clip.text ?? defaultOverlay("");

  const patchText = (p: Partial<Overlay>) => onPatch({ text: { ...o, ...p } });

  return (
    <div className="panel p-4 sm:p-5 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name={isVideo ? "clapper" : clip.kind === "image" ? "eye" : "sparkle"} size={22} color="#5B8CFF" />
          <p className="text-sm text-ink truncate max-w-[200px] sm:max-w-[320px]">
            {index + 1}. {clip.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="btn-ghost !px-3 !py-2 !min-h-[44px] text-xs disabled:opacity-40"
            aria-label="Move this clip earlier"
          >
            <span className="arrow">←</span> Earlier
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === count - 1}
            className="btn-ghost !px-3 !py-2 !min-h-[44px] text-xs disabled:opacity-40"
            aria-label="Move this clip later"
          >
            Later <span className="arrow">→</span>
          </button>
          <button type="button" onClick={onDuplicate} className="btn-ghost !px-3 !py-2 !min-h-[44px] text-xs">
            Duplicate
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost !px-3 !py-2 !min-h-[44px] text-xs hover:!border-red-400/70"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Timing. Video gets in and out points, a still gets a length. */}
      <div className="surface p-4">
        <Head icon="scissors">{isVideo ? "Trim" : "How long it holds"}</Head>
        {isVideo ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-ink-soft mb-1">
                <span>Starts at</span>
                <span className="text-ink">{clip.inS.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, clip.mediaDur)}
                step={0.05}
                value={clip.inS}
                aria-label="Trim in point"
                onChange={(e) => {
                  const v = clampNum(parseFloat(e.target.value), 0, clip.mediaDur - 0.3);
                  onPatch({ inS: v, outS: Math.max(v + 0.3, clip.outS) });
                }}
                className="w-full h-11 accent-[#5B8CFF] bg-transparent"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-ink-soft mb-1">
                <span>Ends at</span>
                <span className="text-ink">{clip.outS.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, clip.mediaDur)}
                step={0.05}
                value={clip.outS}
                aria-label="Trim out point"
                onChange={(e) => {
                  const v = clampNum(parseFloat(e.target.value), 0.3, clip.mediaDur);
                  onPatch({ outS: v, inS: Math.min(v - 0.3, clip.inS) });
                }}
                className="w-full h-11 accent-[#5B8CFF] bg-transparent"
              />
            </div>
            <p className="text-xs text-ink-mute">
              Keeping {fmtSecs((clip.outS - clip.inS) * 1000)} out of {clip.mediaDur.toFixed(1)}s.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-xs text-ink-soft mb-1">
              <span>Length</span>
              <span className="text-ink">{fmtSecs(clip.stillMs)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={12000}
              step={100}
              value={clip.stillMs}
              aria-label="How long this still holds"
              onChange={(e) => onPatch({ stillMs: parseInt(e.target.value, 10) })}
              className="w-full h-11 accent-[#5B8CFF] bg-transparent"
            />
          </div>
        )}
      </div>

      {/* Framing */}
      <div className="surface p-4 mt-3">
        <Head icon="palette">Framing</Head>
        <div className="flex flex-wrap gap-2 mb-3">
          <Pill on={clip.fit === "cover"} onClick={() => onPatch({ fit: "cover" })}>
            Fill the frame
          </Pill>
          <Pill on={clip.fit === "contain"} onClick={() => onPatch({ fit: "contain" })}>
            Fit it all in
          </Pill>
          <Toggle on={clip.zoom} onChange={(v) => onPatch({ zoom: v })}>
            Slow zoom
          </Toggle>
          {clip.kind === "video" && (
            <Toggle on={clip.muted} onChange={(v) => onPatch({ muted: v })}>
              {clip.muted ? "Sound off" : "Sound on"}
            </Toggle>
          )}
        </div>
        {clip.fit === "contain" && (
          <div>
            <p className="text-xs text-ink-soft mb-2">Colour behind it</p>
            <Swatches value={clip.bg} onPick={(v) => onPatch({ bg: v })} colours={BG_COLOURS} name="Background" />
          </div>
        )}
        {clip.kind === "image" && !clip.zoom && (
          <p className="text-xs text-ink-mute mt-2">
            A still that never moves dies on the feed. Turn the slow zoom on.
          </p>
        )}
      </div>

      {/* Words */}
      <div className="surface p-4 mt-3">
        <Head icon="pencil">Words on screen</Head>
        <input
          value={o.text}
          onChange={(e) => patchText({ text: e.target.value })}
          placeholder="Say the thing"
          aria-label="Text on this clip"
          className="w-full bg-paper-deep/80 text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
        />
        {o.text.trim().length > 0 && (
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-ink-soft mb-1">
                <span>Size</span>
                <span className="text-ink">{o.size.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={2.5}
                max={16}
                step={0.25}
                value={o.size}
                aria-label="Text size"
                onChange={(e) => patchText({ size: parseFloat(e.target.value) })}
                className="w-full h-11 accent-[#5B8CFF] bg-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[300, 500, 600, 700].map((w) => (
                <Pill key={w} on={o.weight === w} onClick={() => patchText({ weight: w })}>
                  {w === 300 ? "Light" : w === 500 ? "Regular" : w === 600 ? "Bold" : "Heavy"}
                </Pill>
              ))}
            </div>
            <div>
              <p className="text-xs text-ink-soft mb-2">Colour</p>
              <Swatches value={o.color} onPick={(v) => patchText({ color: v })} colours={TEXT_COLOURS} name="Text" />
            </div>
            <div>
              <p className="text-xs text-ink-soft mb-2">Where it sits</p>
              <div className="grid grid-cols-3 gap-2 max-w-[190px]">
                {POSITIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => patchText({ pos: p })}
                    aria-label={POS_LABEL[p]}
                    aria-pressed={o.pos === p}
                    className={`h-11 rounded-[11px] border transition-colors ${
                      o.pos === p ? "border-accent bg-accent/20" : "border-white/22 hover:border-accent"
                    }`}
                  >
                    <span className="block h-1.5 w-1.5 rounded-full bg-accent-pale mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <Toggle on={o.plate} onChange={(v) => patchText({ plate: v })}>
              {o.plate ? "On a plate" : "No plate"}
            </Toggle>
            <p className="text-xs text-ink-mute">
              The plate is a solid block behind the words. Turn it on when the footage is busy and the
              text starts fighting for its life.
            </p>
          </div>
        )}
      </div>

      {/* Transition in */}
      <div className="surface p-4 mt-3">
        <Head icon="puzzle">How it arrives</Head>
        {index === 0 ? (
          <p className="text-xs text-ink-mute">
            First clip, so there is nothing to come from. Move it later to give it a transition.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Pill on={clip.trans === "cut"} onClick={() => onPatch({ trans: "cut" })}>
                Cut
              </Pill>
              <Pill on={clip.trans === "crossfade"} onClick={() => onPatch({ trans: "crossfade" })}>
                Crossfade
              </Pill>
              <Pill on={clip.trans === "dip"} onClick={() => onPatch({ trans: "dip" })}>
                Dip to colour
              </Pill>
            </div>
            {clip.trans !== "cut" && (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-ink-soft mb-1">
                    <span>How long it takes</span>
                    <span className="text-ink">{fmtSecs(clip.transMs)}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={50}
                    value={clip.transMs}
                    aria-label="Transition length"
                    onChange={(e) => onPatch({ transMs: parseInt(e.target.value, 10) })}
                    className="w-full h-11 accent-[#5B8CFF] bg-transparent"
                  />
                </div>
                {clip.trans === "dip" && (
                  <div>
                    <p className="text-xs text-ink-soft mb-2">Dip through</p>
                    <Swatches
                      value={clip.dipColor}
                      onPick={(v) => onPatch({ dipColor: v })}
                      colours={BG_COLOURS}
                      name="Dip"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
