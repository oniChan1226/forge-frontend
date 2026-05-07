import { PageTitle } from "@/components/generic/PageTitle";
import { useState } from "react";
import { ViewSwitcher, type ViewId } from "@/components/todo/main/ViewSwitcher";
import ViewRenderer from "@/components/todo/views/ViewRenderer";

const TodoPage = () => {
  const [currentView, setCurrentView] = useState<ViewId>("list");

  return (
    <div>
      <div className="flex space-y-4 md:space-y-0 flex-col md:flex-row md:items-end justify-between gap-x-2">
        <PageTitle
          title="Heat List"
          subtitle="Focus on what matters most."
          highlight="@tags to organize, !priority to escalate."
        />
        <ViewSwitcher value={currentView} onChange={setCurrentView} />
      </div>
      <div>
        <ViewRenderer view={currentView} />
      </div>
    </div>
  );
};

export default TodoPage;
