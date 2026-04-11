#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from vitals.models import UserProfile

print("All users in system:")
for user in User.objects.all():
    try:
        profile = UserProfile.objects.get(user=user)
        print(f"  - Username: {user.username}, Role: {profile.role}")
    except:
        print(f"  - Username: {user.username}, Role: NO PROFILE")
