from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from myapp.forms import *
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.http import JsonResponse
import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect



def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user  is not None:
                login(request, user)
                return redirect('http://localhost:3000')  # Redirect to a home page or any other page
    else:
        form = LoginForm()
    return redirect('http://localhost:3000')

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
                return JsonResponse({'error': 'Usa with this email already exists'}, status=400)

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

def send_reset_password_email_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if not User.objects.filter(username=email).exists():
            return HttpResponse('Error: User with this email does not exist', status = 400)
        try:
            validate_email(email)
        except ValidationError as e:
            return HttpResponse('Error: Not a valid email address', status = 400)
        # generate stuff for the email and then send it(link to change password page or send a code depending on what we choose)
        #generates the uid and token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator()

        message = Mail(
            from_email='noreply@archaeovault.com',
            to_emails=user.email,
            subject='Welcome to ArchaeoVault!',
            html_content=(
                f'<h2>Thank you for registering for ArchaeoVault, we really hope you enjoy!'
                f'Click on the link below to reset your password.</h2>'
                f'<a href="'protocol'://'domain'/change_password/'uid'/'token'/">Reset your password</a>'
            )
        )

        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(response.status_code)
            #print(response.body)
            #print(response.headers)
        except Exception as e:
            print(str(e) + ' didnt work')
        return HttpResponse('Email successfully sent', status = 200)
    else:
        return HttpResponse('Error resetting password', status = 400)
    
def change_password_view(request):
    if request.method == 'POST':
        try: 
            data = json.loads(request.body)
            # uid = urlsafe_base64_decode(uid64)
            email = data.get('email')
            newPassword = data.get('newPassword')
            confirmPassword = data.get('confirmPassword')
            if not User.objects.filter(username=email).exists():
                return JsonResponse({'error':'User with this email does not exist'}, status = 400)
            if newPassword != confirmPassword:
                return JsonResponse({'error':'Passwords do not match'}, status = 400)
            user = User.objects.get(username = email)
            if check_password(newPassword, user.password):
                return JsonResponse({'error':'New Password can not be the same as the old password'}, status = 400)
            try:
                user.set_password(newPassword)
                user.save()
            except Exception as e:
                return JsonResponse({'error':'Error in updating and saving password'}, status = 400)
            return JsonResponse({'message':'Password successfully reset'}, status = 200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error':'Error changing password'},status = 400)

