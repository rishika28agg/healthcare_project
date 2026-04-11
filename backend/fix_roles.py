#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vitals.models import UserProfile

# Check for invalid role values
invalid_profiles = UserProfile.objects.exclude(role__in=['doctor', 'patient'])
print(f"Found {invalid_profiles.count()} profiles with invalid roles:")
for profile in invalid_profiles:
    print(f"  - User: {profile.user.username}, Role: {profile.role}")
    # Fix it
    profile.role = profile.role.lower()
    profile.save()
    print(f"    Fixed to: {profile.role}")

print("\nAll users with valid roles:")
for profile in UserProfile.objects.all():
    print(f"  - User: {profile.user.username}, Role: {profile.role}")
