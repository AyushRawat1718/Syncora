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
import { useState, useEffect } from "react";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  selectedDate?: string;
}

export default function EventModal({
  open,
  onClose,
  onSubmit,
  selectedDate,
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "Meeting",
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  // ✅ Define color mapping by event type
  const eventColors: Record<string, string> = {
    Meeting: "#3A87AD",
    Task: "#2ECC71",
    Reminder: "#F39C12",
  };

  const handleSubmit = () => {
    const { title, description, eventType, date, startTime, endTime } =
      formData;

    if (!title || !startTime || !endTime || !eventType) {
      alert("Please fill in all required fields.");
      return;
    }

    const startISO = new Date(`${date}T${startTime}`).toISOString();
    const endISO = new Date(`${date}T${endTime}`).toISOString();

    const color = eventColors[eventType] || "#3A87AD";

    onSubmit({
      title,
      description,
      eventType,
      color,
      startTime: startISO,
      endTime: endISO,
    });

    onClose();
    setFormData({
      title: "",
      description: "",
      eventType: "Meeting",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-600">
            Add New Event
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Input
            placeholder="Brief Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* Event Type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Event Type</p>
            <div className="flex gap-4">
              {["Meeting", "Task", "Reminder"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="eventType"
                    value={type}
                    checked={formData.eventType === type}
                    onChange={(e) =>
                      setFormData({ ...formData, eventType: e.target.value })
                    }
                    className="accent-blue-600"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date */}
          {!selectedDate && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Date</p>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          )}

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Start Time
              </p>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">End Time</p>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700">
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
