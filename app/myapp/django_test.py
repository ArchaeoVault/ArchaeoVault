import datetime as dt
import os
import sys
from pathlib import Path
import django
from django.core.files import File
from django.core.files.base import ContentFile
from django.utils import timezone
from django.conf import settings
from pathlib import Path
import qrcode
from io import BytesIO

print("hello")

# ---- Django setup ----
# Add the parent folder (contains manage.py) to Python path
BASE_PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_PROJECT_DIR))

# Use your settings module (adjust if yours is different)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myapp.settings")

django.setup()

from myapp.models import (your_table, address, organicinorganic, materialtype, 
                          speciestype, conservationtype, formtype, gridnames,
                          threedprintedtable, threedscannedtable)

# Safety helper: get object or raise a clear error
def get_required(model, obj_id, name):
    obj = model.objects.filter(id=obj_id).first()
    if not obj:
        raise Exception(
            f"Missing required row in {model.__name__} with id={obj_id}. "
            f"Create it first (admin site or with .objects.create)."
        )
    print(f"Found {name}: {model.__name__} id={obj_id}")
    return obj

# Grab required foreign keys
# ADDRESS
street, _ = address.objects.get_or_create(
    id=0,
    defaults={
        "streetnumber": "123",
        "streetname": "Sesame Street",
        "state": "NY",
        "countyorcity": "New York",
        "site": "Dig Site 1",
    }
)

# ORGANIC/INORGANIC
inorganic, _ = organicinorganic.objects.get_or_create(
    id=0,
    defaults={"type": "inorganic"}
)

# MATERIAL TYPE
fabric, _ = materialtype.objects.get_or_create(
    id=0,
    defaults={"typename": "fabric"}
)

# SPECIES TYPE
species_type, _ = speciestype.objects.get_or_create(
    id=0,
    defaults={"typename": "Muppet"}
)

# CONSERVATION TYPE
conservation_good, _ = conservationtype.objects.get_or_create(
    id=0,
    defaults={"typename": "Good"}
)

# FORM TYPE
form_type, _ = formtype.objects.get_or_create(
    id=0,
    defaults={"typename": "Toy"}
)

# GRID NAMES uses "typename"
grid, _ = gridnames.objects.get_or_create(
    id=0,
    defaults={"typename": "Grid A"}
)

# 3D SCANNED TABLE
scanner, _ = threedscannedtable.objects.get_or_create(
    id=0,
    defaults={"type": "None"}
)

# 3D PRINTED TABLE
threedprinter, _ = threedprintedtable.objects.get_or_create(
    id=0,
    defaults={"type": "False"}
)

# Create the artifact object 
obj = your_table.objects.create(
    address=street,
    owner="Sam Goree",
    date_collected=timezone.make_aware(dt.datetime(1970, 1, 1, 0, 0)),
    catalog_number="123",
    object_name="Elmo",
    scanned_3d=scanner,
    printed_3d=threedprinter,
    scanned_by="Sam",
    date_excavated=timezone.make_aware(dt.datetime(1969, 12, 31, 0, 0)),
    object_dated_to="Late 1800s",
    object_description="A muppet fragment, red and fluffy",
    organic_inorganic=inorganic,
    species=species_type,
    material_of_manufacture=fabric,
    form_object_type=form_type,
    quantity=1,
    measurement_diameter=125,
    length=400,
    width=80,
    height=90,
    measurement_notes="N/A",
    weight=200,
    weight_notes="N/A",
    sivilich_diameter="0.1",
    deformation_index="0",
    conservation_condition=conservation_good,
    cataloguer_name="Emilio",
    date_catalogued=timezone.make_aware(dt.datetime(2025, 10, 3, 0, 0)),
    location_in_repository="Shelf A-12",
    platlot="PL-456",
    found_at_depth="A few inches down",
    longitude="74.00",
    latitude="40.71",
    distance_from_datum="2.5m",
    found_in_grid=grid,
    excavator="Sam Goree",
    notes="Test object for Emilio",
    #images=elmo_image_path,
    data_double_checked_by="Quality Control Team",
    qsconcerns="None",
    druhlcheck=True,
    sources_for_id="Visual analysis",
    location="Main storage",
    storage_location="Bin 45",
    uhlflages="",
)
print("Object created:", obj)

# Attach image properly to ImageField
script_dir = Path(__file__).resolve().parent
elmo_path = script_dir / "elmo.png"

if not elmo_path.exists():
    raise FileNotFoundError(
        f"Could not find image file at: {elmo_path}\n"
        f"Put elmo.png in the same folder as django_test.py, or update the path."
    )

with open(elmo_path, "rb") as f:
    obj.images.save("elmo.png", File(f), save=True)
    
print("Image saved to DB field.")
print("Image URL:", obj.images.url)

# ---- QR CODE ----

artifact_url = f"http://localhost:3000/artifact/{obj.id}"

qr = qrcode.make(artifact_url)

qr_dir = Path(settings.MEDIA_ROOT) / "qr_codes"
qr_dir.mkdir(parents=True, exist_ok=True)

qr_path = qr_dir / f"artifact_{obj.id}_qr.png"
qr.save(qr_path)

obj.qr_code = f"qr_codes/artifact_{obj.id}_qr.png"
obj.save()

print(f"QR code created and saved: {obj.qr_code}")