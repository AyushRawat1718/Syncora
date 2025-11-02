# 🗓️ Syncora — Smart Event Scheduling Platform

**Syncora** is a modern, fully interactive event scheduling platform inspired by _Google Calendar_.  
Built using **Next.js**, **PostgreSQL**, and **FullCalendar**, it allows users to seamlessly create, edit, and delete events with real-time updates and persistent storage.

---

## 🚀 Tech Stack

### 💻 Frontend

- **Next.js 16 (App Router)** — Modern React framework for building the UI
- **FullCalendar** — Interactive and dynamic calendar view
- **TypeScript + TailwindCSS** — Clean, responsive, and maintainable styling
- **Axios** — Handles API requests between frontend and backend

### 🧠 Backend

- **Express.js** — RESTful API server
- **Prisma ORM** — Simplified database management and schema migrations
- **PostgreSQL** — Persistent data storage for events

---

## ⚙️ Core Features

### ✅ Create, Edit, and Delete Events

- Easily add, modify, or remove events using an intuitive modal interface
- Choose event **title**, **description**, **category**, **color**, and **time range**

### ✅ Interactive Calendar View

- Built using **FullCalendar** with **Month**, **Week**, and **Day** modes
- Click or drag to create events directly on the calendar grid

### ✅ Upcoming Events Sidebar

- Displays **next 3 days** of upcoming events
- Click any listed event to edit it instantly

### ✅ Event Filtering

- Filter events by category: **Meeting**, **Task**, or **Reminder**
- Toggle categories dynamically without reloading the page

### ✅ Modern & Responsive UI

- Sleek, minimal design powered by TailwindCSS
- Sidebar with quick access to filters and upcoming events
- Header greeting: _“Hey 👋 Stay organized with Syncora”_

---

## 🧾 Database Integration

- All event data is stored persistently in **PostgreSQL** via **Prisma ORM**
- Events table includes fields for:
  - `id`, `title`, `description`, `category`
  - `startTime`, `endTime`, `color`, and `allDay`

---

## 📸 Demo Workflow

1. Launch the app (`npm run dev`)
2. View your calendar in month/week/day format
3. Add or edit events directly from the calendar or sidebar
4. Check your PostgreSQL database to verify persisted events

---

## Screenshots

![image alt](https://github.com/AyushRawat1718/Syncora/blob/master/frontend/public/Screenshots/SS_1.png)

![image alt](https://github.com/AyushRawat1718/Syncora/blob/master/frontend/public/Screenshots/SS_2.png)

![image alt](https://github.com/AyushRawat1718/Syncora/blob/master/frontend/public/Screenshots/SS_3.png)

---

##📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AyushRawat1718/Syncora.git
cd Syncora
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` and add:

```bash
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/syncora"
```

Then run Prisma migrations and start the server:

```bash
npx prisma migrate dev --name init
npm run dev
```

🟢 Backend runs on `http://localhost:5000`

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `/frontend` and add:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then start the frontend server:

```bash
npm run dev
```

🟢 Frontend runs on `http://localhost:3000`

---

## 📁 Project Structure
The project is organized into frontend and backend directories for clarity and modularity.
```bash
Syncora/
├── backend/                  # Express + Prisma + PostgreSQL backend
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema definition
│   ├── routes/
│   │   └── events.ts         # Event CRUD API routes
│   ├── index.ts              # Main Express server entry
│   ├── package.json
│   └── .env                  # Backend environment variables
│
├── frontend/                 # Next.js + Tailwind + FullCalendar frontend
│   ├── app/
│   │   ├── page.tsx          # Main calendar page
│   │   ├── components/
│   │   │   ├── EventModal.tsx   # Modal for creating/editing events
│   │   │   ├── Sidebar.tsx      # Upcoming events & filters
│   │   │   └── CalendarView.tsx # FullCalendar integration
│   ├── components/ui/        # Reusable UI components
│   ├── lib/
│   │   └── utils.ts          # API & helper utilities
│   ├── public/
│   │   └── Screenshots/      # App screenshots
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   └── .env                  # Frontend environment variables
│
├── README.md
```

## ✨ Credits

- Developed by **Ayush Rawat**

- Inspired by Google Calendar — built for simplicity, clarity, and performance.

Info about installation, project structure, env info in backend - >
