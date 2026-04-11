from django.urls import path
from .views import get_patient_data, health_check
from .views import *
from .views import login, get_current_user, get_available_doctors, get_doctor_patients, get_patient_doctor, doctor_view_patient_vitals, get_patient_access_key, regenerate_access_key

urlpatterns = [
    path("health/", health_check),
    path("patient/<int:patient_id>/", get_patient_data),
    
    path("assign/", assign_doctor),

    path("patient/vitals/", patient_view_vitals),

    path("doctor/patient/", doctor_view_patient),
    
    # Authentication endpoints
    path("accounts/register/", register_user, name="register"),
    path("accounts/login/", login, name="login"),
    path("accounts/self/", get_current_user, name="get_current_user"),
    path("accounts/doctors/", get_available_doctors, name="get_doctors"),
    
    # Doctor endpoints
    path("doctor/patients/", get_doctor_patients, name="get_doctor_patients"),
    path("doctor/patient/<int:patient_id>/vitals/", doctor_view_patient_vitals, name="doctor_view_patient_vitals"),
    
    # Patient endpoints
    path("patient/doctor/", get_patient_doctor, name="get_patient_doctor"),
    path("patient/access-key/", get_patient_access_key, name="get_patient_access_key"),
    path("patient/regenerate-access-key/", regenerate_access_key, name="regenerate_access_key"),
]

from .views import verify_record

urlpatterns += [
    path("verify/<int:record_id>/", verify_record),
]

