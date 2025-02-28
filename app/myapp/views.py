from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
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