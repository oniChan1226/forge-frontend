import { NotesService } from "@/services/notes.service";
import { extractNotesQueryItems, extractNotesQuerySummary } from "@/utils/notes-query-cache";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const DEFAULT_NOTES_LIMIT = 20;

type UseGetNotesQueryArgs = {
  search?: string;
  limit?: number;
};

export const useGetNotesQuery = ({
  search = "",
  limit = DEFAULT_NOTES_LIMIT,
}: UseGetNotesQueryArgs = {}) => {
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: ["notes", normalizedSearch, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      NotesService.getNotes({
        search: normalizedSearch,
        page: Number(pageParam),
        limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const summary = extractNotesQuerySummary(lastPage);

      if (typeof summary.nextPage === "number") {
        return summary.nextPage;
      }

      if (summary.hasNextPage === false) {
        return undefined;
      }

      if (typeof summary.totalPages === "number") {
        const currentPage = summary.page ?? allPages.length;
        return currentPage < summary.totalPages ? currentPage + 1 : undefined;
      }

      const currentPageItems = extractNotesQueryItems(lastPage);

      if (currentPageItems.length < limit) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
};

export const useGetNoteByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => NotesService.getNoteById(id),
  });
};
