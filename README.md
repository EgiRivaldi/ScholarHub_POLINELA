# ScholarHub POLINELA

**ScholarHub POLINELA** is a premium, centralized web portal designed to help students at Politeknik Negeri Lampung browse, filter, search, and manage scholarship opportunities in a unified portal. The platform features a beautiful, state-of-the-art **Midnight Night Sky** dark theme and smooth glassmorphic interface elements.

---

## Features

- **Scholarship Finder**: Fast search and category filters to browse scholarship openings.
- **Requirement Matrix**: Review min GPA, min semester, and documents requirement at a glance.
- **Official Portal Redirection**: Links directly to the official provider registration forms.
- **Admin Dashboard**: Manage scholarships, categories, providers, requirements, and administrators.
- **Secure Sessions**: Protected admin access using HTTP-only session verification.
- **Optimized Performance**: Code splitting and lazy loading of route chunks.

---

## Technology Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4 & Custom Glassmorphic Utilities
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Toasts**: Sonner

### Backend
- **Framework**: Node.js & Express
- **Database**: MySQL (via `mysql2/promise`)
- **Authentication**: Custom session verification
- **File Upload**: Multer middleware

---

## Folder Structure

```text
ScholarHub_POLINELA/
├── backend/                  # Node.js/Express Backend App
│   ├── config/               # Database configurations and schemas
│   │   ├── database.js
│   │   ├── schema.sql
│   │   └── seeder.js
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Auth, file upload & request validation
│   ├── models/               # MySQL queries (Model Layer)
│   ├── routes/               # API endpoint router definitions
│   ├── uploads/              # Uploaded images and logos
│   ├── utils/                # Helper files (logger, validators)
│   ├── server.js             # Server entrypoint
│   └── package.json
│
├── frontend/                 # Vite/React Frontend App
│   ├── public/               # Public assets
│   ├── src/                  # React Source Code
│   │   ├── assets/           # Icons and illustrations
│   │   ├── components/       # Reusable layouts, admin, and public cards
│   │   ├── hooks/            # Custom React hooks (useDebounce, etc.)
│   │   ├── lib/              # Styling utilities
│   │   ├── pages/            # View Pages (Public/Admin/Errors)
│   │   ├── services/         # Axios API client integrations
│   │   ├── App.jsx           # App routing with lazy loading
│   │   ├── main.jsx          # Entrypoint
│   │   └── index.css         # Custom SaaS design styling and glassmorphism
│   ├── vite.config.js
│   └── package.json
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- XAMPP / WampServer (with MySQL running on port 3306)

### Database Setup
1. Open phpMyAdmin or your MySQL client.
2. Create a new database named `scholarhub_polinela` with collation `utf8mb4_general_ci`.
3. Import the tables by executing the SQL statements inside `backend/config/schema.sql`.
4. Run the seeder script to populate default categories, providers, and admin account:
   ```bash
   cd backend
   node config/seeder.js
   ```

### Environment Variables
Create a `.env` file inside the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=scholarhub_polinela
SESSION_SECRET=scholarhub_secret_key_123!
```

---

## Running the Application

### 1. Run Backend Server
```bash
cd backend
npm install
npm run dev
```
The API server will run at `http://localhost:5000`.

### 2. Run Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
The dev server will run at `http://localhost:5173`. Open this URL in your web browser.

---

## Admin Credentials
To access the admin dashboard, login with the default seeder credentials:
- **Username**: `admin`
- **Password**: `password123`

---

## Future Improvements
- **Automatic Deadlines**: Add background cron jobs to archive scholarships automatically on deadline expiration.
- **Multilingual Support**: Support toggle between Indonesian and English languages.
- **Notification Subscriptions**: Allow students to subscribe to email alerts for new scholarship releases.
