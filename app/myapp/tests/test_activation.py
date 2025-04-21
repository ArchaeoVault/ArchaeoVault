from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, force_bytes
from unittest.mock import patch
import json
from myapp.models import users, permissions

class ActivateViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_email = "test@example.com"
        self.user_password = "TestPassword123"
        self.permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
        self.user = users.objects.create(email=self.user_email, password=self.user_password, upermission=self.permission, activated=False)
        self.user.activated = False
        self.user.save()
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user_email))
        self.token = "valid_token"  # Simulated token for testing
        self.endpoint = f'/activate/{self.uidb64}/{self.token}/'

    @patch('django.contrib.auth.tokens.default_token_generator.check_token')
    def test_successful_activation(self, mock_check_token):
        mock_check_token.return_value = True  # Simulate token validation success

        response = self.client.post(self.endpoint)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['message'], 'Account is now activated')

        # Verify the user's activation status
        self.user.refresh_from_db()
        self.assertTrue(self.user.activated)

    @patch('django.contrib.auth.tokens.default_token_generator.check_token')
    def test_invalid_token(self, mock_check_token):
        mock_check_token.return_value = False  # Simulate token validation failure

        response = self.client.post(self.endpoint)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Email is not associated with an account or token is invalid')

    def test_user_not_found(self):
        invalid_uid = urlsafe_base64_encode(force_bytes("nonexistent@example.com"))

        response = self.client.post(f'/activate/{invalid_uid}/{self.token}/')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Email is not associated with an account or token is invalid')

    def test_error_during_activation(self):
        with patch('django.contrib.auth.models.User.objects.get') as mock_get_user:
            mock_get_user.side_effect = Exception("Simulated Exception")

            response = self.client.post(self.endpoint)
            self.assertEqual(response.status_code, 400)
            self.assertEqual(json.loads(response.content)['error'], 'Error activating account')