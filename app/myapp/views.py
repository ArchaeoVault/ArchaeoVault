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
            # Parse JSON data from request
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            # Authenticate user
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'success', 'message': 'Login successful'}, status=200)
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)



def create_user(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.is_active = False 
            user.save()

            #this generates the uid
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

            return redirect('login') 
    else:
        form = UserRegistrationForm()
    return render(request, 'createuser.html', {'form': form})

def activate(request, uidb64, token):
    #put boolean that sets user active to true
    return render(request, 'activation_success.html')

def index(request):
<<<<<<< HEAD
    frontend_path = os.path.join('frontend', 'src', 'homepage.js')
    return FileResponse(open(frontend_path, 'rb'), content_type='application/javascript')
=======
    # Define the context to pass to the template
    context = {
        'message': 'Welcome to the Index Page!',
        'items': ['Item 1', 'Item 2', 'Item 3']
    }
    return render(request, 'index.html', context)

def create_user_view(request):
    if request.method == 'POST':
        #Get info from the post request
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        #checks that all required fields are filled out
        if not all([first_name, last_name, email, password, confirm_password]):
            return HttpResponse('Error: All fields are required', status=400)
        #checks if the two passwords match
        if password != confirm_password:
            return HttpResponse('Error: Passwords do not match', status = 400)
        #checks that a user does not exist with that email
        if User.objects.filter(username = email).exists():
            return HttpResponse('Error: User with this email already exists', status = 400)
        try:
            validate_email(email)
        except ValidationError as e:
            return HttpResponse('Error: Enter a valid email address', status = 400)

        #create user object
        user = User.objects.create_user(
            username = email,
            first_name = first_name,
            last_name = last_name,
            email = email,
            password = password
        )
        return HttpResponse('User has been created', status = 200)
    else:
        return HttpResponse('Error creating user', status = 400)
>>>>>>> ee3ab4573fe57cfbca1533e1cd92f3d1271d8801
