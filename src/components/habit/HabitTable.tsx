// components/habits/habit-table.tsx

"use client"

import {
  Check,
  Flame,
  MoreHorizontal,
  Circle,
  Droplets,
  Dumbbell,
  BookOpen,
  Brain,
  Code2,
} from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const days = [
  { short: "Sun", date: 18 },
  { short: "Mon", date: 19 },
  { short: "Tue", date: 20 },
  { short: "Wed", date: 21 },
  { short: "Thu", date: 22 },
  { short: "Fri", date: 23 },
  { short: "Sat", date: 24 },
]

const habits = [
  {
    name: "Drink Water",
    frequency: "Daily",
    icon: Droplets,
    color: "bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    streak: 16,
    progress: 100,
    completed: [true, true, true, true, true, true, true],
  },
  {
    name: "Morning Workout",
    frequency: "4x per week",
    icon: Dumbbell,
    color:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    streak: 7,
    progress: 75,
    completed: [true, false, true, false, false, false, false],
  },
  {
    name: "Read a Book",
    frequency: "Daily",
    icon: BookOpen,
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    streak: 12,
    progress: 85,
    completed: [true, false, false, false, true, true, false],
  },
  {
    name: "Meditate",
    frequency: "Daily",
    icon: Brain,
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    streak: 22,
    progress: 95,
    completed: [true, true, true, true, true, true, false],
  },
  {
    name: "Practice Coding",
    frequency: "3x per week",
    icon: Code2,
    color:
      "bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground",
    streak: 3,
    progress: 60,
    completed: [false, false, true, false, true, false, false],
  },
]

function HabitStatus({
  completed,
}: {
  completed: boolean
}) {
  return completed ? (
    <div className="flex items-center justify-center">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-status-done text-white">
        <Check className="h-3 w-3" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <Circle className="h-4 w-4 text-muted-foreground/40" />
    </div>
  )
}

function ProgressBar({
  value,
}: {
  value: number
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-xs font-medium text-muted-foreground">
        {value}%
      </span>
    </div>
  )
}

export const HabitTable = () => {
  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Weekly Habits
          </CardTitle>

          <CardDescription>
            Build routines one day at a time.
          </CardDescription>
        </div>

        <Button className="gap-2 rounded-xl">
          + Add Habit
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto thin-scrollbar no-scrollbar-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="min-w-[240px] pl-6">
                  Habit
                </TableHead>

                {days.map((day) => (
                  <TableHead
                    key={day.short}
                    className="text-center min-w-[72px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {day.short}
                      </span>

                      <span className="text-sm font-semibold">
                        {day.date}
                      </span>
                    </div>
                  </TableHead>
                ))}

                <TableHead className="text-center">
                  Streak
                </TableHead>

                <TableHead className="min-w-[140px]">
                  Progress
                </TableHead>

                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {habits.map((habit) => {
                const Icon = habit.icon

                return (
                  <TableRow
                    key={habit.name}
                    className="border-border/60 transition-colors hover:bg-accent/40"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-2xl",
                            habit.color
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold leading-none">
                            {habit.name}
                          </p>

                          <Badge
                            variant="secondary"
                            className="rounded-md bg-tag-background text-tag-foreground hover:bg-tag-background"
                          >
                            {habit.frequency}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {habit.completed.map((done, idx) => (
                      <TableCell
                        key={idx}
                        className="text-center"
                      >
                        <HabitStatus completed={done} />
                      </TableCell>
                    ))}

                    <TableCell>
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <span>{habit.streak}</span>

                        <Flame className="h-4 w-4 text-orange-500" />
                      </div>
                    </TableCell>

                    <TableCell>
                      <ProgressBar value={habit.progress} />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}