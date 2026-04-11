from django.core.management.base import BaseCommand
from vitals.services.blockchain_anchor import anchor_unanchored_records

class Command(BaseCommand):
    help = "Anchor unanchored patient records to the blockchain"

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=10,
            help='Number of records to anchor (default: 10)'
        )

    def handle(self, *args, **kwargs):
        limit = kwargs['limit']
        
        self.stdout.write(f"Anchoring up to {limit} records...")
        
        try:
            anchor_unanchored_records(limit=limit)
            self.stdout.write(self.style.SUCCESS("Records anchored successfully!"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error anchoring records: {str(e)}"))
