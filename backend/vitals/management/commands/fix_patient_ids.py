from django.core.management.base import BaseCommand
from vitals.models import UserProfile


class Command(BaseCommand):
    help = 'Assign patient_id to all existing patients who have null patient_id'

    def handle(self, *args, **options):
        # Get all patient profiles with null patient_id
        patients = UserProfile.objects.filter(
            role='patient',
            patient_id__isnull=True
        )

        count = 0
        for profile in patients:
            # Assign patient_id = user.id
            profile.patient_id = profile.user.id
            profile.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f'Updated {profile.user.username} - Patient ID: {profile.patient_id}'
                )
            )
            count += 1

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully updated {count} patients with patient IDs')
        )
