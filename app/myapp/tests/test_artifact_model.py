from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from datetime import datetime
from myapp.models import (
    address, threedscannedtable, threedprintedtable, gridnames, permissions, users, 
    organicinorganic, speciestype, materialtype, formtype, conservationtype, 
    your_table
)

class test_artifact_model(TestCase):

    def setUp(self):
        # address
        self.address = address.objects.create(
            id=1,
            street_number="123",
            street_name="Main St",
            state="Massachusetts",
            county_or_city="Middlesex",
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
            type_name="Grid A"
        )

        # permissions
        self.permissions = permissions.objects.create(
            numVal=1,
            role="Admin"
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
            type_name="Organic"
        )

        # speciestype
        self.speciestype = speciestype.objects.create(
            id=1,
            type_name="Canine"
        )

        # materialtype
        self.materialtype = materialtype.objects.create(
            id=1,
            type_name="Metal"
        )

        # formtype
        self.formtype = formtype.objects.create(
            id=1,
            type_name="Vessel"
        )

        # conservationtype
        self.conservationtype = conservationtype.objects.create(
            id=1,
            type_name="Good"
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
            quantitiy=5,
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
            found_at_depth=2.5,
            longitude=42.5,
            latitude=-71.2,
            distance_from_datum="10m",
            found_in_grid=self.gridnames,
            exacavator="Archeologist Y",
            notes="Some notes",
            images="Image (add column for each additional image)",
            data_double_checked_by="Checker Z",
            qsconcerns="None",
            druhlcheck="Passed",
            sources_for_id="Source A",
            location="Room B",
            storage_location="Box 1",
            uhlflages="None"
        )



    def test_all_artifacts_view_success(self):
        # Ensure the endpoint returns status code 200
        response = self.client.get(reverse('all_artifacts_view'))
        self.assertEqual(response.status_code, 200)

    

    def test_artifact_list_content(self):
        # Ensure the view returns the correct JSON data
        response = self.client.get(reverse('all_artifacts_view'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')

        # Parse JSON response
        data = response.json()
        self.assertIn('artifacts', data)
        self.assertEqual(len(data['artifacts']), 1)  # We created 1 artifacts in setUp()

        # Check the content of the first artefact
        artifact_1 = data['artifacts'][0]
        self.assertEqual(artifact_1['object_name'], "Artifact Sample")
        self.assertEqual(artifact_1['owner'], "John Doe")
    


    def test_no_artifacts_in_database(self):
        # Clean up the database and test empty response
        your_table.objects.all().delete()
        response = self.client.get(reverse('all_artifacts_view'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('artifacts', data)
        self.assertEqual(len(data['artifacts']), 0)  # No artefacts in the database


    


