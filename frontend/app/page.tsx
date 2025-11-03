"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./components/EventModal";
import { api } from "@/lib/utils"; // ✅ correct Next.js import alias
const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000") + "/api";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartISO, setSelectedStartISO] = useState<string | null>(null);
  const [selectedEndISO, setSelectedEndISO] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    Meeting: true,
    Task: true,
    Reminder: true,
  });

  // ✅ Fetch all events + upcoming events
  const fetchEvents = async () => {
    try {
      const [all, upcoming] = await Promise.all([
        api.getEvents(),
        api.getUpcomingEvents().catch(() => ({ data: [] })), // fallback if not implemented
      ]);
      setEvents(all.data);
      setUpcomingEvents(upcoming.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Create or update event
  const handleSubmitEvent = async (formData: any) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        category: formData.category || formData.eventType || "Meeting",
        startTime: formData.startTime,
        endTime: formData.endTime,
        allDay: false,
        color: formData.color,
      };

      if (formData.id) {
        const res = await api.updateEvent(formData.id, payload);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === formData.id ? res.data : ev))
        );
      } else {
        const res = await api.createEvent(payload);
        setEvents((prev) => [...prev, res.data]);
      }
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // ✅ Delete event
  const handleDeleteEvent = async (id: string) => {
    try {
      console.log("→ Sending DELETE to:", `${BASE_URL}/events/${id}`);
      const res = await api.deleteEvent(id);
      console.log("← DELETE response:", res.status, res.data);
      // refresh from server (safer)
      await fetchEvents();
      setSelectedEvent(null);
    } catch (error: any) {
      console.error(
        "Error deleting event (frontend):",
        error?.response?.data || error.message
      );
      alert(
        "Delete failed: " +
          (error?.response?.data?.error || error?.message || "Unknown error")
      );
    }
  };

  // ✅ Handle selecting time slot
  const handleDateSelect = (selectInfo: any) => {
    setSelectedStartISO(selectInfo.startStr);
    setSelectedEndISO(selectInfo.endStr ?? selectInfo.startStr);
    const dateOnly = selectInfo.startStr.split("T")[0];
    setSelectedDate(dateOnly);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  // ✅ Handle clicking on existing event
  const handleEventClick = (clickInfo: any) => {
    const clickedId = clickInfo.event.id;
    const ev = events.find((e) => String(e.id) === String(clickedId));
    if (ev) {
      setSelectedEvent(ev);
      setIsModalOpen(true);
    }
  };

  // ✅ Filter toggle
  const handleFilterChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  // ✅ Filtered events
  const filteredEvents = useMemo(
    () => events.filter((e) => filters[e.category as keyof typeof filters]),
    [events, filters]
  );

  // ✅ Convert date to Indian format (DD/MM/YYYY)
  const toIndianDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f1f3f4] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col gap-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#1a73e8] tracking-tight">
          Syncora
        </h1>

        {/* Add Event Button */}
        <button
          onClick={() => {
            setSelectedEvent(null);
            setSelectedDate("");
            setSelectedStartISO(null);
            setSelectedEndISO(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#1a73e8] text-white px-4 py-2 rounded-xl hover:bg-[#1557b0] transition">
          <span>＋</span> Add Event
        </button>

        {/* Upcoming Events */}
        <div className="text-sm mt-6">
          <p className="text-gray-500 font-medium">Upcoming Events</p>
          <hr className="my-2" />
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-2">
              {upcomingEvents.map((e) => (
                <li
                  key={e.id}
                  onClick={() => {
                    setSelectedEvent(e);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />
                  <div className="truncate">
                    <div className="font-medium text-sm">{e.title}</div>
                    <div className="text-xs text-gray-500">
                      {toIndianDate(e.startTime)}
                    </div>
                  </div>
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

      {/* Calendar Section */}
      <section className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 bg-white px-4 py-3 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            Hey User!{" "}
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
              className="text-4xl inline-block origin-bottom">
              👋
            </motion.span>
          </h1>

          <p className="text-base text-gray-600 font-medium tracking-wide italic">
            Stay organized with{" "}
            <span className="text-[#1a73e8] font-semibold not-italic">
              Syncora
            </span>
          </p>
        </div>

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
            select={handleDateSelect}
            eventClick={handleEventClick}
            events={filteredEvents.map((e) => ({
              id: String(e.id),
              title: e.title,
              start: e.startTime,
              end: e.endTime,
              allDay: e.allDay,
              backgroundColor: e.color,
              borderColor: e.color,
              textColor: "#ffffff",
            }))}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            displayEventTime={false}
            eventDisplay="block"
            height="85vh"
          />
        </div>
      </section>

      {/* Event Modal */}
      <EventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEvent}
        selectedDate={selectedDate}
        selectedStartISO={selectedStartISO ?? undefined}
        selectedEndISO={selectedEndISO ?? undefined}
        eventToEdit={selectedEvent}
        onDelete={() => {
          if (selectedEvent?.id) handleDeleteEvent(selectedEvent.id);
        }}
      />
    </main>
  );
}
