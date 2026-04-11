from vitals.models import PatientVital
from vitals.blockchain import anchor_record_hash, contract

def anchor_unanchored_records(limit=10):
    records = PatientVital.objects.all()[:limit]

    for record in records:
        try:
            existing_hash = contract.functions.getRecordHash(str(record.id)).call()

            # Case 1: Already anchored on blockchain
            if existing_hash != "":
                print(f"Skipping {record.id}, already anchored")

                # Sync DB if missing tx
                if not record.blockchain_tx:
                    record.blockchain_tx = "EXISTS_ON_CHAIN"
                    record.save()

                continue

            # Case 2: Not anchored → anchor now
            print(f"Anchoring {record.id}")

            tx_hash = anchor_record_hash(
                transaction_id=str(record.id),
                record_hash=record.record_hash
            )

            record.blockchain_tx = tx_hash
            record.save()

        except Exception as e:
            print(f"Error anchoring record {record.id}: {e}")