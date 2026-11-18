import test from "node:test";
import assert from "node:assert/strict";
import { dayOn, employeeSplitSum, monthCollection, payFor, recordedAttendance } from "./calc.ts";
import type { CollectionDay, Employee, LeaveMark } from "./types.ts";

const daily: CollectionDay[] = [
  { date: "2026-11-02", amount: 1200, note: "Entered on the counter", splits: { a: 700, b: 500 } },
  { date: "2026-11-03", amount: 800, note: "Entered on the counter", splits: { a: 800 } },
  // Legacy history remains available; v2 does not provide an import action.
  { date: "2026-11-04", amount: 600, note: "Imported from aewskerala. Historical record", splits: { b: 600 } },
  { date: "2026-11-30", amount: 2600, note: "Centre sheet month total", splits: {} },
];

test("manual daily collection rows take precedence over a monthly summary", () => {
  assert.equal(monthCollection(daily, "2026-11"), 2600);
  assert.equal(dayOn(daily, "2026-11-02")?.amount, 1200);
  assert.equal(dayOn(daily, "2026-11-30"), null);
});

test("staff collection totals use one selected row per date", () => {
  assert.equal(employeeSplitSum(daily, "a", "2026-11"), 1500);
  assert.equal(employeeSplitSum(daily, "b", "2026-11"), 1100);
});

test("salary preserves prorated basic, 30-day LWP deduction and incentive rules", () => {
  const employee: Employee = { id: "a", name: "A", role: "Operator", basic: 15000, incentive: 3000, active: true };
  const result = payFor(employee, 100000, 2, 26, 13, true);
  assert.equal(result.basicPayable, 6500); // 7,500 prorated - (2 × 15,000 / 30)
  assert.equal(result.incentive, 1500);
  assert.equal(result.gross, 8000);
  assert.equal(result.lwpDays, 2);
});

test("recorded attendance counts only days with a daily record and applies half-day weight", () => {
  const leaves: LeaveMark[] = [
    { employeeId: "a", date: "2026-11-02", code: "HD" },
    { employeeId: "a", date: "2026-11-03", code: "LWP" },
  ];
  const result = recordedAttendance(daily, leaves, "a", "2026-11", []);
  assert.equal(result.working, 3);
  assert.equal(result.present, 1.5);
  assert.equal(result.tally.HD, 1);
  assert.equal(result.tally.LWP, 1);
});
