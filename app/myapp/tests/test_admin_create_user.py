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

class test_admin_create_user(TestCase):

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
        self.permission = permissions.objects.create(numval = 1, givenrole = 'SuperAdmin')

        self.permissionResearchers = permissions.objects.create(numval = 3, givenrole = 'Researchers')

        self.users = users.objects.create(
            email="testuser@example.com",
            upassword="securepassword123",
            upermission=self.permission,
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
        self.materialtypeChange = materialtype.objects.create(
            id=2,
            typename="Copper"
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
        
    def test_user_create_success_admin(self):        
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password123','permission':'SuperAdmin'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(users.objects.filter(email ='temp@email.com').exists())
        #check if in database    

    def test_user_create_success_researcher(self):        
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password123','permission':'Researchers'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(users.objects.filter(email ='temp@email.com').exists())
        #check if in database    

    def test_create_user_missing_value(self):        
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'','password':'','confirm_password':'','permission':''}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)    
    
    def test_create_user_invalid_email(self):        
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp','password':'password123','confirm_password':'password123','permission':'SuperAdmin'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)  
          
    def test_mismatch_password(self):        
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password1234','permission':'SuperAdmin'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code,400)  

    def test_create_user_with_same_email(self):        
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password123','permission':'SuperAdmin'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(users.objects.filter(email ='temp@email.com').exists())
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password123','permission':'SuperAdmin'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)

    def test_create_user_with_invalid_permissions(self):
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password123','permission':'GenPub'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
    
    def test_create_user_not_admin(self):
        perm = self.permissionResearchers
        self.users.upermission = perm
        self.users.save()
        response = self.client.post(
            reverse('admin_create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123','confirm_password':'password123','permission':'SuperAdmin'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 402) 