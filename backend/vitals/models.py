from django.db import models
from django.contrib.auth.models import User
import secrets


class PatientVital(models.Model):

    patient_id = models.IntegerField()
    heart_rate = models.IntegerField()
    spo2 = models.IntegerField()
    body_temperature = models.FloatField()
    timestamp = models.DateTimeField()

    record_hash = models.CharField(max_length=66, null=True, blank=True)

    blockchain_tx = models.CharField(
        max_length=66,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Patient {self.patient_id} @ {self.timestamp}"


class UserProfile(models.Model):

    ROLE_CHOICES = (
        ("doctor", "Doctor"),
        ("patient", "Patient"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    access_key = models.CharField(max_length=32, unique=True)

    patient_id = models.IntegerField(null=True, blank=True)   # ADD THIS

    def save(self, *args, **kwargs):
        if not self.access_key:
            self.access_key = secrets.token_hex(8)
        super().save(*args, **kwargs)

class DoctorPatient(models.Model):

    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="doctor_patients"
    )

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="patient_doctors"
    )

    def __str__(self):
        return f"{self.doctor} → {self.patient}"