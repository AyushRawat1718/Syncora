import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------------------------------------------
✅ Utility: Merge Tailwind + Conditional Classes
------------------------------------------------------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------
✅ Dynamic API Base URL
- Uses NEXT_PUBLIC_API_URL in production
- Falls back to localhost in dev
- Automatically trims trailing slashes
------------------------------------------------------- */
const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api") + "/api";

console.log("🌍 Using API Base URL:", BASE_URL);

/* -------------------------------------------------------
✅ Axios Instance (centralized config)
- Easier to debug and modify later
------------------------------------------------------- */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // change to true if you add auth later
});

/* -------------------------------------------------------
✅ API Endpoints
------------------------------------------------------- */
export const api = {
  // 📅 Fetch all events
  getEvents: () => axiosInstance.get("/events"),

  // 🔔 Fetch upcoming events (safe fallback if missing)
  getUpcomingEvents: () =>
    axiosInstance.get("/events/upcoming").catch(() => ({ data: [] })),

  // ➕ Create new event
  createEvent: (data: any) => axiosInstance.post("/events", data),

  // ✏️ Update existing event
  updateEvent: (id: string, data: any) =>
    axiosInstance.put(`/events/${id}`, data),

  // ❌ Delete event
  deleteEvent: (id: string) => axiosInstance.delete(`/events/${id}`),
};

/* -------------------------------------------------------
✅ Export base URL (for debugging or external use)
------------------------------------------------------- */
export { BASE_URL };
