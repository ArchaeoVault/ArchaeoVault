from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User #imports django user model if we decide to just use that
from django.core.mail import send_mail
from myapp.models import users, permissions
import json

class test_create_user(TestCase):
    def setUp(self):
        permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')

    def test_user_create_success(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'ThisIsABetterPassword','confirm_password':'ThisIsABetterPassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(users.objects.filter(email ='temp@email.com').exists())
        #check if in database    
    def test_create_user_missing_value(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'email':'','password':'','confirm_password':''}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)    
    
    def test_create_user_invalid_email(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'email':'temp','password':'ThisIsABetterPassword','confirm_password':'ThisIsABetterPassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)    
    def test_mismatch_password(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'ThisIsABetterPassword','confirm_password':'ThisIsAPassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code,400)   
    def test_create_user_with_same_email(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'ThisIsABetterPassword','confirm_password':'ThisIsABetterPassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(users.objects.filter(email ='temp@email.com').exists())
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'email':'temp@email.com','password':'ThisIsABetterPassword','confirm_password':'ThisIsABetterPassword'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)