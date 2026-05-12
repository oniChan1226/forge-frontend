import type { UserNotes } from "@/types/services/notes";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isUserNote = (value: unknown): value is UserNotes =>
  isRecord(value) &&
  typeof value._id === "string" &&
  typeof value.title === "string" &&
  typeof value.contentText === "string" &&
  typeof value.contentHtml === "string";

const readPaginationSource = (response: unknown): Record<string, unknown> | null => {
  if (!isRecord(response)) {
    return null;
  }

  if (isRecord(response.pagination)) {
    return response.pagination;
  }

  if (isRecord(response.meta)) {
    return response.meta;
  }

  return response;
};

const extractNotesFromValue = (value: unknown): UserNotes[] => {
  if (Array.isArray(value)) {
    if (value.every(isUserNote)) {
      return value as UserNotes[];
    }

    return value.flatMap(extractNotesFromValue);
  }

  if (!isRecord(value)) {
    return [];
  }

  if (Array.isArray(value.pages)) {
    return value.pages.flatMap(extractNotesFromValue);
  }

  if ("data" in value) {
    return extractNotesFromValue(value.data);
  }

  return isUserNote(value) ? [value] : [];
};

const patchNote = (
  value: unknown,
  noteId: string,
  patch: Partial<Record<string, unknown>>,
): unknown => {
  if (Array.isArray(value)) {
    if (value.every(isUserNote)) {
      return value.map((note) =>
        note._id === noteId ? { ...note, ...patch } : note,
      );
    }

    return value.map((entry) => patchNote(entry, noteId, patch));
  }

  if (!isRecord(value)) {
    return value;
  }

  if (Array.isArray(value.pages)) {
    return {
      ...value,
      pages: value.pages.map((entry) => patchNote(entry, noteId, patch)),
    };
  }

  if ("data" in value) {
    const nextData = patchNote(value.data, noteId, patch);

    if (nextData === value.data) {
      return value;
    }

    return {
      ...value,
      data: nextData,
    };
  }

  return isUserNote(value) && value._id === noteId ? { ...value, ...patch } : value;
};

const removeNote = (value: unknown, noteId: string): unknown => {
  if (Array.isArray(value)) {
    if (value.every(isUserNote)) {
      return value.filter((note) => note._id !== noteId);
    }

    return value.map((entry) => removeNote(entry, noteId));
  }

  if (!isRecord(value)) {
    return value;
  }

  if (Array.isArray(value.pages)) {
    return {
      ...value,
      pages: value.pages.map((entry) => removeNote(entry, noteId)),
    };
  }

  if ("data" in value) {
    const nextData = removeNote(value.data, noteId);

    if (nextData === value.data) {
      return value;
    }

    return {
      ...value,
      data: nextData,
    };
  }

  return value;
};

const prependNote = (value: unknown, note: UserNotes): unknown => {
  if (Array.isArray(value)) {
    if (value.every(isUserNote)) {
      return [note, ...value.filter((item) => item._id !== note._id)];
    }

    if (value.length === 0) {
      return [note];
    }

    return [prependNote(value[0], note), ...value.slice(1)];
  }

  if (!isRecord(value)) {
    return value;
  }

  if (Array.isArray(value.pages)) {
    const nextPages = [...value.pages];

    if (nextPages.length === 0) {
      nextPages.push([note]);
    } else {
      nextPages[0] = prependNote(nextPages[0], note);
    }

    return {
      ...value,
      pages: nextPages,
    };
  }

  if ("data" in value) {
    return {
      ...value,
      data: prependNote(value.data, note),
    };
  }

  return value;
};

export const extractNotesQueryItems = extractNotesFromValue;

export const extractNotesQuerySummary = (response: unknown) => {
  const source = readPaginationSource(response);

  if (!source) {
    return {
      page: undefined as number | undefined,
      limit: undefined as number | undefined,
      total: undefined as number | undefined,
      totalPages: undefined as number | undefined,
      hasNextPage: undefined as boolean | undefined,
      nextPage: undefined as number | undefined,
    };
  }

  const page = typeof source.page === "number" ? source.page : undefined;
  const limit = typeof source.limit === "number" ? source.limit : undefined;
  const total = typeof source.total === "number" ? source.total : undefined;
  const totalPages =
    typeof source.totalPages === "number" ? source.totalPages : undefined;
  const hasNextPage =
    typeof source.hasNextPage === "boolean" ? source.hasNextPage : undefined;
  const nextPage =
    typeof source.nextPage === "number" ? source.nextPage : undefined;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    nextPage,
  };
};

export const patchNotesQueryData = patchNote;

export const removeNoteFromNotesQueryData = removeNote;

export const prependNoteToNotesQueryData = prependNote;