import { test } from "node:test";
import assert from "node:assert/strict";
import {
  statusOf,
  isUpcoming,
  canRegister,
  endTime,
  eventOrder,
  displayDate,
  type EventTiming,
} from "../src/lib/events";
const scheduled: EventTiming = {
  status: "scheduled",
  start: "2026-11-20T14:00:00+08:00",
  end: "2026-11-20T17:00:00+08:00",
  registrationOpen: true,
  registrationUrl: "https://forms.gle/example",
};
const now = Date.parse("2026-11-01T00:00:00+08:00");
test("future event has registration; ended event does not", () => {
  assert.equal(statusOf(scheduled, now), "upcoming");
  assert.equal(canRegister(scheduled, now), true);
  assert.equal(
    canRegister(scheduled, Date.parse("2026-11-20T17:00:00.001+08:00")),
    false,
  );
});
test("registration deadline is exclusive and overrides future date", () => {
  const e = { ...scheduled, registrationDeadline: "2026-11-19T12:00:00+08:00" };
  assert.equal(canRegister(e, Date.parse(e.registrationDeadline) - 1), true);
  assert.equal(canRegister(e, Date.parse(e.registrationDeadline)), false);
});
test("date-only event remains upcoming through Malaysia day, not UTC day", () => {
  const e = { ...scheduled, start: "2026-11-20", end: undefined };
  assert.equal(statusOf(e, Date.parse("2026-11-20T15:59:59Z")), "upcoming");
  assert.equal(statusOf(e, Date.parse("2026-11-20T16:00:00Z")), "past");
  assert.equal(endTime("2026-11-20"), Date.parse("2026-11-20T15:59:59.999Z"));
});
test("past, cancelled, TBA and explicitly closed listings never register", () => {
  for (const status of ["past", "cancelled", "tba"] as const)
    assert.equal(canRegister({ ...scheduled, status }, now), false);
  assert.equal(
    canRegister({ ...scheduled, registrationOpen: false }, now),
    false,
  );
  assert.equal(
    canRegister({ ...scheduled, registrationUrl: undefined }, now),
    false,
  );
});
test("events sort future first ascending, then TBA, then newest past", () => {
  const entries = [
    { data: { title: "Old", status: "past" as const, start: "2024-01-01" } },
    { data: { title: "Later", ...scheduled, start: "2027-01-01" } },
    { data: { title: "Recent", status: "past" as const, start: "2025-01-01" } },
    { data: { title: "TBA", status: "tba" as const } },
    { data: { title: "Next", ...scheduled } },
  ];
  entries.sort((a, b) => eventOrder(a, b, now));
  assert.deepEqual(
    entries.map((e) => e.data.title),
    ["Next", "Later", "TBA", "Recent", "Old"],
  );
});
test("dates display consistently in Malaysia", () => {
  assert.match(displayDate("2026-06-26T00:00:00+08:00"), /26 Jun 2026/);
});

test("Upcoming includes undated events without opening registration", () => {
  const undated: EventTiming = { status: "tba" };
  assert.equal(isUpcoming(undated, now), true);
  assert.equal(canRegister(undated, now), false);
  assert.equal(isUpcoming(scheduled, now), true);
  assert.equal(isUpcoming({ status: "past" }, now), false);
  assert.equal(isUpcoming({ status: "cancelled" }, now), false);
});
