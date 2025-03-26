from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User #imports django user model if we decide to just use that
from django.core.mail import send_mail

class ResendVerificationTests(TestCase):
    
    def verify_nonexistent_account(self):

        response = self.client.post(reverse('resend_verification_view'), data = {'email': 'temp@email.com'}) 
        self.assertFalse(User.objects.filter(username ='temp@email.com').exists())
        self.assertEqual(response.status_code, 400)
    
    def verify_email_exists(self):

        response = self.client.post(reverse('resend_verification_view'), data = {'email': 'temp@email.com'}) 
        self.assertTrue(User.objects.filter(username ='temp@email.com').exists())
        self.assertEqual(response.status_code, 200)