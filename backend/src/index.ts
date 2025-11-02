import express from "express";
import cors from "cors";
import eventsRouter from "./routes/events"; // <-- Make sure path matches

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/events", eventsRouter); // <-- This is CRUCIAL

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
