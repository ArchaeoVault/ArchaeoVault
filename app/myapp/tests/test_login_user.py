from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User #imports django user model if we decide to just use that
from django.core.mail import send_mail
from myapp.models import users, permissions
import json

class LoginUserTests(TestCase):

    def setUp(self):
        
        permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
        
        self.user = users.objects.create(
            email = 'temp@email.com',
            upassword = 'password123',
            upermission = permission,
            activated = True
        )

    def test_user_login_success(self): 
              
        response = self.client.post(
            reverse('login_view'),
            data = json.dumps({'email':'temp@email.com','password':'password123'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 200)
        #check if in database    
    
    def test_login_user_missing_value(self):        
        response = self.client.post(
            reverse('login_view'),
            data = json.dumps({'email':'','password':''}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)    
    
    def test_mismatch_password(self):        
        response = self.client.post(
            reverse('login_view'),
            data = json.dumps({'email':'temp@email.com','password':'password1234'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code,400)   
    
    def test_login_user_with_incorrect_email(self):        
        response = self.client.post(
            reverse('login_view'),
            data = json.dumps({'email':'temp@email.con','password':'password123'}),
            content_type='application/json'
            )
        self.assertEqual(response.status_code, 400)

