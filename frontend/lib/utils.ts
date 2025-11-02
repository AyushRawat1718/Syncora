import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Merge Tailwind + conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Base API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
  getEvents: () => axios.get(`${BASE_URL}/events`),
  getUpcomingEvents: () => axios.get(`${BASE_URL}/events/upcoming`),
  createEvent: (data: any) => axios.post(`${BASE_URL}/events`, data),
  updateEvent: (id: string, data: any) =>
    axios.put(`${BASE_URL}/events/${id}`, data),
  deleteEvent: (id: string) => axios.delete(`${BASE_URL}/events/${id}`),
};

console.log("📡 API Request to:", `${BASE_URL}/events`);
