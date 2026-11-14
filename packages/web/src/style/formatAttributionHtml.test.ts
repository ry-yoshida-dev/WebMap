import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatAttributionHtml } from "./formatAttributionHtml.js";

describe("formatAttributionHtml", () => {
  it("links each attribution and separates them", () => {
    assert.equal(
      formatAttributionHtml([
        { text: "A", url: "https://a.example/" },
        { text: "B", url: "https://b.example/" },
      ]),
      '<a href="https://a.example/" target="_blank" rel="noopener noreferrer">A</a> | ' +
        '<a href="https://b.example/" target="_blank" rel="noopener noreferrer">B</a>',
    );
  });

  it("escapes markup in text and URLs", () => {
    const html: string = formatAttributionHtml([{ text: "<img src=x onerror=alert(1)>", url: 'https://a.example/"onclick="x' }]);
    assert.ok(!html.includes("<img"));
    assert.ok(html.includes("&lt;img"));
    assert.ok(html.includes("&quot;onclick=&quot;x"));
  });
});
