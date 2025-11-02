"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import axios from "axios";
import EventModal from "./components/EventModal"; // ✅ Updated modal component

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // ✅ Fetch events from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ When user clicks a date → open modal
  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.startStr);
    setIsModalOpen(true);
  };

  // ✅ When modal form is submitted
  const handleCreateEvent = async (formData: any) => {
    const newEvent = {
      title: formData.title,
      description: formData.description,
      eventType: formData.eventType,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/events",
        newEvent
      );
      setEvents([...events, res.data]); // ✅ Add new event from backend
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please check the backend connection.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f3f4] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col gap-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1a73e8]">Syncora</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1a73e8] text-white px-4 py-2 rounded-xl hover:bg-[#1557b0] transition">
          <span>＋</span> Add Event
        </button>

        <div className="text-sm text-gray-500 mt-4">
          <p>Upcoming Events</p>
          <hr className="my-2" />
          {events.length === 0 ? (
            <p className="text-gray-700 italic">No upcoming events</p>
          ) : (
            <ul className="text-gray-800 list-disc list-inside">
              {events.slice(0, 3).map((e) => (
                <li key={e.id}>{e.title}</li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Calendar */}
      <section className="flex-1 p-8">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            events={events.map((e: any) => ({
              title: e.title,
              start: e.startTime,
              end: e.endTime,
              allDay: false,
            }))}
            select={handleDateSelect}
            height="85vh"
          />
        </div>
      </section>

      {/* ✅ Updated Modal Integration */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEvent}
        selectedDate={selectedDate}
      />
    </main>
  );
}
