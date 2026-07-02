# 🎓 Semester Sync

> A modern full-stack academic companion that helps students manage their semester by tracking attendance, assessments, and academic progress in one place.

🌐 **Live Demo:** https://semestersync.vercel.app

---

## 📖 Overview

Semester Sync is a full-stack web application built to simplify semester management for students.

The idea started as a simple attendance tracker, but gradually evolved into a complete academic dashboard with authentication, subject management, assessment tracking, and real-time progress insights.

The application focuses on providing a clean user experience while maintaining secure authentication, efficient data handling, and responsive performance across desktop and mobile devices.

---

## ✨ Features

### 📚 Subject Management
- Create new subjects
- Edit existing subjects
- Delete subjects
- Store subject credits
- Track total classes

### ✅ Attendance Tracking
- Mark Present/Absent
- Attendance history
- Live attendance percentage
- Classes required to reach attendance targets

### 📝 Assessment Management
- Create assessments
- Edit assessments
- Delete assessments
- Track obtained marks
- Maximum marks validation
- Weightage support

### 📊 Dashboard
- Subject overview
- Attendance summary
- Assessment statistics
- Semester progress

### 🔐 Authentication
- Email & Password Login
- Google OAuth Login
- Secure Sessions
- Forgot Password
- Password Reset via Email

### 📱 Responsive Design
- Optimized for Desktop
- Tablet Support
- Mobile Friendly
- Installable as a Progressive Web App (PWA)

---

# 🛠 Tech Stack

## Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Query
- Zod
- Lucide React
- Sonner

## Backend

- Next.js Route Handlers
- Better Auth
- Drizzle ORM
- PostgreSQL (Neon)

## Other Services

- Google OAuth
- Resend Email API
- Vercel Deployment

---

# 📸 Screenshots

> *(Add screenshots here)*

## Dashboard

![Dashboard](./screenshots/dashboard.png)

---

## Subject Page

![Subject](./screenshots/subject.png)

---

## Attendance

![Attendance](./screenshots/attendance.png)

---

## Assessments

![Assessment](./screenshots/assessment.png)

---

## Login

![Login](./screenshots/login.png)

---

# 🚀 Live Demo

https://semestersync.vercel.app

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/semester-sync.git
```

Go into the project

```bash
cd semester-sync
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE_URL=

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=
```

Run the development server

```bash
npm run dev
```

---

# 📂 Project Structure

```
app/
components/
db/
lib/
services/
public/
hooks/
```

---

# 🧠 What I Learned

Building Semester Sync gave me hands-on experience with:

- Building a full-stack application using Next.js
- Authentication using Better Auth
- Google OAuth integration
- Password reset flows
- Relational database design
- PostgreSQL with Drizzle ORM
- API development
- Form validation using React Hook Form + Zod
- Query caching using TanStack Query
- Optimistic UI updates
- Deployment using Vercel
- Building an installable Progressive Web App

---

# 🚧 Challenges Faced

Some interesting problems solved during development:

- Login redirect race conditions
- Query invalidation after CRUD operations
- React component re-render issues
- Browser validation vs Zod validation
- Case-insensitive uniqueness validation
- Google OAuth configuration
- Password reset flow
- Responsive UI improvements
- Production deployment debugging

---

# 🔮 Future Improvements

- 🎯 Grade Planner
- 📈 CGPA Predictor
- 📅 Assignment Tracker
- 🔔 Push Notifications
- 📊 Analytics & Charts
- 📄 Export Reports
- 📅 Timetable Management

---

# 🤝 Contributing

Contributions, suggestions, and feedback are always welcome!

Feel free to fork the repository and submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Tirth Patel**

LinkedIn:
https://linkedin.com/in/YOUR_LINKEDIN

GitHub:
https://github.com/YOUR_GITHUB
