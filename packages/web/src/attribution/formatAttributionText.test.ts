import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatAttributionText } from "./formatAttributionText.js";

describe("formatAttributionText", () => {
  it("joins the texts and drops the links", () => {
    assert.equal(
      formatAttributionText([
        { text: "A", url: "https://a.example/" },
        { text: "B", url: null },
      ]),
      "A | B",
    );
    assert.equal(formatAttributionText([]), "");
  });
});
