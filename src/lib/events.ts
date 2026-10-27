export type EventState = "scheduled" | "tba" | "past" | "cancelled";
export interface EventTiming {
  status: EventState;
  start?: string;
  end?: string;
  registrationOpen?: boolean;
  registrationUrl?: string;
  registrationDeadline?: string;
}
// Date-only values end at midnight in Malaysia, never in the visitor's timezone.
export function endTime(value: string) {
  return new Date(
    value.length === 10 ? `${value}T23:59:59.999+08:00` : value,
  ).getTime();
}
export function statusOf(event: EventTiming, now = Date.now()) {
  if (event.status === "past" || event.status === "cancelled")
    return event.status;
  if (!event.start || event.status === "tba") return "tba";
  return endTime(event.end || event.start) < now ? "past" : "upcoming";
}
export function isUpcoming(event: EventTiming, now = Date.now()) {
  const state = statusOf(event, now);
  return state === "upcoming" || state === "tba";
}
export function canRegister(event: EventTiming, now = Date.now()) {
  return (
    statusOf(event, now) === "upcoming" &&
    event.registrationOpen === true &&
    !!event.registrationUrl &&
    (!event.registrationDeadline || now < endTime(event.registrationDeadline))
  );
}
export const labels = {
  upcoming: "Upcoming",
  tba: "Upcoming",
  past: "Past event",
  cancelled: "Cancelled",
};
export function displayDate(value?: string) {
  if (!value) return "Date not recorded";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value.length === 10 ? `${value}T12:00:00+08:00` : value));
}
export function displayTime(value?: string) {
  return value && value.length > 10
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Kuala_Lumpur",
      }).format(new Date(value))
    : "";
}
export function eventOrder(
  a: { data: EventTiming & { title: string } },
  b: { data: EventTiming & { title: string } },
  now = Date.now(),
) {
  const rank = { upcoming: 0, tba: 1, past: 2, cancelled: 3 };
  const sa = statusOf(a.data, now),
    sb = statusOf(b.data, now);
  if (sa !== sb) return rank[sa] - rank[sb];
  if (a.data.start && b.data.start)
    return (
      (Date.parse(a.data.start) - Date.parse(b.data.start)) *
      (sa === "past" ? -1 : 1)
    );
  if (a.data.start) return -1;
  if (b.data.start) return 1;
  return a.data.title.localeCompare(b.data.title);
}
