"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { removeJSON, saveRaw } from "@/lib/session";
import {
  DroppedFile,
  MAX_FILES,
  SkippedFile,
  firstMeaningfulLine,
  formatSize,
  intake,
  loadDropped,
  noteFor,
  release,
  saveDropped,
} from "@/lib/dropfiles";

/**
 * The front door for files.
 *
 * There used to be a grey line of text here reading "Or drag your own photos
 * anywhere here", and it did the job of nothing. Two things about this tool
 * are worth knowing in the first second: it takes your stuff, and your stuff
 * stays on your machine. Both are now visible without hovering, without
 * scrolling and without a mouse.
 *
 * It stays smaller than the idea input on purpose. The idea is still the main
 * event, this is the thing sitting next to it saying bring your files too.
 */

const ICONS: Record<string, string> = { image: "palette", text: "pencil", opaque: "box" };

type Props = {
  /** True once somebody is inside an idea. Controls whether we offer one. */
  hasIdea: boolean;
  /** The tighter version, for when the entry has already been passed. */
  compact?: boolean;
  /** Lets the page hand us files dropped anywhere, not just on this panel. */
  addRef?: React.MutableRefObject<((f: FileList | File[]) => void) | null>;
  /** New photos, plus how many are in the list now. The page paints with them. */
  onImages?: (added: string[], total: number) => void;
  /** They said yes to the first line of a text file. */
  onIdea?: (line: string) => void;
  /** A write came back false. The save note has to stop claiming otherwise. */
  onStorageIssue?: (failed: boolean) => void;
};

export default function DropZone({ hasIdea, compact, addRef, onImages, onIdea, onStorageIssue }: Props) {
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [skipped, setSkipped] = useState<SkippedFile[]>([]);
  const [suggest, setSuggest] = useState("");
  const [reading, setReading] = useState(false);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  /* The list the add handler reads. The handler is handed up to the page
     through a ref, so it outlives any one render and cannot use state. */
  const filesRef = useRef<DroppedFile[]>([]);
  /* dragenter and dragleave both fire when the pointer crosses a child, so a
     plain boolean flickers the whole panel. Counting is what stops it. */
  const depth = useRef(0);

  const put = (next: DroppedFile[]) => {
    filesRef.current = next;
    setFiles(next);
    // Only ever raise it. A quota that filled once is still full, and a later
    // small write that happens to fit is not proof the work is safe.
    if (!saveDropped(next)) onStorageIssue?.(true);
  };

  useEffect(() => {
    const back = loadDropped();
    if (back.length) {
      filesRef.current = back;
      setFiles(back);
    }
    // Everything borrowed goes back when this leaves, even on a hard route change.
    return () => {
      filesRef.current.forEach(release);
    };
  }, []);

  const add = async (list: FileList | File[]) => {
    if (!list || (Array.isArray(list) ? list.length : list.length) === 0) return;
    setReading(true);
    const result = await intake(list, filesRef.current);
    setReading(false);
    setSkipped(result.skipped);
    if (!result.added.length) return;

    // Newest first, so what somebody just dropped is the thing they see.
    const next = [...result.added, ...filesRef.current];
    put(next);

    const images = result.added.filter((f) => f.kind === "image" && f.dataURL).map((f) => f.dataURL as string);
    if (images.length) {
      onImages?.(images, next.filter((f) => f.kind === "image").length);
    }
    if (!hasIdea) {
      const line = result.added.map((f) => (f.text ? firstMeaningfulLine(f.text) : "")).find(Boolean);
      if (line) setSuggest(line);
    }
  };

  // The page hands us whatever lands anywhere on the entry, not only here.
  useEffect(() => {
    if (!addRef) return;
    addRef.current = add;
    return () => {
      addRef.current = null;
    };
  });

  const remove = (id: string) => {
    const gone = filesRef.current.find((f) => f.id === id);
    if (gone) release(gone); // whatever it held goes back to the browser first
    const next = filesRef.current.filter((f) => f.id !== id);
    put(next);
    if (gone?.kind === "image") {
      onImages?.([], next.filter((f) => f.kind === "image").length);
    }
  };

  const drop = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      depth.current += 1;
      setOver(true);
    },
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDragLeave: () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setOver(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      // The whole entry is a drop target too. Without this the same files land
      // twice, once here and once on the page behind.
      e.stopPropagation();
      depth.current = 0;
      setOver(false);
      if (e.dataTransfer?.files?.length) add(e.dataTransfer.files);
    },
  };

  return (
    <div
      {...drop}
      className={`panel ${compact ? "p-4" : "p-5"} max-w-xl transition-colors ${
        over ? "border-accent" : ""
      }`}
      style={over ? { outline: "2px solid #5B8CFF", outlineOffset: "4px" } : undefined}
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5">
          <Icon name="download" size={20} color="#5B8CFF" />
        </span>
        <div className="min-w-0">
          <p className="label mb-1" style={{ color: "#2DD4BF" }}>{over ? "Let go" : "Your files, optional"}</p>
          <p className="text-sm text-ink-soft font-light leading-relaxed">
            {over
              ? "Drop them here."
              : "Drag files in or choose them. Photos give you a palette. Text files feed your brief. Everything is read on this device and nothing is uploaded."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost text-xs">
          Choose files
        </button>
        <span className="text-[11px] text-ink-mute">
          Up to {MAX_FILES}. Photos, txt, md, csv, json. PDFs and Word land here by name.
        </span>
      </div>

      {/* sr-only, not hidden: the input stays in the page for keyboards and
          screen readers while the button carries the look. */}
      <input
        ref={inputRef}
        type="file"
        multiple
        aria-label="Choose files from this device"
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) add(e.target.files);
          // Reset so choosing the same file twice in a row still fires.
          e.target.value = "";
        }}
      />

      <p aria-live="polite" className="sr-only">
        {reading ? "Reading your files on this device." : ""}
      </p>

      {reading && <p className="text-[11px] text-ink-mute mt-3">Reading them here on your device.</p>}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => (
            <li key={f.id} className="surface flex items-start gap-3 p-3">
              <span className="shrink-0 mt-0.5">
                <Icon name={ICONS[f.kind]} size={20} color="#5B8CFF" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink truncate">
                  {f.name}
                  {f.size > 0 && <span className="text-ink-mute"> · {formatSize(f.size)}</span>}
                </p>
                <p className="text-[11px] text-ink-mute mt-1 leading-relaxed">{noteFor(f)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(f.id)}
                aria-label={`Remove ${f.name}`}
                className="text-[11px] text-ink-soft border border-rule px-2 py-1 hover:text-ink hover:border-accent transition-colors shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Never a silent skip. Every file that did not make it says why. */}
      {skipped.length > 0 && (
        <div aria-live="polite" className="mt-3 space-y-1">
          {skipped.slice(0, 4).map((s, i) => (
            <p key={`${s.name}${i}`} className="text-[11px] text-[#FBBF24]">
              {s.name} was skipped, {s.why}.
            </p>
          ))}
          {skipped.length > 4 && (
            <p className="text-[11px] text-[#FBBF24]">
              And {skipped.length - 4} more, for the same reasons.
            </p>
          )}
        </div>
      )}

      {suggest && !hasIdea && (
        <div className="mt-4 border-t border-rule pt-3">
          <p className="text-[11px] text-ink-mute mb-2">First line of that file:</p>
          <p className="text-sm text-ink font-light leading-relaxed">{suggest}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                onIdea?.(suggest);
                setSuggest("");
              }}
              className="btn-primary shine text-xs"
            >
              Use this as my idea
            </button>
            <button type="button" onClick={() => setSuggest("")} className="btn-ghost text-xs">
              No, I will type it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- the save note */

const PROBE = "flowzone.probe.v1";

/**
 * The quiet permanent line that says where the work lives.
 *
 * It is a report, not a promise. On mount it writes one byte and deletes it,
 * which is the only way to know whether this browser will let us save at all:
 * a locked down Safari or a private window throws on the first setItem. And
 * `failed` comes from a real write that came back false, so a full quota turns
 * this from reassurance into a warning instead of a lie.
 */
export function SaveNote({ failed = false }: { failed?: boolean }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const wrote = saveRaw(PROBE, "1");
    if (wrote) removeJSON(PROBE);
    setOk(wrote);
  }, []);

  const bad = ok === false || failed;
  const colour = bad ? "#FBBF24" : "#5B8CFF";

  let line: string;
  if (ok === null) line = "Checking whether this browser lets us save.";
  else if (ok === false)
    line = "This browser is blocking storage, so nothing can be saved here. Your work stays on screen until you reload.";
  else if (failed)
    line = "The last save did not stick, storage is full. Your work is still on screen but a reload will lose it.";
  else line = "Saved on this device as you go. Nothing uploads. Nothing leaves this browser.";

  return (
    <div className="flex items-start gap-3 mt-4 max-w-xl">
      <span className="shrink-0 mt-0.5">
        <Icon name={bad ? "shield" : "disk"} size={20} color={colour} />
      </span>
      <p className="text-[12px] font-light leading-relaxed" style={{ color: bad ? "#FBBF24" : "#ABB8CF" }}>
        {line}
      </p>
    </div>
  );
}
