from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from datetime import datetime
import json
from myapp.models import (
    address, threedscannedtable, threedprintedtable, gridnames, permissions, users, 
    organicinorganic, speciestype, materialtype, formtype, conservationtype, 
    your_table, imagetable
)

class test_imagetable(TestCase):

    def setUp(self):
        # address
        self.address = address.objects.create(
            id=1,
            streetnumber="123",
            streetname="Main St",
            state="Massachusetts",
            countyorcity="Middlesex",
            site="Site A"
        )

        # threedscannedtable
        self.threedscannedtable = threedscannedtable.objects.create(
            id=1,
            type="Scan"
        )

        # threedprintedtable
        self.threedprintedtable = threedprintedtable.objects.create(
            id=1,
            type="Print"
        )

        # gridnames
        self.gridnames = gridnames.objects.create(
            id=1,
            typename="Grid A"
        )

        # permissions
        self.permissions = permissions.objects.create(
            numval=1,
            givenrole="Admin"
        )

        # users
        self.users = users.objects.create(
            email="testuser@example.com",
            upassword="securepassword123",
            upermission=self.permissions,
            activated=True
        )

        # organicinorganic
        self.organicinorganic = organicinorganic.objects.create(
            id=1,
            type="Organic"
        )

        # speciestype
        self.speciestype = speciestype.objects.create(
            id=1,
            typename="Canine"
        )

        # materialtype
        self.materialtype = materialtype.objects.create(
            id=1,
            typename="Metal"
        )

        # formtype
        self.formtype = formtype.objects.create(
            id=1,
            typename="Vessel"
        )

        # conservationtype
        self.conservationtype = conservationtype.objects.create(
            id=1,
            typename="Good"
        )

        # Artifact (your_table)
        self.your_table = your_table.objects.create(
            address=self.address,
            owner="John Doe",
            date_collected=datetime(2025, 2, 1),
            catalog_number="CAT12345",
            object_name="Artifact Sample",
            scanned_3d=self.threedscannedtable,
            printed_3d=self.threedprintedtable,
            scanned_by="Scanner X",
            date_excavated=datetime(2025, 1, 15),
            object_dated_to="Object dated to",
            object_description="Sample Description",
            organic_inorganic=self.organicinorganic,
            species=self.speciestype,
            material_of_manufacture=self.materialtype,
            form_object_type=self.formtype,
            quantity="5",
            measurement_diameter=12.5,
            length=25.0,
            width=15.0,
            height=10.0,
            measurement_notes="Note A",
            weight=3.5,
            weight_notes="Weight Note",
            sivilich_diameter=8.0,
            deformation_index=2.1,
            conservation_condition=self.conservationtype,
            cataloguer_name=self.users,
            date_catalogued=datetime(2025, 3, 1),
            location_in_repository="Shelf A",
            platlot="Platlot A",
            found_at_depth="2.5",
            longitude="42.5",
            latitude="-71.2",
            distance_from_datum="10m",
            found_in_grid=self.gridnames,
            excavator="Archeologist Y",
            notes="Some notes",
            images="Image (add column for each additional image)",
            data_double_checked_by="Checker Z",
            qsconcerns="None",
            druhlcheck="Passed",
            sources_for_id="Source A",
            location="Room B",
            storage_location="Box 1",
            uhlflages="None",
            id = 1
        )
        self.image = imagetable.objects.create(
            id=1,
            your_table=self.your_table,
            filepath="test.img",
        )

    def test_all_image_table_view_success(self):
        # Ensure the endpoint returns status code 200
        response = self.client.get(reverse('all_image_table_view'))
        self.assertEqual(response.status_code, 200, "Failed to load page")

    

    def test_image_table_content(self):
        # Ensure the view returns the correct JSON data
        response = self.client.get(reverse('all_image_table_view'))
        self.assertEqual(response.status_code, 200, "Failed to load page")
        self.assertEqual(response['Content-Type'], 'application/json', "request did not load a json file")

        # Parse JSON response
        data = response.json()
        self.assertIn('images', data, "json does not contain images")

        self.assertEqual(len(data['images']), 1, f"Number of images is not 1, instead there are {len(data['images'])} images")  # We created 1 artifacts in setUp()

        # Check the content of the first image
        image_1 = data['images'][0]
        self.assertEqual(image_1['id'], 1, f"Artifact name {image_1['id']} does not match expected image id 1")
        self.assertEqual(image_1['filepath'], "test.img", f"Object description {image_1['filepath']} does not match expected filepath test.img")
    


    def test_no_images_in_database(self):
        # Clean up the database and test empty response
        imagetable.objects.all().delete()
        response = self.client.get(reverse('all_image_table_view'))
        self.assertEqual(response.status_code, 200, "Failed to load page")
        self.assertEqual(response['Content-Type'], 'application/json', "request did not load a json file")

        data = response.json()
        self.assertIn('images', data, "json does not contain images")
        self.assertEqual(len(data['images']), 0, f"Number of images is not 0, instead there are {len(data['images'])} images")  # No artefacts in the database

