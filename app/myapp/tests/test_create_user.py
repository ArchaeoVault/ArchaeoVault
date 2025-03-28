from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User #imports django user model if we decide to just use that
from django.core.mail import send_mail
import json

class CreateUserTests(TestCase):

    def test_user_create_success(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'first_name':'test','last_name':'user','email': 'temp@email.com','password': 'password123', 'confirm_password':'password123'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username ='temp@email.com').exists())
        #check if in database    
    def test_create_user_missing_value(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'first_name':'','last_name':'','email': '','password': '','confirm_password':''}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)    
    
    def test_create_user_invalid_email(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'first_name':'test','last_name':'user','email':'temp','password':'password123','confirm_password':'password123'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)    
    def test_mismatch_password(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = ({'first_name':'test','last_name':'user','email':'temp@email.com','password':'password123','confirm_password':'password12'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code,400)   
    def test_create_user_with_same_email(self):        
        response = self.client.post(
            reverse('create_user_view'),
            data = json.dumps({'first_name':'test','last_name':'user','email': 'temp@email.com','password': 'password123','confirm_password':'password123'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username ='temp@email.com').exists())
        response = self.client.post(
            reverse('create_user_view'),
            data = ({'first_name':'test','last_name':'user','email': 'temp@email.com','password': 'password123','confirm_password':'password123'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)