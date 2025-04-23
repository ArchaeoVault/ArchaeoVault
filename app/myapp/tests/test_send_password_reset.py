from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User #imports django user model if we decide to just use that
from django.core.mail import send_mail
from myapp.models import users, permissions
import json

class test_send_password_reset(TestCase):

    def setUp(self):
        self.permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
        
        
        self.user = users.objects.create(
            email = 'temp@email.com',
            upassword = 'password123',
            upermission = self.permission,
            activated = False
        )
    
    def test_verify_nonexistent_account(self):

        response = self.client.post(
            reverse('resend_verification_view'),
            data = json.dumps({'email': 'temp2@email.com'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)
    
    def test_verify_email_exists(self):
        
        response = self.client.post(
            reverse('resend_verification_view'),
            data = json.dumps({'email': 'temp@email.com'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
    
    def test_missing_value(self):

        response = self.client.post(
            reverse('resend_verification_view'),
            data = json.dumps({'email': ''}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)