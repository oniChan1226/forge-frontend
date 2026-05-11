import { TodoService } from "@/services/todo.service";
import type { GetTodoQueryParams, Todo } from "@/types/services/todo";
import { useQuery } from "@tanstack/react-query";

export const useGetTodosQuery = (params?: GetTodoQueryParams) => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => TodoService.getTodos(params),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
