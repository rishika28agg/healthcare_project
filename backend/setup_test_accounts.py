#!/usr/bin/env python
"""
Create test user accounts for testing
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from vitals.models import UserProfile

# Test accounts to create
test_accounts = [
    {"username": "patient1", "password": "Patient123", "email": "patient1@test.com", "role": "patient", "first_name": "Alice"},
    {"username": "patient2", "password": "Patient123", "email": "patient2@test.com", "role": "patient", "first_name": "Bob"},
    {"username": "doctor1", "password": "Doctor123", "email": "doctor1@test.com", "role": "doctor", "first_name": "Dr. Smith"},
]

print("Creating test accounts...")
print("=" * 60)

for account in test_accounts:
    username = account["username"]
    
    # Delete if exists
    if User.objects.filter(username=username).exists():
        User.objects.filter(username=username).delete()
        print(f"Deleted existing: {username}")
    
    # Create new user
    user = User.objects.create_user(
        username=username,
        email=account["email"],
        password=account["password"],
        first_name=account["first_name"]
    )
    
    # Create profile
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.role = account["role"]
    profile.save()
    
    print(f"Created: {username} ({account['role']}) - Password: {account['password']}")

print("=" * 60)
print("\nTest Credentials:")
print("\nPatient Accounts:")
print("  Username: patient1")
print("  Password: Patient123")
print("")
print("  Username: patient2")
print("  Password: Patient123")
print("\nDoctor Accounts:")
print("  Username: doctor1")
print("  Password: Doctor123")
print("\nAlso available:")
print("  dr_smith, dr_johnson, dr_williams - Password: Doctor123")
