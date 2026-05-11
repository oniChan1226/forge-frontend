import { TodoService } from "@/services/todo.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTodoDTO } from "@/types/services/todo";

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

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTodoDTO> }) =>
      TodoService.updateTodo(id, data),
    onSuccess: async () => {
      toast.success("Todo updated successfully!");
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Failed to update todo", error);
      toast.error("Failed to update todo. Please try again.");
    },
  });
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.deleteTodo,
    onSuccess: async () => {
      toast.success("Todo deleted successfully!");
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Failed to delete todo", error);
      toast.error("Failed to delete todo. Please try again.");
    },
  });
};

export function useMoveTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.moveTodo,

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
}
