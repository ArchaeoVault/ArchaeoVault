from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from myapp.forms import *
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.http import Http404
from myapp.models import Artifact
from django.http import JsonResponse


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




def all_artifacts_view(request):

    artifacts = Artifact.objects.all()


    artifact_data = [
        {
            'address': artifact.address.id,
            'owner': artifact.owner,
            'date_collected': artifact.date_collected.isoformat(),
            'catalog_number': artifact.catalog_number,
            'object_name': artifact.object_name,
            'scanned_3d': artifact.scanned_3d.id,
            'printed_3d': artifact.printed_3d.id,
            'scanned_by': artifact.scanned_by,
            'date_excavated': artifact.date_excavated.isoformat(),
            'object_dated_to': {
                'id': artifact.object_dated_to.id,
                'from_date': artifact.object_dated_to.from_date.isoformat(),
                'to_date': artifact.object_dated_to.to_date.isoformat()
            },
            'object_description': artifact.object_description,
            'organic_inorganic': artifact.organic_inorganic.id,
            'species': artifact.species.id,
            'material_of_manufacture': artifact.material_of_manufacture.id,
            'form_object_type': artifact.form_object_type.id,
            'quantitiy': artifact.quantitiy,
            'measurement_diameter': artifact.measurement_diameter,
            'length': artifact.length,
            'width': artifact.width,
            'height': artifact.height,
            'measurement_notes': artifact.measurement_notes,
            'weight': artifact.weight,
            'weight_notes': artifact.weight_notes,
            'sivilich_diameter': artifact.sivilich_diameter,
            'deformation_index': artifact.deformation_index,
            'conservation_condition': artifact.conservation_condition.id,
            'cataloguer_name': artifact.cataloguer_name.email,
            'date_catalogued': artifact.date_catalogued.isoformat(),
            'location_in_repository': artifact.location_in_repository,
            'platlot': artifact.platlot,
            'found_at_depth': artifact.found_at_depth,
            'longitude': artifact.longitude,
            'latitude': artifact.latitude,
            'distance_from_datum': artifact.distance_from_datum,
            'found_in_grid': artifact.found_in_grid.id,
            'exacavator': artifact.exacavator,
            'notes': artifact.notes,
            'images': artifact.images.id,
            'data_double_checked_by': artifact.data_double_checked_by,
            'qsconcerns': artifact.qsconcerns,
            'druhlcheck': artifact.druhlcheck,
            'sources_for_id': artifact.sources_for_id,
            'location': artifact.location,
            'storage_location': artifact.storage_location,
            'uhlflages': artifact.uhlflages,
            
            
        } for artifact in artifacts
    ]

    

    # Return data as JSON response
    return JsonResponse({'artifacts': artifact_data}, status = 200)



