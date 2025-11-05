import datetime as dt
import os
import sys
import django

print("hello")

# Add the parent folder (which contains manage.py) to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Use your *real* settings file
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myapp.settings")

# Setup 
django.setup()

from myapp.models import (your_table, address, organicinorganic, materialtype, 
                          speciestype, conservationtype, formtype, gridnames,
                          threedprintedtable, threedscannedtable)

"""street = address.objects.create(
    id=0,
    streetnumber="123", 
    streetname="Sesame Street", 
    state="NY", 
    countyorcity="New York", 
    site="Dig Site 1"
)

street.save()"""

street = address.objects.filter(id=0)[0]

"""inorganic = organicinorganic.objects.create(type="inorganic", id=0)
fabric = materialtype.objects.create(typename="fabric", id=0)"""
inorganic = organicinorganic.objects.filter(id=0)[0]
fabric = materialtype.objects.filter(id=0)[0]
# species_type = speciestype.objects.create(typename="Insect", id=0)
# conservation_good = conservationtype.objects.create(typename="Bad", id=0)
species_type = speciestype.objects.filter(id=0)[0]
conservation_good = conservationtype.objects.filter(id=0)[0]
# form_type = formtype.objects.create(typename="ceramic", id=0)
form_type = formtype.objects.filter(id=0)[0]
grid = gridnames.objects.filter(id=0)[0]
# scanner = threedscannedtable.objects.create(type="Sam", id=0)
# threedprinter = threedprintedtable.objects.create(type="false", id=0)
scanner = threedscannedtable.objects.filter(id=0)[0]
threedprinter = threedprintedtable.objects.filter(id=0)[0]

obj = your_table.objects.create(
    address=street,
    owner="Sam Goree",
    date_collected=dt.date(1970, 1, 1),
    catalog_number="123",
    object_name="Elmo",
    scanned_3d=scanner,
    printed_3d=threedprinter,
    scanned_by="Sam",
    date_excavated=dt.date(1969, 12, 31),
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
    date_catalogued=dt.date(2025, 10, 3),
    location_in_repository="Shelf A-12",
    platlot="PL-456",
    found_at_depth="A few inches down",
    longitude="74.00",
    latitude="40.71",
    distance_from_datum="2.5m",
    found_in_grid=grid,
    excavator="Sam Goree",
    notes="Test object for Emilio",
    images="",
    data_double_checked_by="Quality Control Team",
    qsconcerns="None",
    druhlcheck=True,
    sources_for_id="Visual analysis",
    location="Main storage",
    storage_location="Bin 45",
    uhlflages="",
)

print(obj)