import { useState } from "react";
import { format } from "date-fns";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TagEditor } from "./TagInput";

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export function CreateTodoModal({
  isOpen,
  onClose,
}: CreateTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<(typeof PRIORITIES)[number]>("low");
  const [status, setStatus] = useState("backlog");
  const [tags, setTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ?? null,
      tags,
    };

    console.log(payload);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Create Todo</DialogTitle>
            <DialogDescription>
              Add a new task to your workflow
            </DialogDescription>
          </DialogHeader>

          {/* TITLE */}
          <div className="space-y-2">
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <TagEditor
              value={description}
              onChange={(newValue, newTags) => {
                setDescription(newValue);
                setTags(newTags);
              }}
            />
          </div>

          {/* PRIORITY */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2 flex-wrap">
              {PRIORITIES.map((p) => (
                <Badge
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "cursor-pointer capitalize transition",
                    priority === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DUE DATE */}
          <div className="space-y-2">
            <Label>Due Date</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {dueDate ? format(dueDate, "PPP") : "Pick a due date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Todo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}