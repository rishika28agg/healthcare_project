from django.urls import path
from .views import get_patient_data, health_check
from .views import *

urlpatterns = [
    path("health/", health_check),
    path("patient/<int:patient_id>/", get_patient_data),
    path("register/", register_user),

    path("assign/", assign_doctor),

    path("patient/vitals/", patient_view_vitals),

    path("doctor/patient/", doctor_view_patient),
]

from .views import verify_record

urlpatterns += [
    path("verify/<int:record_id>/", verify_record),
]

