"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export default function EventModal({
  isOpen,
  onClose,
  onCreate,
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "Meeting",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert("Please fill in all required fields!");
      return;
    }
    onCreate(formData);
    setFormData({
      title: "",
      description: "",
      eventType: "Meeting",
      startTime: "",
      endTime: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">
            Add New Event
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <Input
            name="title"
            placeholder="Event title"
            value={formData.title}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Brief description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* Event Type Radio Buttons */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Event Type:</label>
            <div className="flex gap-3">
              {["Meeting", "Class", "Task", "Reminder"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-1 text-gray-600">
                  <input
                    type="radio"
                    name="eventType"
                    value={type}
                    checked={formData.eventType === type}
                    onChange={handleChange}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Start Time:</label>
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">End Time:</label>
            <Input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
