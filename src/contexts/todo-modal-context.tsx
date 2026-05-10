import { createContext, useContext, useState, type ReactNode } from "react";
import type { ColumnStatus } from "@/components/todo/views/view-config";

interface TodoModalContextType {
  isOpen: boolean;
  prefilledStatus?: ColumnStatus;
  openCreateModal: (status?: ColumnStatus) => void;
  closeModal: () => void;
}

const TodoModalContext = createContext<TodoModalContextType | undefined>(undefined);

export function TodoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledStatus, setPrefilledStatus] = useState<ColumnStatus | undefined>();

  const openCreateModal = (status?: ColumnStatus) => {
    setPrefilledStatus(status);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPrefilledStatus(undefined);
  };

  return (
    <TodoModalContext.Provider
      value={{
        isOpen,
        prefilledStatus,
        openCreateModal,
        closeModal,
      }}
    >
      {children}
    </TodoModalContext.Provider>
  );
}

export function useTodoModal() {
  const context = useContext(TodoModalContext);
  if (!context) {
    throw new Error("useTodoModal must be used within TodoModalProvider");
  }
  return context;
}
