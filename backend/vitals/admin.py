from django.contrib import admin
from .models import UserProfile, DoctorPatient, PatientVital

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'access_key', 'patient_id')
    list_filter = ('role', 'user__date_joined')
    search_fields = ('user__username', 'user__email', 'access_key', 'patient_id')
    readonly_fields = ('user', 'access_key')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'role', 'patient_id')
        }),
        ('Security', {
            'fields': ('access_key',),
            'description': 'Patient access key for doctor authentication'
        }),
    )
    
    def has_add_permission(self, request):
        # Prevent direct creation from admin; use registration endpoint instead
        return False

class DoctorPatientAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'id')
    list_filter = ('doctor__userprofile__role',)
    search_fields = ('doctor__username', 'patient__username')
    readonly_fields = ('doctor', 'patient')

class PatientVitalAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'timestamp', 'heart_rate', 'spo2', 'body_temperature')
    list_filter = ('timestamp', 'patient_id')
    search_fields = ('patient_id',)
    readonly_fields = ('record_hash', 'blockchain_tx')

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(DoctorPatient, DoctorPatientAdmin)
admin.site.register(PatientVital, PatientVitalAdmin)