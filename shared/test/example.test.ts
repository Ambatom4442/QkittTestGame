import { describe, expect, it } from "vitest";
import { formatCaseId } from "../src/index.js";

describe("formatCaseId", () => {
  it("normalizes a case id", () => {
    expect(formatCaseId("  Speckled Band  ")).toBe("speckled-band");
  });
});
