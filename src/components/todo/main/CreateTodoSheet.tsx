import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { TagEditor } from "./TagInput";
import { stripTagsFromDescription } from "@/utils/tag-helpers";
import { useTodoModal } from "@/contexts/todo-modal-context";
import { Sparkles } from "lucide-react";
import { useCreateTodoMutation } from "@/hooks/mutations/useTodo.mutation";
import type { CreateTodoDTO } from "@/types/services/todo";
import Loader from "@/utils/Loader";

export function CreateTodoModal() {
  const { isOpen, closeModal, prefilledStatus } = useTodoModal();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTodoDTO>({
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      status: prefilledStatus ?? "backlog",
      dueDate: undefined,
      tags: [],
    },
  });

  const createTodoMutation = useCreateTodoMutation();

  useEffect(() => {
    if (prefilledStatus) {
      setValue("status", prefilledStatus);
    }
  }, [prefilledStatus, setValue]);

  const handleClose = () => {
    reset();
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

      await createTodoMutation.mutateAsync(payload);

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
      <DialogContent className="sm:max-w-lg">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-primary/10 to-transparent" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader className="gap-1">
            <DialogTitle className="flex items-center text-xl font-semibold tracking-tight">
              <Sparkles className="size-5 text-primary pr-1" />
              Create Todo
            </DialogTitle>

            <DialogDescription className="text-sm tracking-tight">
              Plan your next task with priority, deadline, and tags.
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
              disabled={createTodoMutation.isPending}
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={createTodoMutation.isPending}>
              <Loader
                isLoading={createTodoMutation.isPending}
                loadedText="Create Todo"
                loadingText="Creating..."
              />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
