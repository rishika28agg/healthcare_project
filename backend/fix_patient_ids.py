#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vitals.models import UserProfile

# Find all patient profiles with NULL patient_id and assign user.id
patients = UserProfile.objects.filter(role='patient', patient_id__isnull=True)

print(f"Found {patients.count()} patients without patient_id")

for profile in patients:
    profile.patient_id = profile.user.id
    profile.save()
    print(f"✓ Updated patient {profile.user.username} with patient_id = {profile.patient_id}")

print(f"Done! Updated {patients.count()} patient profiles.")
