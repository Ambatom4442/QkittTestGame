import { describe, expect, it } from "vitest";
import { runFairPlaySkeleton, validateCasePayloads } from "../../content-tools/validate-content.mjs";

describe("fair-play", () => {
  it("validates a minimal content payload and passes fair-play skeleton checks", () => {
    const parsed = validateCasePayloads({
      caseData: {
        id: "speckled-band",
        title: "The Speckled Band",
        version: "0.1.0",
        chapters: [{ id: "C-01", title: "Arrival" }]
      },
      cluesData: [
        { id: "E-01", title: "Clue 1", text: "First clue" },
        { id: "E-02", title: "Clue 2", text: "Second clue" }
      ],
      deductionsData: [
        { id: "D-12", requiredClueIds: ["E-01", "E-02"], requiredDeductionIds: [] }
      ]
    });

    expect(parsed.errors).toEqual([]);

    const result = runFairPlaySkeleton({ clues: parsed.clues, deductions: parsed.deductions });
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("fails fair-play skeleton checks when D-12 depends on missing clues", () => {
    const parsed = validateCasePayloads({
      caseData: {
        id: "speckled-band",
        title: "The Speckled Band",
        version: "0.1.0",
        chapters: [{ id: "C-01", title: "Arrival" }]
      },
      cluesData: [{ id: "E-01", title: "Clue 1", text: "First clue" }],
      deductionsData: [
        { id: "D-12", requiredClueIds: ["E-01", "E-99"], requiredDeductionIds: [] }
      ]
    });

    const result = runFairPlaySkeleton({ clues: parsed.clues, deductions: parsed.deductions });
    expect(result.errors).toContain("D-12 requires missing clue E-99.");
  });
});
