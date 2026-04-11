#!/usr/bin/env python
import os
import django
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vitals.models import PatientVital

print("Adding test vitals data...\n")

# Use existing patient ID 8 (testuser123)
patient_id = 8
base_time = datetime(2025, 12, 26, 12, 0, 0)

# Create 10 readings at 5-minute intervals
readings = []
for i in range(10):
    timestamp = base_time + timedelta(minutes=i*5)
    
    # Vary readings realistically
    hr = 120 + random.randint(-15, 15)
    spo2 = 95 + random.randint(-3, 2)
    temp = 98.5 + random.uniform(-1, 1)
    
    vital = PatientVital.objects.create(
        patient_id=patient_id,
        heart_rate=hr,
        spo2=spo2,
        body_temperature=temp,
        timestamp=timestamp
    )
    readings.append(vital)
    print(f"  Created: {timestamp} - HR: {hr} BPM, O2: {spo2}%, Temp: {temp:.1f}°F")

print(f"\nAdded {len(readings)} vitals records!")
