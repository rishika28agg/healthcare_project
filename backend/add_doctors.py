#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from vitals.models import UserProfile

print("Creating test doctor accounts...\n")

doctors = [
    {'username': 'dr_smith', 'email': 'smith@hospital.com', 'name': 'Dr. Smith'},
    {'username': 'dr_johnson', 'email': 'johnson@hospital.com', 'name': 'Dr. Johnson'},
    {'username': 'dr_williams', 'email': 'williams@hospital.com', 'name': 'Dr. Williams'},
]

for doc in doctors:
    if not User.objects.filter(username=doc['username']).exists():
        user = User.objects.create_user(
            username=doc['username'],
            email=doc['email'],
            password='Doctor123',
            first_name=doc['name']
        )
        profile = UserProfile.objects.create(
            user=user,
            role='doctor'
        )
        print(f"Created: {doc['name']} ({doc['username']})")
    else:
        print(f"Already exists: {doc['username']}")

print("\nDone!")
