from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from myapp.forms import *
from django.http import JsonResponse
import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect

def login_view(request):
    print(request.body)
    if request.method == 'POST':
        try:
            # Parse JSON body manually since it's being sent as JSON
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            if not email or not password:
                return JsonResponse({"status": "error", "message": "Email and password are required."}, status=400)

            # Try to get the user by email
            try:
                # Get user by email
                user = User.objects.get(email=email)

                # Now authenticate using the user's username and password
                user = authenticate(request, username=user.username, password=password)

                if user is not None:
                    login(request, user)
                    return JsonResponse({"status": "ok"}, status=200)
                else:
                    return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=400)
            except User.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON format."}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)

def home(request):
    return redirect('http://localhost:3000')


def index(request):
    return redirect('http://localhost:3000')

def get_csrf_token(request):
    """Returns CSRF token to the frontend for client-side use"""
    csrf_token = get_token(request)
    print('Cookie: ', csrf_token)
    return JsonResponse({'csrfToken': csrf_token}, safe=False)

@csrf_protect
def create_user_view(request):
    print(request)
    if request.method == 'POST':
        try:
            # Parsing the incoming JSON data
            data = json.loads(request.body)

            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            # Validation logic
            if not all([first_name, last_name, email, password, confirm_password]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            if password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match'}, status=400)
            if User.objects.filter(username=email).exists():
                return JsonResponse({'error': 'User with this email already exists'}, status=400)

            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({'error': 'Invalid email address'}, status=400)

            # Create the user
            user = User.objects.create_user(
                username=email,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password
            )
            print(user)
            return JsonResponse({'message': 'User created successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)