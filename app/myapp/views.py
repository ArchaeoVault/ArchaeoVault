import os
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from myapp.forms import *
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .forms import UserRegistrationForm
from .models import *
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'success', 'message': 'Login successful'}, status=200)
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)



def create_user_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if not all([email, password, confirm_password]):
            return HttpResponse('Error: All fields are required', status=400)

        if password != confirm_password:
            return HttpResponse('Error: Passwords do not match', status=400)

        if User.objects.filter(email=email).exists():
            return HttpResponse('Error: User with this email already exists', status=400)

        try:
            validate_email(email)
        except ValidationError:
            return HttpResponse('Error: Enter a valid email address', status=400)

        user = UserProfile.objects.create_user(
            email=email,
            password=password,
            activated=False
        )
        request.session['user_session'] = user
        user.is_active = False  # Deactivate account until it is confirmed
        #user.save()

        #generates the uid and token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        verification_link = request.build_absolute_uri(
            reverse('activate', kwargs={'uidb64': uid, 'token': token})
        )

        message = Mail(
            from_email='noreply@archaeovault.com',
            to_emails=user.email,
            subject='Welcome to ArchaeoVault!',
            html_content=(
                f'<h2>Thank you for registering for ArchaeoVault, we really hope you enjoy! '
                f'Click on the link below to verify your email address.</h2>'
                f'<a href="{verification_link}">Verify your email address</a>'
            )
        )

        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(str(e) + ' didnt work')

        return HttpResponse('User has been created and a verification email has been sent', status=200)
    else:
        form = UserRegistrationForm()
    return render(request, 'createuser.html', {'form': form})

def activate(request, uidb64, token):
    #put boolean that sets user active to true
    username = request.session.get('user_session', 'Guest')
    username.activated = True
    username.save()
    return render(request, 'home.html')

def index(request):
    return render(request,'index.html')
