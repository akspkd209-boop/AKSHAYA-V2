import test from "node:test";
import assert from "node:assert/strict";
import { cashInHand, closingTotal, creditGivenTotal, creditPaidTotal, dailyCollection, moneyInHand, previousClose, unpaidCreditReport, unfixedAmount } from "./cash.ts";
import type { CashClose } from "./types.ts";

const close: CashClose = {
  date: "2026-11-18",
  notes: { n10: 2, n20: 1, n50: 2, n100: 3, n200: 1, n500: 1 },
  eDistrict: 1000, csc: 500, credits: 700, bank: 2000, fixed: 100,
  creditPaid: [{ name: "Customer A", amount: 300 }],
  creditGiven: [{ employeeId: "staff-1", customer: "Customer B", amount: 900 }],
  countedBy: "Admin", accepted: true,
};

test("cash denomination sum and cash/wallet/bank totals are exact", () => {
  assert.equal(cashInHand(close.notes), 1140);
  assert.equal(moneyInHand(close), 4640);
  assert.equal(closingTotal(close), 5340);
});

test("credit given and paid totals remain separate from cash in hand", () => {
  assert.equal(creditGivenTotal(close), 900);
  assert.equal(creditPaidTotal(close), 300);
  assert.equal(moneyInHand(close), 4640);
});

test("previous closing chooses latest earlier started close only", () => {
  const older = { ...close, date: "2026-11-16" };
  const later = { ...close, date: "2026-11-17", notes: { ...close.notes, n500: 0 } };
  assert.equal(previousClose([older, later], "2026-11-18")?.date, "2026-11-17");
});

test("fixed amount reduces the outstanding difference without changing its sign", () => {
  assert.equal(unfixedAmount(500, 200), 300);
  assert.equal(unfixedAmount(-500, 200), -300);
  assert.equal(unfixedAmount(500, 900), 0);
});


test("daily collection reads a recorded daily row but ignores a month-total row", () => {
  const days = [
    { date: "2026-11-18", amount: 1800, note: "Entered on the counter", splits: {} },
    { date: "2026-11-30", amount: 22000, note: "Centre sheet month total", splits: {} },
  ];
  assert.equal(dailyCollection(days, "2026-11-18"), 1800);
  assert.equal(dailyCollection(days, "2026-11-30"), null);
});

test("customer credit report applies named repayments to outstanding balances", () => {
  const base = { ...close, notes: { n10: 0, n20: 0, n50: 0, n100: 0, n200: 0, n500: 0 }, eDistrict: 0, csc: 0, bank: 0, fixed: 0, accepted: true };
  const first = { ...base, date: "2026-11-16", credits: 600, creditGiven: [{ employeeId: "staff-1", customer: "Customer B", amount: 600 }], creditPaid: [] };
  const second = { ...base, date: "2026-11-17", credits: 400, creditGiven: [], creditPaid: [{ name: "Customer B", amount: 200 }] };
  const report = unpaidCreditReport([first, second], () => "Operator");
  assert.equal(report.listed, 400);
  assert.equal(report.book, 400);
  assert.equal(report.lines[0]?.balance, 400);
  assert.equal(report.lines[0]?.paid, 200);
});
