import { useMemo, useState } from "react"
import { CalendarCheck2, Check, Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import {
  frequencyLabel,
  isInDigestToday,
  MOCK_HABITS_DIGEST,
  scheduleHint,
  type UserHabitDigest,
} from "@/components/habit/todayHabitsDigest"

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
  const progressPct =
    digestRows.length === 0
      ? 0
      : Math.round((completedCount / digestRows.length) * 100)

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
    <Card size="sm" className="mt-8 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Daily digest</CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
              <CalendarCheck2 className="size-3.5 shrink-0 opacity-70" aria-hidden />
              <span>{formattedDate}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Today
            </p>
            <p className="font-eb-garamond text-2xl font-semibold tabular-nums">
              {completedCount}/{digestRows.length}
            </p>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <Progress value={progressPct} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {digestRows.length === 0
              ? "Nothing scheduled for today."
              : progressPct === 100
                ? "All digest habits done for today."
                : `${digestRows.length - completedCount} habit${digestRows.length - completedCount === 1 ? "" : "s"} left.`}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-4 pt-2">
        {digestRows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No habits in today&apos;s digest.
          </p>
        ) : (
          <ul className="space-y-2">
            {digestRows.map((h) => (
              <DigestRow key={h._id} habit={h} onToggle={() => toggleToday(h._id)} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function DigestRow({
  habit: h,
  onToggle,
}: {
  habit: UserHabitDigest
  onToggle: () => void
}) {
  const hint = scheduleHint(h)
  const weekGoal = h.frequencyType === "weekly_custom" ? h.timesPerWeek : null
  const monthGoal = h.frequencyType === "monthly" ? h.timesPerMonth : null
  const periodDone =
    weekGoal != null
      ? h.completionsThisWeek
      : monthGoal != null
        ? h.completionsThisMonth
        : null
  const periodGoal = weekGoal ?? monthGoal
  const periodLabel = h.frequencyType === "monthly" ? "This month" : "This week"
  const periodProgress =
    periodGoal && periodGoal > 0 && periodDone != null
      ? Math.min(100, Math.round((periodDone / periodGoal) * 100))
      : null

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors",
          h.completedToday
            ? "border-primary/25 bg-primary/5"
            : "border-border bg-card"
        )}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <DigestRowTop habit={h} />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {frequencyLabel(h)}
            </Badge>
            {hint ? (
              <span className="text-[11px] text-muted-foreground">{hint}</span>
            ) : null}
          </div>
          {periodProgress != null && periodGoal != null && periodDone != null ? (
            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{periodLabel}</span>
                <span className="tabular-nums">
                  {periodDone}/{periodGoal}
                </span>
              </div>
              <Progress value={periodProgress} className="h-1" />
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={h.completedToday}
          aria-label={
            h.completedToday ? "Mark as not done" : "Mark completed for today"
          }
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border transition",
            h.completedToday
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/40"
          )}
        >
          <Check className="size-5" strokeWidth={2.5} />
        </button>
      </div>
    </li>
  )
}

function DigestRowTop({ habit: h }: { habit: UserHabitDigest }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 pr-1">
      <div className="min-w-0 space-y-0.5">
        <h3 className="font-medium leading-tight">{h.title}</h3>
        {h.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{h.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Flame className="size-3.5 text-orange-500/90" aria-hidden />
        <span className="tabular-nums">{h.longestStreak}</span>
      </div>
    </div>
  )
}
