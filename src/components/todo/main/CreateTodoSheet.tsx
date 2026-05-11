import { useForm, Controller, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { TagEditor } from "./TagInput";
import { stripTagsFromDescription } from "@/utils/tag-helpers";
import { useTodoModal } from "@/contexts/todo-modal-context";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Sparkles, X } from "lucide-react";
import { ConfirmActionModal } from "@/components/generic/ConfirmActionModal";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/hooks/mutations/useTodo.mutation";
import type { CreateTodoDTO } from "@/types/services/todo";
import Loader from "@/utils/Loader";

export function CreateTodoModal() {
  const { isOpen, closeModal, prefilledStatus, todoToEdit } = useTodoModal();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getFormDefaults = () => ({
    title: todoToEdit?.title ?? "",
    description: todoToEdit?.description ?? "",
    priority: todoToEdit?.priority ?? "low",
    status: todoToEdit?.status ?? prefilledStatus ?? "backlog",
    dueDate: todoToEdit?.dueDate ? new Date(todoToEdit.dueDate) : undefined,
    tags: todoToEdit?.tags ?? [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTodoDTO>({
    defaultValues: getFormDefaults(),
  });

  const selectedTags = useWatch({ control, name: "tags" }) ?? [];

  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    const nextTags = isSelected
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    setValue("tags", nextTags, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const createTodoMutation = useCreateTodoMutation();
  const updateTodoMutation = useUpdateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  useEffect(() => {
    if (!isOpen) return;

    reset({
      title: todoToEdit?.title ?? "",
      description: todoToEdit?.description ?? "",
      priority: todoToEdit?.priority ?? "low",
      status: todoToEdit?.status ?? prefilledStatus ?? "backlog",
      dueDate: todoToEdit?.dueDate ? new Date(todoToEdit.dueDate) : undefined,
      tags: todoToEdit?.tags ?? [],
    });
  }, [isOpen, prefilledStatus, todoToEdit, reset]);

  const handleClose = () => {
    reset({
      title: "",
      description: "",
      priority: "low",
      status: "backlog",
      dueDate: undefined,
      tags: [],
    });
    closeModal();
  };

  const onSubmit = async (values: CreateTodoDTO) => {
    try {
      // Strip tag mentions from description for final payload
      const cleanDescription = values.description
        ? stripTagsFromDescription(values.description)
        : "";

      const payload: CreateTodoDTO = {
        ...values,
        description: cleanDescription,
      };

      if (todoToEdit) {
        await updateTodoMutation.mutateAsync({
          id: todoToEdit._id,
          data: payload,
        });
      } else {
        await createTodoMutation.mutateAsync(payload);
      }

      handleClose();
    } catch (err) {
      // optional: show toast/error handling
      console.error(err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-md" showCloseButton={!createTodoMutation.isPending && !updateTodoMutation.isPending}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-primary/10 to-transparent rounded-t-md" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader className="gap-1">
            <DialogTitle className="flex items-center text-xl font-semibold tracking-tight">
              <Sparkles className="size-5 text-primary pr-1" />
              {todoToEdit ? "Edit Todo" : "Create Todo"}
            </DialogTitle>

            <DialogDescription className="text-sm tracking-tight">
              {todoToEdit
                ? "Update the task details, status, or due date."
                : "Plan your next task with priority, deadline, and tags."}
            </DialogDescription>
          </DialogHeader>

          {/* TITLE */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>

            <Input
              id="title"
              placeholder="What needs to be done?"
              maxLength={100}
              {...register("title", {
                required: "Title is required",
                validate: (value) =>
                  value.trim().length > 0 || "Title is required",
              })}
            />

            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Controller
                  control={control}
                  name="tags"
                  render={({ field: tagsField }) => (
                    <TagEditor
                      value={field.value ?? ""}
                      onChange={(newValue, newTags) => {
                        field.onChange(newValue);
                        tagsField.onChange(newTags);
                      }}
                    />
                  )}
                />
              )}
            />
          </div>

          {todoToEdit && todoToEdit.tags.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between py-1 h-auto flex-wrap hover:bg-transparent active:bg-transparent focus:*:bg-transparent"
                >
                  <div className="flex gap-2 flex-wrap">
                    {selectedTags.length > 0 ? (
                      selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}

                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTag(tag);
                            }}
                            className="cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Select Tags</span>
                    )}
                  </div>

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) p-0"
              >
                <Command>
                  <CommandInput placeholder="Search tags..." />

                  <CommandEmpty>No tag found.</CommandEmpty>

                  <CommandGroup>
                    {todoToEdit.tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);

                      return (
                        <CommandItem
                          key={tag}
                          value={tag}
                          onSelect={() => toggleTag(tag)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />

                          {tag}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* PRIORITY + STATUS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* PRIORITY */}
            <div className="space-y-2 w-full">
              <Label>Priority</Label>

              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="w-[--radix-select-trigger-width]"
                    >
                      <SelectItem value="low">Meh</SelectItem>
                      <SelectItem value="medium">Maybe Important</SelectItem>
                      <SelectItem value="high">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* STATUS */}
            <div className="space-y-2 w-full">
              <Label>Status</Label>

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="w-[--radix-select-trigger-width]"
                    >
                      <SelectItem value="backlog">Backlog</SelectItem>

                      <SelectItem value="in-progress">In Progress</SelectItem>

                      <SelectItem value="in-review">In Review</SelectItem>

                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* DUE DATE */}
          {/* DUE DATE */}
          <div className="space-y-2">
            <Label>Due Date</Label>

            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => {
                const today = new Date();

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start font-normal"
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a due date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <Calendar
                          mode="single"
                          animate
                          fixedWeeks
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(today.setHours(0, 0, 0, 0))
                          }
                          defaultMonth={field.value ?? today}
                          className="p-0 w-full"
                        />

                        {/* PRESETS */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {[
                            { label: "Today", value: 0 },
                            { label: "Tomorrow", value: 1 },
                            { label: "3 Days", value: 3 },
                            { label: "1 Week", value: 7 },
                          ].map((preset) => (
                            <Button
                              key={preset.value}
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="h-7 rounded-md px-2 text-xs"
                              onClick={() => {
                                const newDate = new Date();
                                newDate.setDate(
                                  newDate.getDate() + preset.value,
                                );

                                field.onChange(newDate);
                              }}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={
                createTodoMutation.isPending || updateTodoMutation.isPending
              }
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createTodoMutation.isPending || updateTodoMutation.isPending
              }
            >
              <Loader
                isLoading={
                  createTodoMutation.isPending || updateTodoMutation.isPending
                }
                loadedText={todoToEdit ? "Save Changes" : "Create Todo"}
                loadingText={todoToEdit ? "Saving..." : "Creating..."}
              />
            </Button>

            {todoToEdit && (
              <Button
                type="button"
                variant="destructive"
                disabled={deleteTodoMutation.isPending}
                onClick={() => {
                  setShowDeleteConfirm(true);
                }}
              >
                <Loader
                  isLoading={deleteTodoMutation.isPending}
                  loadedText="Delete"
                  loadingText="Deleting..."
                />
              </Button>
            )}
          </DialogFooter>
        </form>

        {todoToEdit && (
          <ConfirmActionModal
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            title="Delete this todo?"
            description="This action cannot be undone and will permanently remove this task."
            confirmLabel="Delete Todo"
            onConfirm={async () => {
              await deleteTodoMutation.mutateAsync(todoToEdit._id);
              setShowDeleteConfirm(false);
              handleClose();
            }}
            isConfirming={deleteTodoMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
