from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
import json
from unittest.mock import patch
from myapp.models import users, permissions

class SendPasswordResetEmailTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_email = "test@example.com"
        self.user_password = "TestPassword123"
        self.permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
        self.user = users.objects.create(email=self.user_email, upassword=self.user_password, upermission=self.permission, activated=True)
        self.endpoint = reverse('send_change_password_email_view')  # Assume the URL name is 'send_change_password_email_view'
        self.valid_data = {"email": self.user_email}

    def test_invalid_request_method(self):
        response = self.client.get(self.endpoint)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(json.loads(response.content)['error'], 'Invalid request method')

    def test_missing_email_field(self):
        response = self.client.post(self.endpoint, {}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'All fields are required')

    def test_email_not_associated_with_account(self):
        invalid_data = {"email": "nonexistent@example.com"}
        response = self.client.post(self.endpoint, json.dumps(invalid_data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Email address not associated with an account')