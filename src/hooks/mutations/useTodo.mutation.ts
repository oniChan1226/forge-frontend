import { TodoService } from "@/services/todo.service";
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
