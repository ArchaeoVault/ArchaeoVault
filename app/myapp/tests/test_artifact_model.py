from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from datetime import datetime
from myapp.models import (
    Address, Scanned3d, Printed3d, GridNames, Permissions, Users, ObjDatedTo, 
    OrganicType, SpeciesType, MaterialType, FormType, ConservationType, 
    PicturePath, Artifact
)

class test_artifact_model(TestCase):

    def setUp(self):
        # Address
        self.address = Address.objects.create(
            id=1,
            street_number="123",
            street_name="Main St",
            state="Massachusetts",
            county_or_city="Middlesex",
            site="Site A"
        )

        # Scanned3d
        self.scanned_3d = Scanned3d.objects.create(
            id=1,
            type="Scan"
        )

        # Printed3d
        self.printed_3d = Printed3d.objects.create(
            id=1,
            type="Print"
        )

        # GridNames
        self.grid_name = GridNames.objects.create(
            id=1,
            type_name="Grid A"
        )

        # Permissions
        self.permission = Permissions.objects.create(
            numVal=1,
            role="Admin"
        )

        # Users
        self.user = Users.objects.create(
            email="testuser@example.com",
            upassword="securepassword123",
            upermission=self.permission,
            active_flag=True
        )

        # ObjDatedTo
        self.obj_dated_to = ObjDatedTo.objects.create(
            id=1,
            from_date=datetime(2025, 1, 1),
            to_date=datetime(2025, 12, 31)
        )

        # OrganicType
        self.organic_type = OrganicType.objects.create(
            id=1,
            type_name="Organic"
        )

        # SpeciesType
        self.species_type = SpeciesType.objects.create(
            id=1,
            type_name="Canine"
        )

        # MaterialType
        self.material_type = MaterialType.objects.create(
            id=1,
            type_name="Metal"
        )

        # FormType
        self.form_type = FormType.objects.create(
            id=1,
            type_name="Vessel"
        )

        # ConservationType
        self.conservation_type = ConservationType.objects.create(
            id=1,
            type_name="Good"
        )

        # PicturePath
        self.picture_path = PicturePath.objects.create(
            id=1,
            type_name="Path A"
        )

        # Artifact
        self.artifact = Artifact.objects.create(
            address=self.address,
            owner="John Doe",
            date_collected=datetime(2025, 2, 1),
            catalog_number="CAT12345",
            object_name="Artifact Sample",
            scanned_3d=self.scanned_3d,
            printed_3d=self.printed_3d,
            scanned_by="Scanner X",
            date_excavated=datetime(2025, 1, 15),
            object_dated_to=self.obj_dated_to,
            object_description="Sample Description",
            organic_inorganic=self.organic_type,
            species=self.species_type,
            material_of_manufacture=self.material_type,
            form_object_type=self.form_type,
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
            conservation_condition=self.conservation_type,
            cataloguer_name=self.user,
            date_catalogued=datetime(2025, 3, 1),
            location_in_repository="Shelf A",
            platlot="Platlot A",
            found_at_depth=2.5,
            longitude=42.5,
            latitude=-71.2,
            distance_from_datum="10m",
            found_in_grid=self.grid_name,
            exacavator="Archeologist Y",
            notes="Some notes",
            images=self.picture_path,
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
        Artifact.objects.all().delete()
        response = self.client.get(reverse('all_artifacts_view'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('artifacts', data)
        self.assertEqual(len(data['artifacts']), 0)  # No artefacts in the database


    


