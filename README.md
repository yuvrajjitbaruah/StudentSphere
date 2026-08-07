# 🎓 StudentSphere

> Modern Student Management Platform with AI-Powered Assistance

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Django](https://img.shields.io/badge/Django-4.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)

---

## 📖 About StudentSphere

StudentSphere is a modern student management platform built with Django that helps educational institutions efficiently manage student records, attendance, assignments, grading, announcements, messaging, support tickets, analytics, and AI-powered assistance — all in one place.

The platform provides a clean, role-aware interface: faculty and managers get administrative tools (records, grading, bulk actions, broadcasts), while students get a self-service view of their own attendance, submissions, and report card.

---

## 🆕 What's New in This Update

The original repository shipped with a set of models, forms, and views for attendance, skills, extracurriculars, assignments & grading, announcements, direct messaging, and support tickets — but they weren't wired up to any URL or template, so none of it was reachable in the app. This update completes and extends that work:

- **Wired up 13 previously-unused views** (`attendance_tracking`, `student_skill_records`, `extracurricular_records`, `assignment_list`, `assignment_create`, `assignment_submit`, `submission_grade`, `publish_results`, `report_card_view`, `announcement_list_create`, `chat_room`, `ticket_list_create`, `ticket_detail`) with new routes in `students/urls.py`.
- **Built 13 new templates** for those views, matching the existing glassmorphism design system (`assignment_list.html`, `assignment_form.html`, `assignment_submit.html`, `submission_grade.html`, `publish_results.html`, `report_card.html`, `announcements.html`, `chat_room.html`, `tickets.html`, `ticket_detail.html`, `attendance_form.html`, `skill_form.html`, `extracurricular_form.html`).
- **Fixed a latent crash**: marking attendance twice for the same student on the same date used to raise an `IntegrityError` against the `(student, date)` unique constraint. Attendance marking now uses `update_or_create`, so re-marking a date safely updates the existing record.
- **Added attendance % and average-grade widgets** to the student detail page (present/late/absent breakdown, attendance percentage, and average of published grades), computed server-side.
- **Added CSV export for assignment submissions & grades** (`/assignments/submissions/export/csv/`) for faculty record-keeping, alongside the existing student and activity-log CSV exports.
- **Expanded the main navigation** so every logged-in user can reach Assignments, Report Card, Announcements, Messages, and Support directly from the header.
- **Full Wiki documentation** (`/wiki`) covering setup, architecture, roles/permissions, and the API — ready to paste into the GitHub Wiki tab.

See [`wiki/Changelog.md`](wiki/Changelog.md) for the itemised list of every file touched.

---

## ✨ Features

### Core
- 🔐 Secure authentication (login, signup, role groups: student / faculty / manager / department head)
- 👨‍🎓 Student records management — add, edit, delete, duplicate
- 📊 Dashboard with live analytics: totals, course/year distribution, email domains, data completeness
- 🔍 Advanced search & filtering (typo-tolerant fallback search, saved filter presets)
- 📥📤 CSV import/export for students, activity log, and assignment submissions
- 🗂️ Bulk actions — bulk delete, bulk status update
- 🧾 Full activity/audit timeline

### Academic workflow *(newly wired up)*
- 🗓️ **Attendance tracking** — mark present/absent/late per date, with live attendance % on the student profile
- 🧠 **Skill records** — tag students with skills and proficiency levels
- 🏅 **Extracurricular records** — log activities, roles, and achievements
- 📚 **Assignments** — faculty upload assignments with attachments, matched to students by course/year
- 📝 **Submissions & grading** — students submit files or text answers; faculty grade and leave feedback
- 📢 **Publish results** — faculty publish graded submissions in bulk; students see them on their **Report Card** with a computed average

### Communication *(newly wired up)*
- 📣 **Announcements** — faculty broadcast posts, optionally by email and/or SMS
- 💬 **Direct messaging** — simple inbox between any two users
- 🎫 **Support tickets** — students raise tickets, faculty reply and manage status (open/in-progress/closed)

### AI & platform
- 🤖 AI-powered Student Support Chatbot (Gemini) — answers general questions and live portal/student-record queries
- 📱 Responsive UI with custom cursor and animated hero
- 🗄️ PostgreSQL / Supabase support
- ⚡ Fast Django backend

---

## 👥 Roles & Permissions

| Capability | Student | Faculty | Manager / Admin |
|---|:---:|:---:|:---:|
| View dashboard & own report card | ✅ | ✅ | ✅ |
| Submit assignments | ✅ | – | – |
| Raise support tickets | ✅ | ✅ | ✅ |
| Add/edit students | – | ✅ | ✅ |
| Mark attendance, skills, extracurriculars | – | ✅ | ✅ |
| Grade & publish results | – | ✅ | ✅ |
| Post announcements | – | ✅ | ✅ |
| Bulk delete / bulk status update | – | – | ✅ |
| View analytics API | – | ✅ | ✅ |

Roles are assigned via Django Groups (`faculty`, `manager`, `department_head`); new signups default to the `student` group.

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](screenshots/home-page.png)

The landing page of StudentSphere providing quick access to student management features and AI-powered tools.

---

### 📊 Dashboard
![Dashboard](screenshots/dashboard.png)

A centralized dashboard displaying student information, statistics, and quick actions.

---

### ➕ Add Student
![Add Student](screenshots/add-student.png)

Simple and intuitive interface for adding and managing student records.

---

### 📈 Analytics
![Analytics](screenshots/analytics.png)

Visual insights and analytics to help track student data effectively.

---

### 🤖 AI Chatbot
![AI Chatbot](screenshots/ai-chatbot.png)

AI-powered assistant integrated into StudentSphere for student support and guidance.

---

### 💬 AI Chatbot (Clear View)
![AI Chatbot Clear View](screenshots/ai-chatbot-clearview.png)

Expanded chatbot interface for enhanced interaction and readability.

---

### ✨ AI Studio Integration
![AI Studio](screenshots/ai-studio.png)

Demonstration of Gemini AI integration and intelligent assistance features.

> New pages (Assignments, Report Card, Announcements, Messages, Support) don't have screenshots yet — feel free to add them here once you've captured your own.

---

## 🛠️ Tech Stack

### Backend
- Python
- Django

### Database
- PostgreSQL
- Supabase

### Frontend
- HTML
- CSS
- JavaScript

### AI Integration
- Google Gemini API

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yuvrajjitbaruah/StudentSphere.git
cd StudentSphere
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file using `.env.example`.

Example:

```env
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_api_key
```

### Run Database Migrations

```bash
python manage.py migrate
```

### Start Development Server

```bash
python manage.py runserver
```

Open:

```txt
http://127.0.0.1:8000
```

---

## 🗺️ Key Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/dashboard/` | Student list, search/filter, analytics widgets |
| `/students/<id>/` | Student profile — attendance %, skills, extracurriculars, submissions |
| `/assignments/` | Assignment list & submissions (role-aware) |
| `/assignments/publish-results/` | Faculty: publish graded submissions |
| `/report-card/` | Student's published grades & average |
| `/announcements/` | Announcement feed + faculty post form |
| `/chat/` | Direct messaging inbox |
| `/tickets/` | Support ticket list & thread |
| `/api/students/`, `/api/analytics/` | JSON endpoints |
| `/api/support-chat/` | AI support chatbot endpoint |

Full route list lives in [`students/urls.py`](students/urls.py); see [`wiki/API-Reference.md`](wiki/API-Reference.md) for details.

---

## 🤖 AI Chatbot Configuration

To enable AI chatbot functionality:

1. Create a Gemini API key from Google AI Studio.
2. Add the key to your `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Without a valid API key, the chatbot will remain disabled.

---

## 📖 Documentation

Detailed docs live in [`/wiki`](wiki/Home.md) (mirrors the GitHub Wiki):

- [Home](wiki/Home.md)
- [Getting Started](wiki/Getting-Started.md)
- [Architecture](wiki/Architecture.md)
- [Roles & Permissions](wiki/Roles-and-Permissions.md)
- [Features Guide](wiki/Features-Guide.md)
- [API Reference](wiki/API-Reference.md)
- [AI Support Chatbot](wiki/AI-Support-Chatbot.md)
- [Contributing](wiki/Contributing.md)
- [Changelog](wiki/Changelog.md)
- [FAQ & Troubleshooting](wiki/FAQ-Troubleshooting.md)

---

## 📬 Feedback & Suggestions

For suggestions, bug reports, feature requests, or collaboration opportunities:

📧 **dev.yuvrajjitbaruah@gmail.com**

---

## 🌐 Connect With Me

### LinkedIn
https://www.linkedin.com/in/yuvrajjitbaruah/

### GitHub
https://github.com/yuvrajjitbaruah

### Linktree
https://linktr.ee/yuvrajjitbaruah

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

---

## 👨‍💻 Developer

**Yuvrajjit Baruah**

Computer Science & Engineering Student
AI & Cloud Computing Enthusiast

---

© 2026 Yuvrajjit Baruah. All Rights Reserved.
