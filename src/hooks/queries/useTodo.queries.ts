import { TodoService } from "@/services/todo.service"
import { useQuery } from "@tanstack/react-query"


export const useGetTodosQuery = () => {
    return useQuery({
        queryKey: ["todos"],
        queryFn: TodoService.getTodos,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}