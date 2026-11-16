import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, render } from "@testing-library/react";
import { CommercialUse } from "@web-map/core";
import type { BasemapUsage } from "@web-map/core";

import { defaultMapLabels } from "../map/defaultMapLabels.js";
import { UsageNotice } from "./UsageNotice.js";

afterEach(cleanup);

const allowed: BasemapUsage = {
  license: "CC BY 4.0",
  termsUrl: "https://tiles.example/terms",
  commercialUse: CommercialUse.ALLOWED,
  conditions: null,
};

describe("UsageNotice", () => {
  it("is empty when commercial use is allowed", () => {
    const { container } = render(<UsageNotice usage={allowed} labels={defaultMapLabels} />);
    assert.equal(container.textContent, "");
  });

  it("links the terms of a restricted basemap", () => {
    const { container } = render(
      <UsageNotice usage={{ ...allowed, commercialUse: CommercialUse.CONDITIONAL }} labels={defaultMapLabels} />,
    );
    assert.equal(container.querySelector("a")?.getAttribute("href"), allowed.termsUrl);
  });

  it("flags unknown terms as text when there is no page to link", () => {
    const { container } = render(
      <UsageNotice usage={{ ...allowed, termsUrl: null, commercialUse: CommercialUse.UNKNOWN }} labels={defaultMapLabels} />,
    );
    assert.equal(container.textContent, defaultMapLabels.unknownTerms);
    assert.equal(container.querySelector("a"), null);
  });
});
