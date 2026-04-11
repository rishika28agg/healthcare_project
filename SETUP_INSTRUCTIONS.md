# Healthcare Project - Setup Instructions for Team

Follow these steps to run the project on your teammate's laptop.

## **Prerequisites**
- Python 3.9+ installed
- Node.js 16+ and npm installed
- Git installed
- A code editor (VS Code recommended)

---

## **Step 1: Clone the Repository**

```bash
cd Desktop  # or your preferred folder
git clone <repository-url>
cd healthcare_project
```

---

## **Step 2: Setup Backend (Django)**

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Install Dependencies
```bash
pip install -r requirements.txt
```

### 2.4 Apply Database Migrations
```bash
python manage.py migrate
```

### 2.5 Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
# Follow prompts to enter:
# - Username: admin
# - Email: admin@example.com
# - Password: (create a password)
```

### 2.6 Start Backend Server
```bash
python manage.py runserver
```
Backend will run at: `http://localhost:8000`

---

## **Step 3: Setup Frontend (React)**

### 3.1 Open New Terminal/Command Prompt

Keep the backend running in the first terminal!

### 3.2 Navigate to Frontend Directory
```bash
cd frontend
```

### 3.3 Install Dependencies
```bash
npm install
```

### 3.4 Create .env File
Create a file named `.env` in the `frontend` folder with:
```
VITE_API_URL=http://localhost:8000/api
```

### 3.5 Start Frontend Server
```bash
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## **Step 4: Access the Application**

1. **Frontend**: Open `http://localhost:5173` in your browser
2. **Django Admin**: Go to `http://localhost:8000/admin/`
   - Login with the superuser credentials you created

---

## **Step 5: Testing the Features**

### Register a Patient:
1. Go to Register page
2. Select "Patient" role
3. Enter:
   - Full Name
   - Username
   - Email
   - **Access Key** (create any key, e.g., "mykey123")
   - Password
4. Click Register

### Register a Doctor:
1. Go to Register page
2. Select "Doctor" role
3. Fill in details (no access key needed for doctors)
4. Click Register

### Assign Patient to Doctor:
1. Use Django admin (`http://localhost:8000/admin/`)
2. Go to "Doctor patients"
3. Click "Add Doctor patient"
4. Select doctor and patient, save

### View Patient Vitals (as Doctor):
1. Login as Doctor
2. Dashboard shows assigned patients
3. Click "View Vitals"
4. Enter patient's access key
5. View vitals data

### Manage Access Key (as Patient):
1. Login as Patient
2. Go to Settings
3. View/copy/change access key

---

## **Troubleshooting**

### Backend won't start
```bash
# Clear database and start fresh
python manage.py migrate --run-syncdb
python manage.py createsuperuser
python manage.py runserver
```

### Frontend dependencies issue
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Different port for backend
python manage.py runserver 8001

# Different port for frontend
npm run dev -- --port 5174
```

### Database locked error
```bash
# Delete database and recreate
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## **Project Structure**

```
healthcare_project/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3 (database)
│   ├── requirements.txt
│   ├── backend/ (Django settings)
│   └── vitals/ (main app)
│       ├── models.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── migrations/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/ (Register, Login, Dashboard, etc.)
│   │   ├── components/
│   │   └── utils/
│   └── vite.config.js
├── INTEGRATION.md
└── README.md
```

---

## **Key Endpoints**

### Authentication
- `POST /api/accounts/register/` - Register user
- `POST /api/accounts/login/` - Login

### Doctor Features
- `GET /api/doctor/patients/` - Get assigned patients
- `POST /api/doctor/patient/<patient_id>/vitals/` - View patient vitals (with access key)

### Patient Features
- `GET /api/patient/vitals/` - Get own vitals
- `GET /api/patient/access-key/` - Get access key
- `POST /api/patient/regenerate-access-key/` - Change access key

---

## **Git Workflow (Optional)**

```bash
# Create/switch to feature branch
git checkout -b feature/access-keys

# Make changes and commit
git add .
git commit -m "Add access key feature"

# Push to remote
git push origin feature/access-keys

# Create Pull Request on GitHub
```

---

**Everything is ready! Happy coding!** 🎉
