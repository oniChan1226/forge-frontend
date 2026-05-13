import { createContext, useContext, useState, type ReactNode } from "react";
import type { ColumnStatus } from "@/components/todo/views/view-config";
import type { Todo } from "@/types/services/todo";

interface TodoModalContextType {
  isOpen: boolean;
  prefilledStatus?: ColumnStatus;
  todoToEdit: Todo | null;
  openCreateModal: (status?: ColumnStatus) => void;
  openEditModal: (todo: Todo) => void;
  closeModal: () => void;
}

const TodoModalContext = createContext<TodoModalContextType | undefined>(undefined);

export function TodoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledStatus, setPrefilledStatus] = useState<ColumnStatus | undefined>();
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);

  const openCreateModal = (status?: ColumnStatus) => {
    setTodoToEdit(null);
    setPrefilledStatus(status);
    setIsOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setTodoToEdit(todo);
    setPrefilledStatus(todo.status);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPrefilledStatus(undefined);
    setTodoToEdit(null);
  };

  return (
    <TodoModalContext.Provider
      value={{
        isOpen,
        prefilledStatus,
        todoToEdit,
        openCreateModal,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </TodoModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodoModal() {
  const context = useContext(TodoModalContext);
  if (!context) {
    throw new Error("useTodoModal must be used within TodoModalProvider");
  }
  return context;
}
