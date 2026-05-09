import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Field, FieldGroup } from "@/components/ui/field";
import TagInputEditor from "./TagInput";

interface CreateTodoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTodoSheet({ isOpen, onClose }: CreateTodoSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("backlog");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags,
    };

    console.log(payload);

    onClose();
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full font-sans md:min-w-lg sm:max-w-xl overflow-y-auto px-4">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="px-0 gap-1">
            <SheetTitle className="text-xl">Create Todo</SheetTitle>
            <SheetDescription className="text-xs">
              Add a new task to your workflow
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5 flex-1">
            {/* TITLE */}
            <div className="space-y-2">
              <Label>
                <span>
                  Title <span className="text-red-500">*</span>
                </span>
              </Label>
              <Input
                placeholder="what needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <Label>Description</Label>
              <TagInputEditor
                value={description}
                onChange={(value, extractedTags) => {
                  setDescription(value);
                  setTags(extractedTags);
                }}
                maxLength={5000}
                maxWords={100}
              />
            </div>

            {/* PRIORITY + STATUS */}
            <FieldGroup>
              <Field>
                <Label>Priority</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </Field>

              <Field>
                <Label>Status</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </Field>
            </FieldGroup>

            {/* TAGS */}
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="frontend, backend, bug"
                value={tags.join(", ")}
                onChange={(e) => setTags(e.target.value.split(",").map((t) => t.trim()))}
              />
            </div>

            {/* DUE DATE */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">Create Todo</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
