"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./components/EventModal";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [filters, setFilters] = useState({
    Meeting: true,
    Task: true,
    Reminder: true,
  });

  // ✅ Fetch events
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle calendar date click
  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.startStr);
    setIsModalOpen(true);
  };

  // ✅ Create new event
  const handleCreateEvent = async (formData: any) => {
    try {
      const newEvent = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        allDay: false,
        color: formData.color,
      };

      const res = await axios.post(
        "http://localhost:5000/api/events",
        newEvent
      );
      setEvents((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // ✅ Filters
  const filteredEvents = useMemo(
    () => events.filter((e) => filters[e.eventType as keyof typeof filters]),
    [events, filters]
  );

  // ✅ Upcoming (next 3 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    return [...events]
      .filter(
        (e) =>
          new Date(e.startTime) >= now &&
          new Date(e.startTime) <= threeDaysLater
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .slice(0, 5);
  }, [events]);

  // ✅ Handle filter checkbox
  const handleFilterChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  return (
    <main className="min-h-screen bg-[#f1f3f4] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col gap-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1a73e8]">Syncora</h1>

        {/* Add Event */}
        <button
          onClick={() => {
            setSelectedDate("");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#1a73e8] text-white px-4 py-2 rounded-xl hover:bg-[#1557b0] transition">
          <span>＋</span> Add Event
        </button>

        {/* Upcoming */}
        <div className="text-sm mt-6">
          <p className="text-gray-500 font-medium">Upcoming Events (3 Days)</p>
          <hr className="my-2" />
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-2">
              {upcomingEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-2 text-gray-700 text-sm">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />
                  <span className="truncate">{e.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No upcoming events</p>
          )}
        </div>

        {/* Filters */}
        <div className="mt-6">
          <p className="text-gray-500 font-medium mb-2">My Calendar</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {[
              { type: "Meeting", color: "#3A87AD" },
              { type: "Task", color: "#2ECC71" },
              { type: "Reminder", color: "#F39C12" },
            ].map(({ type, color }) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[type as keyof typeof filters]}
                  onChange={() => handleFilterChange(type)}
                  className="accent-blue-600"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Calendar */}
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
            selectable
            selectMirror
            select={handleDateSelect}
            events={filteredEvents.map((e) => ({
              title: e.title,
              start: e.startTime,
              end: e.endTime,
              allDay: e.allDay,
              color: e.color,
            }))}
            height="85vh"
          />
        </div>
      </section>

      {/* Modal */}
      <EventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDate}
      />
    </main>
  );
}
