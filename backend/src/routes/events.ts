import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 🟩 Color mapping by category
const categoryColors: Record<string, string> = {
  Meeting: "#1a73e8", // Blue
  Task: "#34a853", // Green
  Reminder: "#ea4335", // Red
};

// ✅ Fetch all events
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Create new event
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      startTime,
      endTime,
      color,
      category,
    } = req.body;

    if (!title || !startTime || !endTime || !eventType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventType,
        category: category || "Meeting",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        color: color || categoryColors[category] || "#3a87ad",
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🆕 ✅ Fetch upcoming events (within next 3 days)
router.get("/upcoming", async (req, res) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const upcomingEvents = await prisma.event.findMany({
      where: {
        startTime: {
          gte: now,
          lte: threeDaysLater,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    res.json(upcomingEvents);
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update an event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      eventType,
      startTime,
      endTime,
      color,
      category,
    } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        eventType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        color,
        category,
      },
    });

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Router
// ✅ Delete an event (robust + logging)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ DELETE request received for id:", id);

    // Try to find first (gives clearer error than direct delete)
    // handle numeric id or string id
    const numeric = !Number.isNaN(Number(id));
    const whereClause = numeric ? { id: Number(id) } : { id: id };

    const existing = await prisma.event.findUnique({
      where: whereClause as any,
    });
    if (!existing) {
      console.log("⚠️ Event not found for id:", id);
      return res.status(404).json({ error: "Event not found" });
    }

    await prisma.event.delete({ where: whereClause as any });
    console.log("✅ Deleted event id:", id);
    res.json({ message: "Event deleted successfully", id });
  } catch (err) {
    console.error("Error deleting event:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: String(err) });
  }
});

export default router;
