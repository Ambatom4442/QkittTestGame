import { z } from "zod";

const clueSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1)
}).passthrough();

const deductionSchema = z.object({
  id: z.string().min(1),
  requiredClueIds: z.array(z.string().min(1)).default([]),
  requiredDeductionIds: z.array(z.string().min(1)).default([])
}).passthrough();

const chapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1)
}).passthrough();

const caseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  chapters: z.array(chapterSchema)
}).passthrough();

export function validateCasePayloads({ caseData, cluesData, deductionsData }) {
  const parsedCase = caseSchema.safeParse(caseData);
  const parsedClues = z.array(clueSchema).safeParse(cluesData);
  const parsedDeductions = z.array(deductionSchema).safeParse(deductionsData);

  const errors = [];

  if (!parsedCase.success) {
    errors.push(`case.json: ${parsedCase.error.issues.map((issue) => issue.message).join("; ")}`);
  }

  if (!parsedClues.success) {
    errors.push(`clues.json: ${parsedClues.error.issues.map((issue) => issue.message).join("; ")}`);
  }

  if (!parsedDeductions.success) {
    errors.push(`deductions.json: ${parsedDeductions.error.issues.map((issue) => issue.message).join("; ")}`);
  }

  return {
    caseData: parsedCase.success ? parsedCase.data : null,
    clues: parsedClues.success ? parsedClues.data : [],
    deductions: parsedDeductions.success ? parsedDeductions.data : [],
    errors
  };
}

export function runFairPlaySkeleton({ clues, deductions, targetDeductionId = "D-12" }) {
  const errors = [];
  const warnings = [];

  const target = deductions.find((deduction) => deduction.id === targetDeductionId);
  if (!target) {
    warnings.push(`${targetDeductionId} not found; fair-play skeleton skipped target graph walk.`);
    return { errors, warnings };
  }

  const clueIds = new Set(clues.map((clue) => clue.id));
  const deductionIds = new Set(deductions.map((deduction) => deduction.id));

  for (const clueId of target.requiredClueIds) {
    if (!clueIds.has(clueId)) {
      errors.push(`${targetDeductionId} requires missing clue ${clueId}.`);
    }
  }

  for (const deductionId of target.requiredDeductionIds) {
    if (!deductionIds.has(deductionId)) {
      errors.push(`${targetDeductionId} requires missing deduction ${deductionId}.`);
    }
  }

  if (target.requiredClueIds.length === 0) {
    warnings.push(`${targetDeductionId} has no required clues in skeleton check.`);
  }

  return { errors, warnings };
}
