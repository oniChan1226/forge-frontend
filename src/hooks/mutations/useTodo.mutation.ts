import { TodoService } from "@/services/todo.service";
import type { Todo } from "@/types/services/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.createTodo,
    onSuccess: async () => {
      toast.success("Todo created successfully!");
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Failed to create todo", error);
      toast.error("Failed to create todo. Please try again.");
    },
  });
};

type MoveTodoPayload = {
  todoId: string;
  status: Todo["status"];
  beforeId?: string;
  afterId?: string;
};

export function useMoveTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MoveTodoPayload) => {
      // your api call here
      // return api.moveTodo(payload)

      console.log("🚀 API payload:", payload);
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["todos"],
      });

      const previousTodos = queryClient.getQueryData<Todo[]>([
        "todos",
      ]);

      queryClient.setQueryData<Todo[]>(
        ["todos"],
        (old = []) => {
          const movedTask = old.find(
            (t) => t._id === variables.todoId,
          );

          if (!movedTask) return old;

          const targetTasks = old.filter(
            (t) => t.status === variables.status,
          );

          const newPosition =
            targetTasks.length > 0
              ? Math.max(
                  ...targetTasks.map((t) => t.position),
                ) + 1
              : 0;

          return old.map((task) =>
            task._id === variables.todoId
              ? {
                  ...task,
                  status: variables.status,
                  position: newPosition,
                }
              : task,
          );
        },
      );

      return { previousTodos };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(
          ["todos"],
          context.previousTodos,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
}