// app/habits/page.tsx

import { PageTitle } from "@/components/generic/PageTitle";
// import { HabitTable } from "@/components/habit/HabitTable"
import { TodayHabits } from "@/components/habit/TodayHabits";

const HabitPage = () => {
  return (
    <div className="">
      <div className="flex items-end justify-between">
        <PageTitle
          title="Habits"
          subtitle="Build better routine,"
          highlight="one day at a time."
        />
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {/* streak */}
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-sm font-bold text-accent-foreground/70 tracking-wide">STREAK</h3>
            <p className="text-primary text-2xl md:text-3xl font-semibold font-eb-garamond">5</p>
          </div>
          {/* horizontal line */}
          <div className="w-px h-10 bg-border" />
          {/* complete today */}
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-sm font-bold text-accent-foreground/70 tracking-wide">COMPLETE</h3>
            <p className="text-foreground text-2xl md:text-3xl font-semibold font-eb-garamond">5/10</p>
          </div>
        </div>
      </div>

      <div>
        {/* <CircularProgress value={90}/> */}
        <TodayHabits />

      </div>
    </div>
  );
};

export default HabitPage;
