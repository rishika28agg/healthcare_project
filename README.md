# Healthcare Monitoring System

A comprehensive healthcare monitoring system with patient vital tracking, blockchain-based record verification, and doctor-patient management.

## Project Structure

```
healthcare_project/
├── backend/          # Django REST API
│   ├── backend/      # Django project settings
│   ├── vitals/       # Main app for vital records
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React frontend
    ├── src/
    ├── package.json
    ├── vite.config.js
    └── .env
```

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm 8+
- SQLite3 (included with Python)

## Backend Setup

### 1. Install Python Dependencies

Navigate to the backend directory:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Create Environment File

Create a `.env` file in the `backend` directory (optional, defaults are set):

```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Start Backend Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

### 1. Install npm Dependencies

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 2. Create Environment File

Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` or `http://localhost:3000` (depending on your Vite configuration)

## Running the Complete Application

### Terminal 1 (Backend):
```bash
cd backend
python manage.py runserver
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/accounts/login/` - User login (returns JWT token)
- `GET /api/accounts/self/` - Get current user info (requires authentication)

### Vitals Management
- `GET /api/patient/<patient_id>/` - Get patient vital records
- `POST /api/patient/<patient_id>/` - Add vital record for patient
- `GET /api/vitals/patient/` - Get authenticated patient's vitals
- `GET /api/vitals/doctor/<patient_id>/` - Get doctor's patient vitals

### Record Verification
- `GET /api/verify/<record_id>/` - Verify blockchain integrity of a record

### User Management
- `POST /api/register/` - Register new user
- `POST /api/assign/` - Assign doctor to patient

## Features

- **User Authentication**: JWT-based authentication for secure login
- **Patient Management**: Track patient vital signs (heart rate, SPO2, temperature)
- **Doctor Dashboard**: View assigned patients' vital records
- **Patient Dashboard**: View personal vital records
- **Blockchain Verification**: Verify record integrity using blockchain
- **CORS Enabled**: Frontend-backend communication enabled
- **Responsive Design**: Tailwind CSS for responsive UI

## Frontend Pages

- `/` - Landing page
- `/login` - Login page (doctors/patients)
- `/register` - User registration
- `/dashboard/doctor` - Doctor dashboard (requires authentication)
- `/dashboard/patient` - Patient dashboard (requires authentication)
- `/settings` - User settings

## Database Models

### UserProfile
- Stores user roles (doctor/patient)
- Unique access keys for user identification
- Patient ID reference

### DoctorPatient
- Relationship between doctors and patients
- Tracks which doctor can view which patient's records

### PatientVital
- Stores vital signs (heart rate, SPO2, body temperature)
- Record timestamps
- Blockchain hash for verification
- Blockchain transaction ID

## Build Frontend for Production

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Troubleshooting

### CORS Issues
- Ensure `django-cors-headers` is installed and properly configured
- Check that frontend URL is in `CORS_ALLOWED_ORIGINS` in `backend/settings.py`

### Database Issues
- If migrations fail, delete `db.sqlite3` (will lose data) and run `python manage.py migrate` again

### Port Already in Use
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Vite will automatically use next available port

### JWT Token Expired
- Tokens expire after 24 hours by default
- User must login again to get a new token

## Development Tips

- **Hot reload**: Both frontend and backend support hot reloading during development
- **Debug mode**: Backend has `DEBUG=True` for detailed error messages
- **API testing**: Use `/api/health/` endpoint to test backend connectivity

## Security Notes

⚠️ **Important**: This is a development setup. For production:

1. Set `DEBUG=False` in settings.py
2. Generate a new `SECRET_KEY`
3. Configure proper `ALLOWED_HOSTS`
4. Use environment variables for sensitive data
5. Set up HTTPS
6. Restrict `CORS_ALLOWED_ORIGINS` to specific domains

## Support

For issues or questions, check the logs in the terminal where the server is running.
