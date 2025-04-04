from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from myapp.models import Users, Permissions
import json

class test_change_password(TestCase):

    def setUp(self):
        permission = Permissions.objects.create(numVal = 4, role = 'GeneralPublic')
        
        self.user = Users.objects.create(
            email = 'temp@email.com',
            upassword = 'password123',
            upermission = permission,
            active_flag = True
        )
    
    def test_reset_password_success(self):

        
        response = self.client.post(
            reverse('change_password_view'),
            data=json.dumps({'email': 'temp@email.com', 'newPassword': 'password1234', 'confirmPassword': 'password1234'}),
            content_type='application/json'  # Ensure request is treated as JSON
        )
        self.assertEqual(response.status_code, 200)
        user = Users.objects.get(email = 'temp@email.com')
        self.assertTrue('password1234', user.upassword)
    
    def test_reset_missing_value(self):

        response = self.client.post(
            reverse('change_password_view'),
            data = json.dumps({'email':'','newPassword':'','confirmPassword':''}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_reset_same_password(self):

        response = self.client.post(
            reverse('change_password_view'),
            data =json.dumps ({'email':'temp@email.com','newPassword':'password123','confirmPassword':'password123'}),
            content_type= 'application/json'
            )
        self.assertEqual(response.status_code, 400)
    
    def test_new_and_confirm_mismatch(self):

        response = self.client.post(
            reverse('change_password_view'),
            data = json.dumps({'email':'temp@email.com','newPassword':'password1234','confirmPassword':'password1235'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)