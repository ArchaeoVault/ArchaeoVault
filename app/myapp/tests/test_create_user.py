from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User #imports django user model if we decide to just use that
from django.core.mail import send_mail
from myapp.models import users, permissions
import json
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

class CreateUserViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.permission = permissions.objects.create(numval=4, givenrole='GeneralPublic')

    def test_missing_fields(self):
        response = self.client.post('/create_user/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('All fields are required', response.json()['error'])

    def test_password_mismatch(self):
        data = {'email': 'test@example.com', 'password': 'password123', 'confirm_password': 'password456'}
        response = self.client.post('/create_user/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Passwords do not match', response.json()['error'])

    def test_duplicate_user(self):
        users.objects.create(email='test@example.com', upassword='password123', activated=False, upermission=self.permission)
        data = {'email': 'test@example.com', 'password': 'password123', 'confirm_password': 'password123'}
        response = self.client.post('/create_user/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('User with this email already exists', response.json()['error'])

    def test_invalid_email(self):
        data = {'email': 'invalid-email', 'password': 'password123', 'confirm_password': 'password123'}
        response = self.client.post('/create_user/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid email address', response.json()['error'])

    def test_successful_user_creation(self):
        data = {'email': 'newuser@example.com', 'password': 'securepass', 'confirm_password': 'securepass'}
        response = self.client.post('/create_user/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('User created successfully', response.json()['message'])
        self.assertTrue(users.objects.filter(email='newuser@example.com').exists())

    def test_invalid_request_method(self):
        response = self.client.get('/create_user/')
        self.assertEqual(response.status_code, 405)
        self.assertIn('Invalid request method', response.json()['error'])