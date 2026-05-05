import { useMeQuery } from "@/hooks/queries/useUser.queries";

interface DashboardTitleProps {
  className?: string;
}

const DashboardTitle = ({ className }: DashboardTitleProps) => {
  const { data, isLoading } = useMeQuery();
  const user = data?.data;
  return (
    <div className={className}>
      <h1 className="text-xl sm:text-2xl font-bold capitalize max-w-96 text-wrap truncate">
        Good morning, {isLoading ? "Loading..." : user?.name || "there"}
        <span className="text-xl pl-2 inline-block animate-bounce">👋</span>
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        Let's forge something great today!
      </p>
    </div>
  );
};

export default DashboardTitle;
