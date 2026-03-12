from django.contrib import admin
from .models import UserProfile, DoctorPatient, PatientVital

admin.site.register(UserProfile)
admin.site.register(DoctorPatient)
admin.site.register(PatientVital)