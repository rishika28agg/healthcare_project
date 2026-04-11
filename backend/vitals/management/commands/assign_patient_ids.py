from django.core.management.base import BaseCommand
from vitals.models import UserProfile

class Command(BaseCommand):
    help = 'Assign patient_id to all existing patient users who have NULL patient_id'

    def handle(self, *args, **options):
        # Get all patient profiles with NULL patient_id
        patients_without_id = UserProfile.objects.filter(
            role='patient',
            patient_id__isnull=True
        )
        
        count = 0
        for profile in patients_without_id:
            # Assign patient_id = user.id
            profile.patient_id = profile.user.id
            profile.save()
            count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f'Assigned patient_id {profile.patient_id} to {profile.user.username}'
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'\nTotal patients updated: {count}')
        )
