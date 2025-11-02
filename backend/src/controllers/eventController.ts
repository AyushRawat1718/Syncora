// src/controllers/eventController.ts
import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      allDay,
      color,
      recurrenceRule,
    } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        allDay,
        color,
        recurrenceRule,
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startTime,
      endTime,
      allDay,
      color,
      recurrenceRule,
    } = req.body;
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        allDay,
        color,
        recurrenceRule,
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id: Number(id) } });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};
