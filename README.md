# Student Management System - Django

A Django-based student management system built for managing student records, authentication, analytics, CSV import/export, and AI-powered student support.

> **Note:** This project is currently not publicly hosted. It can be run locally by following the setup instructions below. Screenshots and a demo video can be added to preview the project features.

## Features

- User authentication with login and signup
- Add, view, update, and delete student records
- Student details including name, roll number, course, email, phone, year, status, and notes
- Search, filter, sort, and pagination for student records
- Dashboard and analytics widgets
- CSV import/export support
- Role-based access for manager/admin actions
- Floating Student Support AI chatbot using Gemini API
- SQLite support for local development
- Supabase PostgreSQL support using `DATABASE_URL`
- Clean responsive UI with dark/light theme support

## Tech Stack

- Python
- Django
- SQLite / Supabase PostgreSQL
- HTML, CSS, JavaScript
- Gemini API
- Three.js

## Project Structure

```txt
student-management-system-django/
├── manage.py
├── requirements.txt
├── README.md
├── .env.example
├── .gitignore
├── student_portal/
├── students/
├── templates/
├── static/
└── screenshots/
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/student-management-system-django.git
cd student-management-system-django
```

### 2. Create and activate virtual environment

For Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

For macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create environment file

Copy `.env.example` to `.env`.

For Windows:

```bash
copy .env.example .env
```

For macOS/Linux:

```bash
cp .env.example .env
```

Then update the `.env` file with your own values.

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Create superuser

```bash
python manage.py createsuperuser
```

### 7. Start the development server

```bash
python manage.py runserver
```

Open:

```txt
http://127.0.0.1:8000/
```

## Environment Variables

Create a `.env` file using `.env.example`.

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=https://*.loca.lt

DATABASE_URL=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-live-preview
GEMINI_REST_MODEL=gemini-2.5-flash
```

## Database

By default, the project uses SQLite for local development.

To use Supabase PostgreSQL, add your Supabase pooled connection URL in `.env`:

```env
DATABASE_URL=your-supabase-postgres-url
```

If `DATABASE_URL` is empty, Django automatically uses SQLite.

## AI Student Support

This project includes a Student Support AI chatbot.

To enable it:

1. Get a Gemini API key.
2. Add it to `.env`.
3. Restart the Django server.

```env
GEMINI_API_KEY=your-gemini-api-key
```

The API key is handled server-side and should never be exposed in frontend JavaScript.

## Screenshots

Add screenshots inside the `screenshots/` folder.

Suggested screenshots:

- Home page
- Login/signup page
- Dashboard
- Student list
- Student details
- Add/edit student form
- CSV import/export
- AI support chat

## Security Notes

- Do not commit `.env`.
- Do not commit `db.sqlite3`.
- Do not hardcode API keys or database passwords.
- Use `.env.example` only for dummy placeholder values.

## Repository Topics

Recommended GitHub topics:

```txt
django
python
student-management-system
school-management-system
supabase
postgresql
sqlite
gemini-api
education
web-application
```

## Author

**Yuvrajjit Baruah**  
Diploma in Computer Science & Engineering  
RGIPT Sivasagar Campus
