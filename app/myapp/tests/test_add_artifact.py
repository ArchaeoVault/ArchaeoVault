from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from datetime import datetime
from myapp.models import (
    address, threedscannedtable, threedprintedtable, gridnames, permissions, users, 
    organicinorganic, speciestype, materialtype, formtype, conservationtype, 
    your_table
)
import json

class test_add_artifact(TestCase):

    def setUp(self):
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
        self.threedscannedtableNo = threedscannedtable.objects.create(
            id=2,
            type="No Scan"
        )
        # threedprintedtable
        self.threedprintedtable = threedprintedtable.objects.create(
            id=1,
            type="Print"
        )
        self.threedprintedtableNo = threedprintedtable.objects.create(
            id=2,
            type="No Print"
        )

        # gridnames
        self.gridnames = gridnames.objects.create(
            id=1,
            typename="Grid A"
        )
        self.gridnamesUnknown = gridnames.objects.create(
            id=20,
            typename="Unknown"
        )
        self.permission = permissions.objects.create(numval = 3, givenrole = 'Researchers')

        self.permissionGenPub = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')

        self.users = users.objects.create(
            email="testuser@example.com",
            upassword="securepassword123",
            upermission=self.permission,
            activated=True
        )
        self.usersGenPublic = users.objects.create(
            email = 'genPub@email.com',
            upassword = 'password123',
            upermission = self.permissionGenPub,
            activated = True
        )
        # organicinorganic
        self.organicinorganic = organicinorganic.objects.create(
            id=1,
            type="Organic"
        )
        self.organicinorganicUnknown = organicinorganic.objects.create(
            id=3,
            type="Unknown"
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
        self.materialtypeChange = materialtype.objects.create(
            id=61,
            typename="Unknown"
        )
        # formtype
        self.formtype = formtype.objects.create(
            id=1,
            typename="Vessel"
        )
        self.formtypeUnknown = formtype.objects.create(
            id=16,
            typename="Unknown"
        )

        # conservationtype
        self.conservationtype = conservationtype.objects.create(
            id=1,
            typename="Good"
        )
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
        self.client.post(
            reverse('login_view'),
            data = json.dumps({'email':'testuser@example.com','password':'securepassword123'}),
            content_type='application/json'
            )
    
    def test_add_artifact_success(self):
        
        response = self.client.post(
            reverse('add_artifact_view'),
            data = json.dumps({'object_name':'test object','object_description':'this is a description for a test object','date_collected': 'Jan 01, 2000','date_excavated':'Jan 01, 2000','location':'Stonehill', 'catalog_number':'2',
                               'address':1,'owner':'Test User','scanned_3d':1,'printed_3d':1,'scanned_by':'Test User',
                               'object_dated_to':'Jan 01, 2000','organic_inorganic':1,'species':1,'material_of_manufacture':1,
                               'form_object_type':1,'quantity':'1','measurement_diameter':1,'length':1,'width':1,'height':1,
                               'measurement_notes':'No notes','weight':1,'weight_notes':'None','sivilich_diameter':1,
                               'deformation_index':1,'conservation_condition':1,'cataloguer_name':'Test User','date_catalogued':'Jan 01, 2000',
                               'location_in_repository':'Newport','platlot':'None','found_at_depth':'6 feet','longitude':'80','latitude':'80',
                               'distance_from_datum':'1 inch','found_in_grid':1,'excavator':'Yes','notes':'None','images':'None',
                               'data_double_checked_by':'Dr. Uhl','qsconcerns':'None','druhlcheck':'Yes','sources_for_id':'none',
                               'storage_location':'Newport','uhlflags':'None'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(your_table.objects.filter(id=2).exists())
       
    def test_add_artifact_success_only_required_values(self):
        
        response = self.client.post(
            reverse('add_artifact_view'),
            data = json.dumps({'object_name':'test object','object_description':'this is a description for a test object','date_excavated':'Jan 01, 2000','location':'Stonehill', 'catalog_number':'2'}),
            content_type='application/json'
            )
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(your_table.objects.filter(id=2).exists())
        

    def test_invalid_permissions(self):
        user = users.objects.get(email='testuser@example.com')
        user.upermission = self.permissionGenPub
        user.save()
        response = self.client.post(
            reverse('add_artifact_view'),
            data = json.dumps({'object_name':'test object','object_description':'this is a description for a test object','date_collected': 'Jan 01, 2000','date_excavated':'Jan 01, 2000','location':'Stonehill', 'catalog_number':'2',
                               'address':1,'owner':'Test User','scanned_3d':1,'printed_3d':1,'scanned_by':'Test User',
                               'object_dated_to':'Jan 01, 2000','organic_inorganic':1,'species':1,'material_of_manufacture':1,
                               'form_object_type':1,'quantity':'1','measurement_diameter':1,'length':1,'width':1,'height':1,
                               'measuerment_notes':'None','weight':1,'weight_notes':'None','sivilich_diameter':1,
                               'deformation_index':1,'conservation_condition':1,'cataloguer_name':'Test User','date_catalogued':'Jan 01, 2000',
                               'location_in_repository':'Newport','platlot':'None','found_at_depth':'6 feet','longitude':'80','latitude':'80',
                               'distance_from_datum':'1 inch','found_in_grid':1,'excavator':'Yes','notes':'None','images':'None',
                               'data_double_checked_by':'Dr. Uhl','qsconcerns':'None','druhlcheck':'Yes','sources_for_id':'none',
                               'storage_location':'Newport','uhlflags':'None'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code,402)
        self.assertFalse(your_table.objects.filter(id =2).exists())
        
    def test_not_all_required_fields_filled(self):
        response = self.client.post(
            reverse('add_artifact_view'),
            data = json.dumps({'object_name':'','object_description':'','date_excavated':'','location':'', 'catalog_number':''}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)