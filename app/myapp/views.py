from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from myapp.forms import *
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.http import Http404
from myapp.models import your_table

from django.http import JsonResponse
from django.contrib.auth.hashers import check_password

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect

from django.core.mail import send_mail
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .models import *
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
import time

env = os.environ.get('DJANGO_ENV', 'None')

if env == 'production':
    frontend_url = 'https://archaeovault.com'
else:
    frontend_url = 'http://localhost:3000'


@csrf_protect
def login_view(request):
    # print(request.body)
    if request.method == 'POST':
        try:
            # Parse JSON body manually since it's being sent as JSON
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            #print('Checking all fields are filled')
            if not email or not password:
                return JsonResponse({"status": "error", "message": "Email and password are required."}, status=400)

            # Try to get the user by email

            try:
                user = users.objects.get(email=email)

                # Now authenticate using the user's username and password
                if password != user.upassword:  # Compare hashed password
                    return JsonResponse({'status':'error','message':'Passwords do not match'}, status = 400)
            
                if user is not None:
                    request.session['user_email'] = user.email #stores users email for current session to be used later
                   
                    return JsonResponse({
                        "status": "ok",
                        "user": {
                            "email": user.email,
                            "upermission": user.upermission.numval
                        }
                    }, status=200)
                else:
                    return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=400)
            except users.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON format."}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)
  
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')

            if not username or not password or not email:
                return JsonResponse({'error': 'Missing fields'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            user = User.objects.create_user(username=username, password=password, email=email)
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def home(request):
    return redirect('http://localhost:3000')

def index(request):
    return redirect('http://localhost:3000')

def get_csrf_token(request):
    #Returns CSRF token to the frontend for client-side use
    csrf_token = get_token(request)
    print('Cookie: ', csrf_token)
    return JsonResponse({'csrfToken': csrf_token}, safe=False)

@csrf_protect
def create_user_view(request):
    #print(request)
    if request.method == 'POST':
        try:
            # Parsing the incoming JSON data
            data = json.loads(request.body)
            username = data.get('first_name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            # Validation logic
            #print('checking if all fields filled')
            if not all([email, password,confirm_password]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            #print('checking if password match')
            if password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match'}, status=400)
            #print('checking if object already exists')
            if users.objects.filter(email=email).exists():
                #print('object already exists')
                return JsonResponse({'error': 'User with this email already exists'}, status=400)
            #print('validating email')
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({'error': 'Invalid email address'}, status=400)

            # Create the user
            #print('Creating user')
            permission = permissions.objects.get(numval = 4, givenrole = 'GeneralPublic')
            user = users.objects.create(
                email=email,
                upassword=password,
                activated = True,
                upermission = permission
            )
            #print('after creating user')
            #print(user.email)
            return JsonResponse({'message': 'User created successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def newport_artifacts_view(request):
    # Optimize related lookups and filter by Newport
    start_time = time.time()
    page = int(request.GET.get("page", 1))
    per_page = int(request.GET.get("per_page", 10))

    artifacts = your_table.objects.filter(
        address__countyorcity__icontains="newport"
    ).values(
        'id',
        'object_name',
        'object_description',
        'date_excavated',
        'scanned_3d__id',
        'printed_3d__id',
        'organic_inorganic__id',
        'material_of_manufacture__id',
        'address__countyorcity'
    )

    paginator = Paginator(artifacts, per_page)
    page_obj = paginator.get_page(page)

    artifact_data = list(page_obj)

    end_time = time.time()  # End timing
    duration = end_time - start_time
    print("Database fetching: ", duration)
    return JsonResponse({
        'artifacts': artifact_data,
        'page': page,
        'total_pages': paginator.num_pages,
        'total_artifacts': paginator.count,
    }, status=200)

def portsmouth_artifacts_view(request):
    # Optimize related lookups and filter by Newport
    artifacts = your_table.objects.select_related(
        "address",
        "scanned_3d",
        "printed_3d",
        "organic_inorganic",
        "material_of_manufacture"
    ).filter(address__countyorcity__icontains="portsmouth")

    artifact_data = [
        {
            'id': artifact.id,
            'object_name': artifact.object_name,
            'object_description': artifact.object_description,
            'date_excavated': artifact.date_excavated.isoformat(),
            'scanned_3d': artifact.scanned_3d.id,
            'printed_3d': artifact.printed_3d.id,
            'organic_inorganic': artifact.organic_inorganic.id,
            'material_of_manufacture': artifact.material_of_manufacture.id,
            'countyorcity': artifact.address.countyorcity,
        }
        for artifact in artifacts
    ]

    return JsonResponse({'artifacts': artifact_data}, status=200)

def all_artifacts_view(request):

    artifacts = your_table.objects.all()


    artifact_data = [
        {
            'address': artifact.address.id, #removed .id
            'countyorcity': artifact.address.countyorcity,
            #'owner': artifact.owner,
            #'date_collected': artifact.date_collected.isoformat(),
            #'catalog_number': artifact.catalog_number,
            'object_name': artifact.object_name, #needed
            'scanned_3d': artifact.scanned_3d.id,
            'printed_3d': artifact.printed_3d.id,
            #'scanned_by': artifact.scanned_by,
            'date_excavated': artifact.date_excavated.isoformat(),
            #'object_dated_to': artifact.object_dated_to,
            'object_description': artifact.object_description, #needed
            'organic_inorganic': artifact.organic_inorganic.id,
            #'species': artifact.species.id,
            'material_of_manufacture': artifact.material_of_manufacture.id,
            #'form_object_type': artifact.form_object_type.id,
            #'quantity': artifact.quantity,
            #'measurement_diameter': artifact.measurement_diameter,
            #'length': artifact.length,
            #'width': artifact.width,
            #'height': artifact.height,
            #'measurement_notes': artifact.measurement_notes,
            #'weight': artifact.weight,
            #'weight_notes': artifact.weight_notes,
            #'sivilich_diameter': artifact.sivilich_diameter,
            #'deformation_index': artifact.deformation_index,
            #'conservation_condition': artifact.conservation_condition.id,
            #'cataloguer_name': artifact.cataloguer_name,
            #'cataloguer_name': artifact.cataloguer_name.email, #trash
            #'date_catalogued': artifact.date_catalogued.isoformat(),
            #'location_in_repository': artifact.location_in_repository,
            #'platlot': artifact.platlot,
            #'found_at_depth': artifact.found_at_depth,
            #'longitude': artifact.longitude,
            #'latitude': artifact.latitude,
            #'distance_from_datum': artifact.distance_from_datum,
            #'found_in_grid': artifact.found_in_grid.id,
            #'excavator': artifact.excavator,
            #'notes': artifact.notes,
            #'images': artifact.images,
            #'data_double_checked_by': artifact.data_double_checked_by,
            #'qsconcerns': artifact.qsconcerns,
            #'druhlcheck': artifact.druhlcheck,
            #'sources_for_id': artifact.sources_for_id,
            #'location': artifact.location,
            #'storage_location': artifact.storage_location,
            #'uhlflages': artifact.uhlflages,
            'id': artifact.id, #needed
            
            
        } for artifact in artifacts
    ]

    

    # Return data as JSON response
    return JsonResponse({'artifacts': artifact_data}, status = 200)

def activate(request, uidb64, token):
    #put boolean that sets user active to true
    uid = urlsafe_base64_decode(uidb64)
    user = User.objects.get(email = uid)
    if user is not None and account_activation_token.check_token(user, token):
        user.activated = True
        user.save()
        return render(request, 'home.html')

    

def resend_verification_view(request):
    if(request.method == 'POST'):
        data = json.loads(request.body)
        email = data.get('email')
        if(users.objects.filter(email = email).exists()):
            #generates the uid and token
            user = users.objects.get(email = email)
            uid = urlsafe_base64_encode(force_bytes(user.email))
            token = account_activation_token.make_token(user)
            verification_link = request.build_absolute_uri(
                reverse('activate', kwargs={'uidb64': uid, 'token': token})
            )
            message = Mail(
                from_email='noreply@archaeovault.com',
                to_emails=user.email,
                subject='Welcome to ArchaeoVault!',
                html_content=(
                    f'<h2>Follow this link below to verify account and reset password.</h2>'
                    f'<a href="{verification_link}">Verify your email address</a>'
                )
            )
            try:
                sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
                response = sg.send(message)
                print(response.status_code)
                #print(response.body)
                # #print(response.headers)
            except Exception as e:
                print(str(e) + ' didnt work')
            return JsonResponse({'message': 'Verification email has been sent'}, status=200)
        else:
            return JsonResponse({'error': 'Email address not associated with an account'}, status=400)
    return JsonResponse({ "status": "ok",}, status=200)

def change_password_view(request):
    if request.method == 'POST':
        try: 
            data = json.loads(request.body)
            email = data.get('email')
            newPassword = data.get('newPassword')
            confirmPassword = data.get('confirmPassword')
            if not users.objects.filter(email=email).exists():
                return JsonResponse({'error':'User with this email does not exist'}, status = 400)
            if newPassword != confirmPassword:
                return JsonResponse({'error':'Passwords do not match'}, status = 400)
            user = users.objects.get(email = email)
            if newPassword == user.upassword:
                return JsonResponse({'error':'New Password can not be the same as the old password'}, status = 400)
            if account_activation_token.check_token(user, token):
                try:
                    print('Changing password')
                    user.upassword = newPassword
                    user.save()
                except Exception as e:
                    print('Error resetting')
                    return JsonResponse({'error':'Error in updating and saving password'}, status = 400)
            else:
                return JsonResponse({'error':'Token is invalid'}, status = 400)
            return JsonResponse({'message':'Password successfully reset'}, status = 200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error':'Error changing password'},status = 400)
