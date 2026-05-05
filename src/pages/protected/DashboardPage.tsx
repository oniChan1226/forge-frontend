import DashboardTitle from "@/components/dashboard/main/DashboardTitle";
import { StatsCard } from "@/components/dashboard/main/StatsCard";
import { CheckCircle2, Flame } from "lucide-react";

export const DashboardPage = () => {
  return (
    <div>
      {/* Top Container -> Title & 2 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Title spans full row */}
        <DashboardTitle className="col-span-2 lg:col-span-2 " />

        {/* Two cards */}
         <StatsCard
          label="Current Streak"
          value="7 days"
          icon={<Flame size={18} />}
        />

        {/* Completed Todos */}
        <StatsCard
          label="Todos Completed"
          value="42"
          icon={<CheckCircle2 size={18} />}
        />
      </div>
      {/* Top Container -> Title & 2 Cards -- END*/}
    </div>
  );
};

export default DashboardPage;
