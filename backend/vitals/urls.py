from django.urls import path
from .views import get_patient_data, health_check
from .views import patient_view_self, doctor_view_patient
from .views import doctor_dashboard,doctor_login_page



urlpatterns = [
    path("health/", health_check),
    path("patient/<int:patient_id>/", get_patient_data),
    path("vitals/patient/", patient_view_self),
    path("vitals/doctor/<int:patient_id>/", doctor_view_patient),
    path("dashboard/doctor/", doctor_dashboard),
    path("login/doctor/", doctor_login_page),
]
from .views import verify_record

urlpatterns += [
    path("verify/<int:record_id>/", verify_record),
]

