# Healthcare Frontend

React + Vite frontend for the Healthcare Monitoring System.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env file
```bash
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Pages

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard/patient` - Patient health dashboard
- `/dashboard/doctor` - Doctor patient management dashboard
- `/settings` - Account settings

## Features

- **Authentication**: JWT-based login/register
- **Patient Dashboard**: View personal vitals history
- **Doctor Dashboard**: Manage assigned patients
- **Real-time API Integration**: Connected to Django backend
- **Responsive Design**: Tailwind CSS styling
- **Role-based Routing**: Different dashboards for patients and doctors
