from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
import json

class test_change_password(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username = 'temp@email.com',
            first_name = 'test',
            last_name = 'user',
            email = 'temp@email.com',
            password = 'password123'
        )
    
    def test_reset_password_success(self):

        
        response = self.client.post(
            reverse('change_password_view'),
            data=json.dumps({'email': 'temp@email.com', 'newPassword': 'password1234', 'confirmPassword': 'password1234'}),
            content_type='application/json'  # Ensure request is treated as JSON
        )
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username = 'temp@email.com')
        self.assertTrue(check_password('password1234', user.password))
    
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