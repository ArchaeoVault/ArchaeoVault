from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.http import JsonResponse
from myapp.models import users, permissions
import json

class ChangePasswordViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_email = "test@example.com"
        self.user_password = "OldPassword123"
        self.user = User.objects.create_user(username=self.user_email, email=self.user_email, password=self.user_password)
        self.token = "valid_token"  # Simulate the token for testing purposes
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user_email))

    def test_missing_fields(self):
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', {}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'All fields are required')

    def test_user_not_exist(self):
        User.objects.filter(email=self.user_email).delete()
        data = {"newPassword": "NewPassword123", "confirmPassword": "NewPassword123"}
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'User with this email does not exist')

    def test_passwords_do_not_match(self):
        data = {"newPassword": "NewPassword123", "confirmPassword": "DifferentPassword123"}
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Passwords do not match')

    def test_new_password_same_as_old_password(self):
        data = {"newPassword": self.user_password, "confirmPassword": self.user_password}
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'New Password can not be the same as the old password')

    def test_successful_password_reset(self):
        new_password = "NewPassword123"
        data = {"newPassword": new_password, "confirmPassword": new_password}
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['message'], 'Password successfully reset')

        # Verify the password is updated
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))

    def test_invalid_json(self):
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', "Invalid JSON", content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Invalid JSON')

    def test_error_in_updating_password(self):
        # Simulate an error in saving the password
        self.user.set_password = lambda password: (_ for _ in ()).throw(Exception("Simulated Save Error"))
        data = {"newPassword": "NewPassword123", "confirmPassword": "NewPassword123"}
        response = self.client.post(f'/change-password/{self.uidb64}/{self.token}/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Error in updating and saving password')