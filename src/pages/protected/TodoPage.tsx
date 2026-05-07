import { PageTitle } from "@/components/generic/PageTitle";
import { ViewSwitcher, type ViewId } from "@/components/todo/main/ViewSwitcher";
import ViewRenderer from "@/components/todo/views/ViewRenderer";
import { useSearchParams } from "react-router-dom";

const TodoPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentView =
    (searchParams.get("view") as ViewId) || "board";

  const onViewChange = (view: ViewId) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("view", view);
      return params;
    });
  };

  return (
    <div>
      <div className="flex space-y-4 md:space-y-0 flex-col md:flex-row md:items-end justify-between gap-x-2">
        <PageTitle
          title="Heat List"
          subtitle=""
          highlight="@tags to organize, !priority to escalate."
        />
        <ViewSwitcher value={currentView} onChange={onViewChange} />
      </div>

      <div>
        <ViewRenderer view={currentView} />
      </div>
    </div>
  );
};

export default TodoPage;