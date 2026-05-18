import { useMemo, useState } from "react"
import {
  BookOpen,
  Check,
  Dumbbell,
  Flame,
  Moon,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import {
  frequencyLabel,
  isInDigestToday,
  MOCK_HABITS_DIGEST,
  scheduleHint,
  type FrequencyType,
  type UserHabitDigest,
} from "@/components/habit/todayHabitsDigest"

const ACCENT_BY_FREQUENCY: Record<
  FrequencyType,
  { icon: LucideIcon; chip: string; bar: string }
> = {
  daily: {
    icon: Sun,
    chip: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  weekly_custom: {
    icon: Dumbbell,
    chip: "bg-orange-500/12 text-orange-700 dark:text-orange-400",
    bar: "bg-orange-500",
  },
  monthly: {
    icon: Moon,
    chip: "bg-violet-500/12 text-violet-700 dark:text-violet-400",
    bar: "bg-violet-500",
  },
  custom_interval: {
    icon: BookOpen,
    chip: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
    bar: "bg-sky-500",
  },
}

export const TodayHabits = () => {
  const [habits, setHabits] = useState<UserHabitDigest[]>(MOCK_HABITS_DIGEST)
  const now = useMemo(() => new Date(), [])

  const digestRows = useMemo(() => {
    return habits
      .filter((habit) => isInDigestToday(habit, now))
      .sort((a, b) => {
        if (!!a.completedToday !== !!b.completedToday)
          return a.completedToday ? 1 : -1
        return a.title.localeCompare(b.title)
      })
  }, [habits, now])

  const completedCount = digestRows.filter((h) => h.completedToday).length
  const total = digestRows.length
  const progressPct = total === 0 ? 0 : Math.round((completedCount / total) * 100)
  const remaining = total - completedCount

  const toggleToday = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id !== id) return h
        const was = h.completedToday
        const weekCap = h.timesPerWeek ?? 7
        const monthCap = h.timesPerMonth ?? 31
        return {
          ...h,
          completedToday: !was,
          completionsThisWeek: was
            ? Math.max(0, h.completionsThisWeek - 1)
            : Math.min(weekCap, h.completionsThisWeek + 1),
          completionsThisMonth: was
            ? Math.max(0, h.completionsThisMonth - 1)
            : Math.min(monthCap, h.completionsThisMonth + 1),
        }
      })
    )
  }

  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <section className="mt-8 space-y-5" aria-label="Daily habit digest">
      <DigestHeader
        formattedDate={formattedDate}
        completedCount={completedCount}
        total={total}
        progressPct={progressPct}
        remaining={remaining}
      />

      {total === 0 ? (
        <EmptyDigest />
      ) : (
        <ol className="overflow-hidden rounded-2xl bg-muted/25 ring-1 ring-border/60">
          {digestRows.map((h, index) => (
            <DigestRow
              key={h._id}
              habit={h}
              isLast={index === digestRows.length - 1}
              onToggle={() => toggleToday(h._id)}
            />
          ))}
        </ol>
      )}
    </section>
  )
}

function DigestHeader({
  formattedDate,
  completedCount,
  total,
  progressPct,
  remaining,
}: {
  formattedDate: string
  completedCount: number
  total: number
  progressPct: number
  remaining: number
}) {
  const allDone = total > 0 && progressPct === 100

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <DigestHeaderEyebrow />
        <h2 className="font-eb-garamond text-2xl font-semibold tracking-tight sm:text-3xl">
          {formattedDate}
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {total === 0
            ? "No habits scheduled for today."
            : allDone
              ? "You're clear for today — every habit is checked off."
              : `${remaining} of ${total} habit${total === 1 ? "" : "s"} still waiting on you.`}
        </p>
      </div>
      <ProgressRing value={progressPct} completed={completedCount} total={total} />
    </header>
  )
}

function DigestHeaderEyebrow() {
  return (
    <div className="flex items-center gap-2">
      <Sparkles className="size-4 text-primary" aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Daily digest
      </p>
    </div>
  )
}

function ProgressRing({
  value,
  completed,
  total,
}: {
  value: number
  completed: number
  total: number
}) {
  const size = 88
  const stroke = 7
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      role="img"
      aria-label={`${value}% complete, ${completed} of ${total} habits done`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-eb-garamond text-2xl font-semibold leading-none tabular-nums">
          {completed}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          of {total}
        </span>
      </div>
    </div>
  )
}

function EmptyDigest() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Sparkles className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <p className="font-medium">Nothing on the list today</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Habits with matching schedule rules will show up here automatically.
      </p>
    </div>
  )
}

function DigestRow({
  habit: h,
  isLast,
  onToggle,
}: {
  habit: UserHabitDigest
  isLast: boolean
  onToggle: () => void
}) {
  const accent = ACCENT_BY_FREQUENCY[h.frequencyType]
  const Icon = accent.icon
  const hint = scheduleHint(h)
  const done = h.completedToday

  const weekGoal = h.frequencyType === "weekly_custom" ? h.timesPerWeek : null
  const monthGoal = h.frequencyType === "monthly" ? h.timesPerMonth : null
  const periodDone =
    weekGoal != null
      ? h.completionsThisWeek
      : monthGoal != null
        ? h.completionsThisMonth
        : null
  const periodGoal = weekGoal ?? monthGoal
  const periodLabel = h.frequencyType === "monthly" ? "month" : "week"

  return (
    <li
      className={cn(
        "group relative flex items-center gap-3 px-3 py-3.5 transition-colors sm:gap-4 sm:px-4 sm:py-4",
        !isLast && "border-b border-border/50",
        done ? "bg-status-done/5" : "hover:bg-accent/35"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-3 left-0 w-1 rounded-r-full transition-colors",
          done ? "bg-status-done" : accent.bar
        )}
      />

      <IconTile accent={accent} done={done} Icon={Icon} />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3
            className={cn(
              "text-[15px] font-semibold leading-snug tracking-tight sm:text-base",
              done && "text-muted-foreground line-through decoration-muted-foreground/50"
            )}
          >
            {h.title}
          </h3>
          {h.longestStreak > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
              <Flame className="size-3 text-orange-500" aria-hidden />
              {h.longestStreak}
            </span>
          ) : null}
        </div>

        {h.description && !done ? (
          <p className="line-clamp-1 text-xs text-muted-foreground">{h.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              accent.chip
            )}
          >
            {frequencyLabel(h)}
          </span>
          {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
        </div>

        {periodGoal != null && periodGoal > 0 && periodDone != null ? (
          <SegmentProgress
            done={periodDone}
            goal={periodGoal}
            label={periodLabel}
            accentClass={accent.bar}
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? "Mark as not done" : "Mark completed for today"}
        className={cn(
          "relative flex size-11 shrink-0 items-center justify-center rounded-xl transition-all sm:size-12",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          done
            ? "bg-status-done text-status-done-foreground shadow-sm"
            : "bg-background ring-1 ring-border/80 hover:ring-primary/50 hover:shadow-sm"
        )}
      >
        <Check
          className={cn(
            "size-5 transition-transform",
            done ? "scale-100" : "scale-90 text-muted-foreground/50 group-hover:text-primary"
          )}
          strokeWidth={2.5}
        />
      </button>
    </li>
  )
}

function IconTile({
  accent,
  done,
  Icon,
}: {
  accent: (typeof ACCENT_BY_FREQUENCY)[FrequencyType]
  done: boolean
  Icon: LucideIcon
}) {
  return (
    <div
      className={cn(
        "ml-1 flex size-11 shrink-0 items-center justify-center rounded-2xl transition-opacity sm:size-12",
        accent.chip,
        done && "opacity-55"
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </div>
  )
}

function SegmentProgress({
  done,
  goal,
  label,
  accentClass,
}: {
  done: number
  goal: number
  label: string
  accentClass: string
}) {
  const capped = Math.min(done, goal)

  return (
    <div className="flex items-center gap-2.5" aria-label={`${done} of ${goal} this ${label}`}>
      <div className="flex gap-1">
        {Array.from({ length: goal }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-3 rounded-full transition-colors",
              i < capped ? accentClass : "bg-muted-foreground/20"
            )}
          />
        ))}
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground">
        {done}/{goal}
      </span>
    </div>
  )
}
