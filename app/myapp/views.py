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
    
def change_password_view(request, uid64, token):
    if request.method == 'POST':
        uid = urlsafe_base64_decode(uid64)
        newPassword = request.POST.get('newPassword')
        confirmPassword = request.POST.get('confirmPassword')
        # makes sure the user trying to change password actually exists
        if not User.objects.filter(username=email).exists():
            return HttpResponse('Error: User with this email does not exist', status = 400)
        # make sure the new and confirm password match 
        if newPassword != confirmPassword:
            return HttpResponse('Error: Passwords do not match', status = 400)
        # checks to make sure the new password is not the same as the current
        user = User.objects.get(uid = uid)
        if check_password(newPassword, user.password):
            return HttpResponse('Error: New Password can not be the same as the old password', status = 400)
        try:
            user.set_password(newPassword)
            user.save()
        except Exception as e:
            return HttpResponse('Error in updating password', status = 400)
        
        return HttpResponse('Password successfully changed', status = 200)
    else:
        return HttpResponse('Error changing password', status = 400)