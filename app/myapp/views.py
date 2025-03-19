# from django.contrib.auth.models import User
# from django.core.mail import send_mail
# from django.urls import reverse
# from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# from django.utils.encoding import force_bytes, force_str
# from django.template.loader import render_to_string
# from django.contrib.auth.tokens import default_token_generator
# from django.contrib.auth.decorators import login_required

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from myapp.forms import *



def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user  is not None:
                login(request, user)
                return redirect('home')  # Redirect to a home page or any other page
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def home(request):
    # Your logic here (e.g., checking conditions, processing data, etc.)
    message = "Welcome to the Home Page!"
    items = ['Item 1', 'Item 2', 'Item 3']

    context = {
        'message': message,
        'items': items
    }
    return render(request, 'home.html', context)


def index(request):
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
