import { PageTitle } from "@/components/generic/PageTitle";
import { ViewSwitcher, type ViewId } from "@/components/todo/main/ViewSwitcher";
import ViewRenderer from "@/components/todo/views/ViewRenderer";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { CreateTodoModal } from "@/components/todo/main/CreateTodoSheet";
import { TooltipWrapper } from "@/components/generic/TooltipWrapper";
import { TodoModalProvider, useTodoModal } from "@/contexts/todo-modal-context";

const TodoPageContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCreateModal } = useTodoModal();

  const currentView = (searchParams.get("view") as ViewId) || "board";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");

      const isShortcut = isMac
        ? e.metaKey && e.key === "Enter"
        : e.ctrlKey && e.key === "Enter";

      if (!isShortcut) return;

      const target = e.target as HTMLElement;

      // prevent triggering while typing in inputs/textareas/contentEditable
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        console.log("Shortcut pressed inside an input, ignoring.");
        return;
      }

      e.preventDefault();
      openCreateModal();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openCreateModal]);

  const onViewChange = (view: ViewId) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("view", view);
      return params;
    });
  };

  return (
    <div className="relative">
      <div className="flex space-y-4 md:space-y-0 flex-col md:flex-row md:items-end justify-between gap-x-2">
        <PageTitle
          title="Todos"
          subtitle=""
          highlight="@tags to organize, !priority to escalate."
        />
        <ViewSwitcher value={currentView} onChange={onViewChange} />
      </div>

      <div>
        <ViewRenderer view={currentView} />
      </div>

      <TooltipWrapper tip="Ctrl + Enter">
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => openCreateModal()}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 h-12 px-3 rounded-full  bg-primary text-primary-foreground transition-all active:scale-95 cursor-pointer group hover:bg-primary-dark"
        >
          <Plus
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        </motion.button>
      </TooltipWrapper>
      <CreateTodoModal />
    </div>
  );
};

const TodoPage = () => {
  return (
    <TodoModalProvider>
      <TodoPageContent />
    </TodoModalProvider>
  );
};

export default TodoPage;
