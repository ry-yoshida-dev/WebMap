"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, ReactElement } from "react";
import type { Basemap } from "@web-map/core";

import { BasemapOption } from "./BasemapOption.js";
import type { BasemapPickerProps } from "./BasemapPickerProps.js";
import { Icon } from "../icons/Icon.js";
import { IconName } from "../icons/IconName.js";
import type { Thumbnail } from "../../thumbnail/Thumbnail.js";
import { useBasemapThumbnails } from "../hooks/useBasemapThumbnails.js";
import { DEFAULT_THUMBNAIL_CENTER } from "../../thumbnail/thumbnailView.js";

/** Room kept between the panel and the edge of the map. */
const PANEL_MARGIN: number = 8;

/** Side of the button the panel opens on, and the height it may take there. */
interface PanelPlacement {
  readonly isBelow: boolean;
  readonly maxHeight: number;
}

function placePanel(picker: HTMLElement, map: Element): PanelPlacement {
  const pickerBox: DOMRect = picker.getBoundingClientRect();
  const mapBox: DOMRect = map.getBoundingClientRect();
  const above: number = pickerBox.top - mapBox.top - PANEL_MARGIN;
  const below: number = mapBox.bottom - pickerBox.bottom - PANEL_MARGIN;
  return below > above ? { isBelow: true, maxHeight: below } : { isBelow: false, maxHeight: above };
}

function countColumns(list: HTMLElement): number {
  return Math.max(1, getComputedStyle(list).gridTemplateColumns.split(" ").length);
}

/**
 * Button naming the basemap on screen, opening a panel of thumbnails to choose
 * another, above or below the button, whichever side of the map has more room. Arrow keys move between thumbnails, Enter chooses,
 * and Escape, a click outside or tabbing away closes the panel.
 *
 * @param props - Basemaps, the one on screen, the change handler, labels and where thumbnails are centered.
 * @returns The button and, while open, the panel.
 * @throws RangeError When the thumbnail center is outside Web Mercator.
 */
export function BasemapPicker({ basemaps, basemap, onChange, labels, thumbnailCenter }: BasemapPickerProps): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasOpened, setHasOpened] = useState<boolean>(false);
  const [panelPlacement, setPanelPlacement] = useState<PanelPlacement | null>(null);
  const rootRef: { current: HTMLDivElement | null } = useRef(null);
  const triggerRef: { current: HTMLButtonElement | null } = useRef(null);
  const listId: string = useId();
  const thumbnailOf: (basemap: Basemap) => Thumbnail = useBasemapThumbnails(
    basemaps,
    hasOpened,
    thumbnailCenter ?? DEFAULT_THUMBNAIL_CENTER,
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const onPointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target) !== true) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const open = (): void => {
    const root: HTMLDivElement | null = rootRef.current;
    const map: Element | null = root?.closest(".wmap-root") ?? null;
    setPanelPlacement(root !== null && map !== null ? placePanel(root, map) : null);
    setHasOpened(true);
    setIsOpen(true);
  };
  const close = (): void => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };
  const choose = (next: Basemap): void => {
    if (next.id !== basemap.id) {
      onChange(next);
    }
    close();
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const options: readonly HTMLElement[] = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[role=option]"));
    const index: number = options.findIndex((option: HTMLElement) => option === document.activeElement);
    const columns: number = countColumns(event.currentTarget);
    const steps: Readonly<Record<string, number>> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
      Home: -options.length,
      End: options.length,
    };
    const step: number | undefined = steps[event.key];
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (step !== undefined) {
      event.preventDefault();
      options[Math.min(options.length - 1, Math.max(0, index + step))]?.focus();
    }
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    // Focus leaving for another element, as with Tab; clicks outside are handled on pointerdown.
    if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="wmap-picker" ref={rootRef} onBlur={handleBlur}>
      <button
        type="button"
        className="wmap-picker-trigger"
        ref={triggerRef}
        aria-label={`${labels.basemap}: ${basemap.title}`}
        title={labels.basemap}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
      >
        <Icon name={IconName.FOLDED_MAP} />
        <span className="wmap-picker-title">{basemap.title}</span>
        <Icon name={IconName.CHEVRON_UP} size={16} rotation={isOpen ? 0 : 180} />
      </button>
      {isOpen ? (
        <div
          id={listId}
          className="wmap-picker-panel"
          role="listbox"
          aria-label={labels.basemap}
          data-below={panelPlacement?.isBelow === true ? "true" : undefined}
          style={panelPlacement === null ? undefined : { maxHeight: panelPlacement.maxHeight }}
          onKeyDown={handleListKeyDown}
        >
          {basemaps.map((candidate: Basemap) => (
            <BasemapOption
              key={candidate.id}
              basemap={candidate}
              thumbnail={thumbnailOf(candidate)}
              isSelected={candidate.id === basemap.id}
              onChoose={choose}
              labels={labels}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
