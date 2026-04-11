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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    try:
        username = request.data.get("username")
        email = request.data.get("email", "")
        password = request.data.get("password")
        role = request.data.get("role", "PATIENT").lower()
        first_name = request.data.get("first_name", "")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=400
            )

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name
        )

        # Create user profile with role
        patient_id = None
        access_key = None
        
        if role == "patient":
            patient_id = user.id
            access_key = request.data.get("access_key", "").strip()
            
            if not access_key:
                user.delete()
                return Response(
                    {"error": "Access key is required for patients"},
                    status=400
                )
            
            # Check if access key is already taken
            if UserProfile.objects.filter(access_key=access_key).exists():
                user.delete()
                return Response(
                    {"error": "This access key is already in use. Please choose a different one."},
                    status=400
                )
        
        profile = UserProfile.objects.create(
            user=user,
            role=role,
            patient_id=patient_id,
            access_key=access_key if role == "patient" else None
        )

        return Response({
            "message": "User registered successfully",
            "user_id": user.id,
            "username": user.username,
            "role": role,
            "patient_id": patient_id,
            "access_key": profile.access_key if role == "patient" else None,
        }, status=201)
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=400
        )

@api_view(["POST"])
def assign_doctor(request):

    doctor_id = request.data["doctor_id"]
    patient_id = request.data["patient_id"]

    DoctorPatient.objects.create(
        doctor_id=doctor_id,
        patient_id=patient_id
    )

    return Response({"message": "Doctor assigned"})

@api_view(["GET"])
def patient_view_vitals(request):
    """Get current patient's vitals using JWT authentication"""
    if not request.user.is_authenticated:
        return Response({"error": "Not authenticated"}, status=401)
    
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != "patient":
            return Response({"error": "Not a patient"}, status=403)
        
        # If patient_id is not set, use the user's ID as patient_id
        patient_id = profile.patient_id or request.user.id
        
        records = PatientVital.objects.filter(
            patient_id=patient_id
        ).order_by("-timestamp")[:20]
        
        data = []
        for r in records:
            data.append({
                "id": r.id,
                "timestamp": r.timestamp,
                "heart_rate": r.heart_rate,
                "spo2": r.spo2,
                "body_temperature": r.body_temperature,
                "record_hash": r.record_hash,
                "blockchain_tx": r.blockchain_tx
            })
        
        return Response(data)
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=404)

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


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login endpoint that returns JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=400
        )
    
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=401
        )
    
    refresh = RefreshToken.for_user(user)
    
    # Get user profile to determine role
    try:
        profile = UserProfile.objects.get(user=user)
        role = profile.role.upper()
    except UserProfile.DoesNotExist:
        role = 'USER'
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'role': role,
        'user_id': user.id,
        'username': user.username,
        'patient_id': profile.patient_id if profile else None
    })


@api_view(['GET'])
def get_current_user(request):
    """Get current user information"""
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated'},
            status=401
        )
    
    user = request.user
    try:
        profile = UserProfile.objects.get(user=user)
        role = profile.role.upper()
        patient_id = profile.patient_id
    except UserProfile.DoesNotExist:
        role = 'USER'
        profile = None
        patient_id = None
    
    return Response({
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role,
        'patient_id': patient_id
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_doctors(request):
    """Get all registered doctors"""
    try:
        doctors = UserProfile.objects.filter(role='doctor').select_related('user')
        data = []
        for profile in doctors:
            data.append({
                'id': profile.user.id,
                'username': profile.user.username,
                'name': profile.user.first_name or profile.user.username,
                'email': profile.user.email,
            })
        return Response(data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


@api_view(['GET'])
def get_doctor_patients(request):
    """Get all patients assigned to the logged-in doctor"""
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated'},
            status=401
        )
    
    try:
        # Get all DoctorPatient relationships where this user is the doctor
        doctor_patients = DoctorPatient.objects.filter(
            doctor=request.user
        ).select_related('patient', 'patient__userprofile')
        
        data = []
        for dp in doctor_patients:
            patient_user = dp.patient
            try:
                patient_profile = UserProfile.objects.get(user=patient_user)
            except UserProfile.DoesNotExist:
                patient_profile = None
            
            data.append({
                'id': patient_user.id,
                'username': patient_user.username,
                'name': patient_user.first_name or patient_user.username,
                'email': patient_user.email,
                'patient_id': patient_profile.patient_id if patient_profile else None,
                'assigned_at': dp.created_at if hasattr(dp, 'created_at') else None
            })
        
        return Response(data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


@api_view(['GET'])
def get_patient_doctor(request):
    """Get the assigned doctor for the logged-in patient"""
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated'},
            status=401
        )
    
    try:
        # Get the DoctorPatient relationship for this patient
        doctor_patient = DoctorPatient.objects.filter(
            patient=request.user
        ).select_related('doctor').first()
        
        if not doctor_patient:
            return Response({'doctor': None})
        
        doctor = doctor_patient.doctor
        return Response({
            'id': doctor.id,
            'username': doctor.username,
            'name': doctor.first_name or doctor.username,
            'email': doctor.email,
            'assigned_at': doctor_patient.created_at if hasattr(doctor_patient, 'created_at') else None
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


@api_view(['POST'])
def doctor_view_patient_vitals(request, patient_id):
    """Allow doctor to view vitals of assigned patient with access key"""
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated'},
            status=401
        )
    
    # Get access key from request
    access_key = request.data.get('access_key')
    if not access_key:
        return Response(
            {'error': 'Access key is required'},
            status=400
        )
    
    try:
        # Verify the access key matches the patient
        patient_profile = UserProfile.objects.get(
            patient_id=patient_id,
            access_key=access_key
        )
        
        # Verify the doctor is assigned to this patient
        doctor_patient = DoctorPatient.objects.filter(
            doctor=request.user,
            patient=patient_profile.user
        ).exists()
        
        if not doctor_patient:
            return Response(
                {'error': 'You are not assigned to this patient'},
                status=403
            )
        
        # Get patient's vitals
        records = PatientVital.objects.filter(
            patient_id=patient_id
        ).order_by("-timestamp")[:50]
        
        data = []
        for r in records:
            data.append({
                "id": r.id,
                "timestamp": r.timestamp,
                "heart_rate": r.heart_rate,
                "spo2": r.spo2,
                "body_temperature": r.body_temperature,
                "record_hash": r.record_hash,
                "blockchain_tx": r.blockchain_tx
            })
        
        return Response(data)

    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'Invalid access key'},
            status=403
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


@api_view(['GET'])
def get_patient_access_key(request):
    """Get the patient's access key"""
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated'},
            status=401
        )
    
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != "patient":
            return Response(
                {'error': 'Only patients can access this endpoint'},
                status=403
            )
        
        return Response({
            'access_key': profile.access_key,
            'patient_id': profile.patient_id
        })
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=404
        )


@api_view(['POST'])
def regenerate_access_key(request):
    """Update the patient's access key to a new one"""
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Not authenticated'},
            status=401
        )
    
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != "patient":
            return Response(
                {'error': 'Only patients can access this endpoint'},
                status=403
            )
        
        # Get new access key from request
        new_access_key = request.data.get("access_key", "").strip()
        
        if not new_access_key:
            return Response(
                {'error': 'New access key is required'},
                status=400
            )
        
        # Check if new access key is already taken (by another user)
        if UserProfile.objects.filter(access_key=new_access_key).exclude(user=request.user).exists():
            return Response(
                {'error': 'This access key is already in use. Please choose a different one.'},
                status=400
            )
        
        # Update to new access key
        profile.access_key = new_access_key
        profile.save()
        
        return Response({
            'message': 'Access key updated successfully',
            'access_key': profile.access_key,
            'patient_id': profile.patient_id
        })
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=404
        )
