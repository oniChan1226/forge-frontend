// import { lazy, Suspense } from "react";
import ListView from "./listview/ListView";
import BoardView from "./boardview/BoardView";
import CalendarView from "./calendarview/CalendarView";
import PriorityView from "./priorityview/PriorityView";

interface ViewRendererProps {
  view: "list" | "board" | "calendar" | "priority";
}

// const views = {
//   list: lazy(() => import("@/components/todo/views/listview/ListView")),
//   board: lazy(() => import("@/components/todo/views/boardview/BoardView")),
//   calendar: lazy(() => import("@/components/todo/views/calendarview/CalendarView")),
//   priority: lazy(() => import("@/components/todo/views/priorityview/PriorityView")),
// };

const views = {
  list: ListView,
  board: BoardView,
  calendar: CalendarView,
  priority: PriorityView,
};

const ViewRenderer = ({ view }: ViewRendererProps) => {
  const ActiveView = views[view];

  return <ActiveView />;

  //   return (
  //     <Suspense fallback={<div>Loading view...</div>}>
  //       <ActiveView />
  //     </Suspense>
  //   );
};

export default ViewRenderer;
