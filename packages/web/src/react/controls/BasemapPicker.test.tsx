import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { Basemap } from "@web-map/core";

import { BasemapPicker } from "./BasemapPicker.js";
import { defaultMapLabels } from "../map/defaultMapLabels.js";
import { sampleRasterBasemaps } from "../testing/sampleBasemaps.js";

afterEach(cleanup);

const { first, second, third } = sampleRasterBasemaps;
const basemaps: readonly Basemap[] = [first, second, third];

function renderPicker(onChange: (basemap: Basemap) => void = () => undefined): HTMLElement {
  render(<BasemapPicker basemaps={basemaps} basemap={first} onChange={onChange} labels={defaultMapLabels} />);
  const trigger: HTMLElement = screen.getByRole("button", { expanded: false });
  fireEvent.click(trigger);
  return trigger;
}

describe("BasemapPicker", () => {
  it("opens a listbox with the chosen basemap selected and focused", () => {
    const trigger: HTMLElement = renderPicker();
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    const selected: HTMLElement = screen.getByRole("option", { selected: true });
    assert.equal(selected.textContent, first.title);
    assert.equal(document.activeElement, selected);
  });

  it("moves focus with the arrow, Home and End keys, staying within the options", () => {
    renderPicker();
    const listbox: HTMLElement = screen.getByRole("listbox");
    const options: readonly HTMLElement[] = screen.getAllByRole("option");
    fireEvent.keyDown(listbox, { key: "ArrowRight" });
    assert.equal(document.activeElement, options[1]);
    fireEvent.keyDown(listbox, { key: "End" });
    assert.equal(document.activeElement, options[2]);
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    assert.equal(document.activeElement, options[2]);
    fireEvent.keyDown(listbox, { key: "Home" });
    assert.equal(document.activeElement, options[0]);
    fireEvent.keyDown(listbox, { key: "ArrowLeft" });
    assert.equal(document.activeElement, options[0]);
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const trigger: HTMLElement = renderPicker();
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
    assert.equal(screen.queryByRole("listbox"), null);
    assert.equal(document.activeElement, trigger);
  });

  it("reports another basemap when chosen, and nothing when the shown one is chosen again", () => {
    const chosen: Basemap[] = [];
    const trigger: HTMLElement = renderPicker((basemap: Basemap) => chosen.push(basemap));
    fireEvent.click(screen.getByRole("option", { name: new RegExp(second.title) }));
    assert.deepEqual(chosen, [second]);
    assert.equal(screen.queryByRole("listbox"), null);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { selected: true }));
    assert.deepEqual(chosen, [second]);
  });

  it("closes when the pointer goes down outside it", () => {
    renderPicker();
    fireEvent.pointerDown(document.body);
    assert.equal(screen.queryByRole("listbox"), null);
  });
});
