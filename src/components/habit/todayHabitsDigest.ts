/** Mirrors backend `UserHabit` for the daily digest UI. */

export type FrequencyType =
  | "daily"
  | "weekly_custom"
  | "monthly"
  | "custom_interval"

export type DigestInclusion =
  | "every_day"
  | "matching_weekdays"
  | "matching_month_days"

export type UserHabitDigest = {
  _id: string
  title: string
  description: string
  frequencyType: FrequencyType
  digestInclusion: DigestInclusion
  timesPerWeek: number | null
  timesPerMonth: number | null
  intervalDays: number | null
  daysOfWeek: number[] | null
  daysOfMonth: number[] | null
  weekStartDay: number
  startDate: string
  isActive: boolean
  longestStreak: number
  /** UI-only until completion API is wired */
  completionsThisWeek: number
  completionsThisMonth: number
  completedToday: boolean
}

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** Whether this habit should appear in today's digest list. */
export function isInDigestToday(h: UserHabitDigest, now = new Date()): boolean {
  if (!h.isActive) return false

  switch (h.digestInclusion) {
    case "every_day":
      return true
    case "matching_weekdays":
      return h.daysOfWeek?.length ? h.daysOfWeek.includes(now.getDay()) : false
    case "matching_month_days":
      return h.daysOfMonth?.length ? h.daysOfMonth.includes(now.getDate()) : false
    default:
      return false
  }
}

export function frequencyLabel(h: UserHabitDigest): string {
  switch (h.frequencyType) {
    case "daily":
      return "Daily"
    case "weekly_custom":
      return h.timesPerWeek != null ? `${h.timesPerWeek}× / week` : "Weekly"
    case "monthly":
      return h.timesPerMonth != null ? `${h.timesPerMonth}× / month` : "Monthly"
    case "custom_interval":
      return h.intervalDays != null ? `Every ${h.intervalDays} days` : "Custom interval"
    default:
      return "Habit"
  }
}

export function scheduleHint(h: UserHabitDigest): string | null {
  if (h.digestInclusion === "matching_weekdays" && h.daysOfWeek?.length) {
    return h.daysOfWeek.map((d) => DAY_SHORT[d] ?? "?").join(" · ")
  }
  if (h.digestInclusion === "matching_month_days" && h.daysOfMonth?.length) {
    return h.daysOfMonth.map((d) => `${d}${ordinal(d)}`).join(" · ")
  }
  if (h.frequencyType === "custom_interval" && h.intervalDays) {
    const start = startOfLocalDay(new Date(h.startDate))
    const t = startOfLocalDay(new Date())
    const diff = Math.floor((t - start) / 86_400_000)
    if (diff >= 0 && diff % h.intervalDays === 0) return "Interval day"
  }
  return null
}

function ordinal(n: number): string {
  const v = n % 100
  if (v >= 11 && v <= 13) return "th"
  switch (n % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

export const MOCK_HABITS_DIGEST: UserHabitDigest[] = [
  {
    _id: "h1",
    title: "Morning run",
    description: "20 minutes easy pace before breakfast.",
    frequencyType: "daily",
    digestInclusion: "every_day",
    timesPerWeek: null,
    timesPerMonth: null,
    intervalDays: null,
    daysOfWeek: null,
    daysOfMonth: null,
    weekStartDay: 1,
    startDate: "2026-01-01T08:00:00.000Z",
    isActive: true,
    longestStreak: 14,
    completionsThisWeek: 5,
    completionsThisMonth: 18,
    completedToday: false,
  },
  {
    _id: "h2",
    title: "Strength training",
    description: "Upper or lower split.",
    frequencyType: "weekly_custom",
    digestInclusion: "matching_weekdays",
    timesPerWeek: 4,
    timesPerMonth: null,
    intervalDays: null,
    daysOfWeek: [1, 3, 5, 6],
    daysOfMonth: null,
    weekStartDay: 1,
    startDate: "2026-02-10T18:00:00.000Z",
    isActive: true,
    longestStreak: 8,
    completionsThisWeek: 2,
    completionsThisMonth: 0,
    completedToday: false,
  },
  {
    _id: "h3",
    title: "Deep work block",
    description: "One focused 90-minute block.",
    frequencyType: "weekly_custom",
    digestInclusion: "every_day",
    timesPerWeek: 5,
    timesPerMonth: null,
    intervalDays: null,
    daysOfWeek: [1, 2, 3, 4, 5],
    daysOfMonth: null,
    weekStartDay: 1,
    startDate: "2026-03-01T09:00:00.000Z",
    isActive: true,
    longestStreak: 21,
    completionsThisWeek: 4,
    completionsThisMonth: 0,
    completedToday: true,
  },
  {
    _id: "h4",
    title: "Budget review",
    description: "Reconcile accounts and subscriptions.",
    frequencyType: "monthly",
    digestInclusion: "matching_month_days",
    timesPerWeek: null,
    timesPerMonth: 2,
    intervalDays: null,
    daysOfWeek: null,
    daysOfMonth: [1, 15],
    weekStartDay: 1,
    startDate: "2026-01-15T12:00:00.000Z",
    isActive: true,
    longestStreak: 3,
    completionsThisWeek: 0,
    completionsThisMonth: 1,
    completedToday: false,
  },
  {
    _id: "h5",
    title: "Long-form reading",
    description: "30 pages or one chapter.",
    frequencyType: "custom_interval",
    digestInclusion: "every_day",
    timesPerWeek: null,
    timesPerMonth: null,
    intervalDays: 2,
    daysOfWeek: null,
    daysOfMonth: null,
    weekStartDay: 1,
    startDate: "2026-05-10T21:00:00.000Z",
    isActive: true,
    longestStreak: 6,
    completionsThisWeek: 2,
    completionsThisMonth: 0,
    completedToday: false,
  },
]
