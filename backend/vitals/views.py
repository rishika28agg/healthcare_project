from rest_framework.decorators import api_view
from rest_framework.response import Response
from vitals.models import PatientVital
from django.contrib.auth.models import User

from .models import UserProfile, DoctorPatient, PatientVital

@api_view(["GET"])
def get_patient_data(request, patient_id):
    records = PatientVital.objects.filter(patient_id=patient_id).order_by("timestamp")

    data = []
    for r in records:
        data.append({
            "timestamp": r.timestamp,
            "heart_rate": r.heart_rate,
            "spo2": r.spo2,
            "body_temperature": r.body_temperature
        })

    return Response(data)

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def health_check(request):
    return Response({"status": "Backend running"})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PatientVital
from vitals.services.verify_integrity import verify_record_integrity
from vitals.blockchain import contract

@api_view(["GET"])
def verify_record(request, record_id):
    try:
        record = PatientVital.objects.get(id=record_id)

        db_hash = record.record_hash
        blockchain_hash = contract.functions.getRecordHash(
            str(record.id)
        ).call()

        integrity = verify_record_integrity(str(record.id), db_hash)

        return Response({
            "record_id": record.id,
            "db_hash": db_hash,
            "blockchain_hash": blockchain_hash,
            "integrity": integrity
        })

    except PatientVital.DoesNotExist:
        return Response(
            {"error": "Record not found"},
            status=404
        )
@api_view(["POST"])
def register_user(request):

    username = request.data["username"]
    password = request.data["password"]
    role = request.data["role"]

    user = User.objects.create_user(
        username=username,
        password=password
    )

    profile = UserProfile.objects.create(
        user=user,
        role=role
    )

    return Response({
        "message": "User registered",
        "access_key": profile.access_key
    })

@api_view(["POST"])
def assign_doctor(request):

    doctor_id = request.data["doctor_id"]
    patient_id = request.data["patient_id"]

    DoctorPatient.objects.create(
        doctor_id=doctor_id,
        patient_id=patient_id
    )

    return Response({"message": "Doctor assigned"})

@api_view(["POST"])
def patient_view_vitals(request):

    access_key = request.data.get("access_key")

    profile = UserProfile.objects.get(access_key=access_key)

    if profile.role != "patient":
        return Response({"error": "Not a patient"}, status=403)

    records = PatientVital.objects.filter(
        patient_id=profile.patient_id
    ).order_by("-timestamp")[:20]

    data = []

    for r in records:
        data.append({
            "timestamp": r.timestamp,
            "heart_rate": r.heart_rate,
            "spo2": r.spo2,
            "body_temperature": r.body_temperature
        })

    return Response(data)

@api_view(["POST"])
def doctor_view_patient(request):

    doctor = request.user
    patient_key = request.data.get("access_key")

    profile = UserProfile.objects.get(access_key=patient_key)

    patient = profile.user

    assigned = DoctorPatient.objects.filter(
        doctor=doctor,
        patient=patient
    ).exists()

    if not assigned:
        return Response({"error": "Doctor not assigned"}, status=403)

    records = PatientVital.objects.filter(
        patient_id=profile.patient_id
    ).order_by("timestamp")

    data = []

    for r in records:
        data.append({
            "timestamp": r.timestamp,
            "heart_rate": r.heart_rate,
            "spo2": r.spo2,
            "body_temperature": r.body_temperature
        })

    return Response(data)
