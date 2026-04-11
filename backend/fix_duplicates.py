#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vitals.models import PatientVital
from collections import defaultdict

print("Checking for duplicate vitals records...\n")

# Find duplicates
duplicates = defaultdict(list)
all_records = PatientVital.objects.all().order_by('timestamp', 'id')

for record in all_records:
    key = (record.patient_id, record.timestamp)
    duplicates[key].append(record)

# Clean up duplicates
deleted_count = 0
duplicate_found_count = 0

for key, records in duplicates.items():
    if len(records) > 1:
        duplicate_found_count += 1
        patient_id, timestamp = key
        print(f"Found {len(records)} duplicates for patient {patient_id} at {timestamp}:")
        for i, record in enumerate(records):
            if i == 0:
                print(f"  [KEEP] ID: {record.id}, HR: {record.heart_rate}, SpO2: {record.spo2}")
            else:
                print(f"  [DELETE] ID: {record.id}, HR: {record.heart_rate}, SpO2: {record.spo2}")
                record.delete()
                deleted_count += 1

print(f"\nSummary:")
print(f"  Duplicate groups found: {duplicate_found_count}")
print(f"  Records deleted: {deleted_count}")
print(f"  Total remaining records: {PatientVital.objects.count()}")
