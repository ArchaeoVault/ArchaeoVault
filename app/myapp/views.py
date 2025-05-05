from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.template import TemplateDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from myapp.forms import *
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.http import Http404
from myapp.models import *
from django.views.generic import TemplateView
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
from django.utils.encoding import force_str
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
                user = users.objects.get(email=email)
                print("user found in database")
                # Now authenticate using the user's username and password
                if password != user.upassword:  # Compare hashed password
                    return JsonResponse({'status':'error','message':'Passwords do not match'}, status = 400)
            
                if user is not None:
                    request.session['user_email'] = user.email #stores users email for current session to be used later
                    request.session['is_authenticated'] = True
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

@csrf_protect
def get_user_permission(request):
    email = request.session.get('user_email')
    if not email:
        return JsonResponse({'error': 'User not logged in'}, status=401)
    try:
        user = users.objects.get(email=email)
        return JsonResponse({'upermission': user.upermission.numval}, status=200)
    except users.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

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
    return redirect(frontend_url)

def index(request):
    return redirect(frontend_url)

def get_csrf_token(request):
    #Returns CSRF token to the frontend for client-side use
    csrf_token = get_token(request)
    print('Cookie: ', csrf_token)
    return JsonResponse({'csrfToken': csrf_token}, safe=False)


@csrf_protect
def create_user_view(request):
    if request.method == 'POST':
        try:
            # Parsing the incoming JSON data
            data = json.loads(request.body)
            username = data.get('first_name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            # Validation logic
            if not all([email, password,confirm_password]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            if password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match'}, status=400)
            if users.objects.filter(email=email).exists():
                return JsonResponse({'error': 'User with this email already exists'}, status=400)
            try:
                validate_password(password)
            except ValidationError as e:
                return JsonResponse({'error': "Password cannot be 'password', must have at least 8 characters, and must have letters."}, status=400)
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({'error': 'Invalid email address'}, status=400)

            permission = permissions.objects.get(numval = 4, givenrole = 'GeneralPublic')
            user = users.objects.create(
                email=email,
                upassword=password,
                activated = True,
                upermission = permission
            )
            return JsonResponse({'message': 'User created successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def newport_artifacts_view(request):

    # Optimize related lookups and filter by Newport
    
    artifacts = your_table.objects.select_related(
        "address",
        "scanned_3d",
        "printed_3d",
        "organic_inorganic",
        "material_of_manufacture"
    ).filter(address__countyorcity__icontains="newport")

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
            'address_id': artifact.address.id,
            'countyorcity': artifact.address.countyorcity,
        }
        for artifact in artifacts
    ]

    return JsonResponse({'artifacts': artifact_data}, status=200)


def portsmouth_artifacts_view(request):
    # Optimize related lookups and filter by Portsmouth
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
            'address_id': artifact.address.id,
            'countyorcity': artifact.address.countyorcity,
        }
        for artifact in artifacts
    ]

    return JsonResponse({'artifacts': artifact_data,}, status=200)

def all_artifacts_view(request):

    artifacts = your_table.objects.all()
    print(artifacts)

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
    return JsonResponse({'artifacts': artifact_data,}, status = 200)


def single_artifact_view(request):
    if request.method == 'POST':
        try:
            # Parsing the incoming JSON data
            data = json.loads(request.body)
            provided_id = data.get('id')
            artifacts = your_table.objects.filter(id = provided_id)
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
                    'object_dated_to': artifact.object_dated_to,
                    'object_description': artifact.object_description,
                    'organic_inorganic': artifact.organic_inorganic.id,
                    'species': artifact.species.id,
                    'material_of_manufacture': artifact.material_of_manufacture.id,
                    'form_object_type': artifact.form_object_type.id,
                    'quantity': artifact.quantity,
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
                    'cataloguer_name': artifact.cataloguer_name,
                    'date_catalogued': artifact.date_catalogued.isoformat(),
                    'location_in_repository': artifact.location_in_repository,
                    'platlot': artifact.platlot,
                    'found_at_depth': artifact.found_at_depth,
                    'longitude': artifact.longitude,
                    'latitude': artifact.latitude,
                    'distance_from_datum': artifact.distance_from_datum,
                    'found_in_grid': artifact.found_in_grid.id,
                    'excavator': artifact.excavator,
                    'notes': artifact.notes,
                    'images': artifact.images,
                    'data_double_checked_by': artifact.data_double_checked_by,
                    'qsconcerns': artifact.qsconcerns,
                    'druhlcheck': artifact.druhlcheck,
                    'sources_for_id': artifact.sources_for_id,
                    'location': artifact.location,
                    'storage_location': artifact.storage_location,
                    'uhlflages': artifact.uhlflages,
                    'id': artifact.id
                } for artifact in artifacts
            ]

            # Return data as JSON response
            return JsonResponse({'artifacts': artifact_data,}, status = 200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def all_image_table_view(request):
    images = imagetable.objects.all()

    image_data = [
    {
        'id': image.id,
        'artifact_id': image.your_table.id,
        'filepath': image.filepath,
    }
        for image in images
    ]

    return JsonResponse({'images': image_data,}, status = 200)



def activate(request, uidb64, token):
    #put boolean that sets user active to true
    if(request.method == 'GET'):
        try:
            email = urlsafe_base64_decode(uidb64) # Decodes the base64 encoded email
            email = force_str(email)  # Convert bytes to string
            user = users.objects.get(email = email)
        except Exception as e:
            return JsonResponse({'error':'Invalid email'},status = 400)
        if account_activation_token.check_token(user, token):
            try:
                user.activated = True
                user.save()
                return JsonResponse({'message':'User activation successful'},status = 200)
                # Redirect to the frontend verification page
            except Exception as e:
                return JsonResponse({'error':'User activation failed'},status = 400)
        else:
            return JsonResponse({'error':'Invalid token'},status = 400)
    else:
        return JsonResponse({'error':'Invalid request method'},status = 400)

def redirect_change_password(request, uidb64, token):
    if(request.method == 'GET'):
        try:
            email = urlsafe_base64_decode(uidb64) # Decodes the base64 encoded email
            email = force_str(email)  # Convert bytes to string
            user = users.objects.get(email = email)
        except Exception as e:
            return JsonResponse({'error':'Invalid email'},status = 400)
        if account_activation_token.check_token(user, token):
            try:
                if os.environ.get('DJANGO_ENV') == 'production':
                    frontend_url = 'https://www.archaeovault.com'
                else:
                    frontend_url = 'http://localhost:3000'
                return redirect(f'{frontend_url}/api/change_password/{uidb64}/{token}/')
            except Exception as e:
                return JsonResponse({'error':'Redirect failed'},status = 400)
        else:
            return JsonResponse({'error':'Invalid token'},status = 400)
    else:
        return JsonResponse({'error':'Invalid request method'},status = 400)

    


    

def resend_verification_view(request):
    if(request.method == 'POST'):
        data = json.loads(request.body)
        email = data.get('email')
        if(users.objects.filter(email = email).exists()):
            #generates the uid and token
            user = users.objects.get(email = email)
            uid = urlsafe_base64_encode(force_bytes(user.email))
            print('uid: ', uid)
            token = account_activation_token.make_token(user)
            verification_link = request.build_absolute_uri(
                reverse('activate', kwargs={'uidb64': uid, 'token': token})
            )
            message = Mail(
                from_email='noreply@archaeovault.com',
                to_emails=user.email,
                subject='Welcome to ArchaeoVault!',
                html_content=(
                    f'<h2>Follow this link below to verify account.</h2>'
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

def send_password_reset_view(request):
    if(request.method == 'POST'):
        data = json.loads(request.body)
        email = data.get('email')
        if(users.objects.filter(email = email).exists()):
            #generates the uid and token
            user = users.objects.get(email = email)
            uid = urlsafe_base64_encode(force_bytes(user.email))
            print('uid: ', uid)
            token = account_activation_token.make_token(user)
            verification_link = request.build_absolute_uri(
                reverse('redirect_change_password', kwargs={'uidb64': uid, 'token': token})
            )
            message = Mail(
                from_email='noreply@archaeovault.com',
                to_emails=user.email,
                subject='Reset ArchaeoVault Password!',
                html_content=(
                    f'<h2>Follow this link below to reset password.</h2>'
                    f'<a href="{verification_link}">Change your password</a>'
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

def change_password_view(request, uidb64, token):
    if request.method == 'POST':
        try: 
            data = json.loads(request.body)
            email = urlsafe_base64_decode(uidb64)
            newPassword = data.get('newPassword')
            confirmPassword = data.get('confirmPassword')

            if not users.objects.filter(email=email).exists():
                return JsonResponse({'error':'User with this email does not exist'}, status = 400)
            if newPassword != confirmPassword:
                return JsonResponse({'error':'Passwords do not match'}, status = 400)
            user = users.objects.get(email = email)
            if newPassword == user.upassword:
                return JsonResponse({'error':'New Password can not be the same as the old password'}, status = 400)
            if newPassword == "":
                return JsonResponse({'error':'Password must not be empty'}, status = 400)
            if account_activation_token.check_token(user, token):
                try:
                    print('Changing password')
                    user.upassword = newPassword
                    user.save()
                except Exception as e:
                    print('Error resetting password', e)
                    return JsonResponse({'error':'Error in updating and saving password'}, status = 400)
            else:
                return JsonResponse({'error':'Token is invalid'}, status = 400)
            return JsonResponse({'message':'Password successfully reset'}, status = 200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error':'Error changing password'},status = 400)
    elif(request.method == 'GET'):
        try:
            return render(request, 'frontend/src/ResetPassword.js')
        except Exception as e:
            return JsonResponse({'error':'Render failed'},status = 400)
    else:
        return JsonResponse({'error':'Invalid request method'},status = 400)
        


def get_email_from_token(request, uidb64, token):
    try:
        email = force_str(urlsafe_base64_decode(uidb64))
        user = users.objects.get(email=email)
    except Exception as e:
        return JsonResponse({'error': 'Invalid token or email'}, status=400)

    if account_activation_token.check_token(user, token):
        return JsonResponse({'email': user.email}, status=200)
    else:
        return JsonResponse({'error': 'Invalid token'}, status=400)
    
def delete_artifact_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            #print('In try')
            
            email = request.session.get('user_email') #gets current sessions email
            # print(email)
            artifactId = data.get('id')
            #print('Getting user')
            if not users.objects.filter(email=email).exists():
                #print('User does not exist')
                return JsonResponse({'error':'User with this email does not exist'}, status = 401)
            user = users.objects.get(email = email)
            #print('got user')
            numberValue = user.upermission.numval
            if numberValue == 4:
                #print('Cant be gen pub')
                return JsonResponse({'error':'General Public can not delete artifacts'}, status = 402)
            if not your_table.objects.filter(id = artifactId).exists():
                #print('Artifact dont exist')
                return JsonResponse({'error':'Artifact you are trying to delete does not exist'}, status = 403)
            try:
                artifact = your_table.objects.get(id = artifactId)
                artifact.delete()
                if not your_table.objects.filter(id = artifactId).exists():
                    #print('Artifact delete')
                    return JsonResponse({'message':'Artifact successfully deleted'}, status = 200)
            except Exception as e:
                #print('In inner exception')
                return JsonResponse ({'error':'Error in deleting artifact'}, status = 400)
        except Exception as e:
            #print('Outer exception')
            return JsonResponse ({'error':'Error in deleting artifact'}, status = 400)
        

def assign_optional_fk(obj, field_name, model, data_value):
    if data_value == '':
        data_value = None
    if data_value is not None:
        try:
            setattr(obj, field_name, model.objects.get(id=data_value))
        except model.DoesNotExist:
            raise ValueError(f'{field_name} with id={data_value} not found')
    else:
        setattr(obj, field_name, None)

@csrf_protect
def edit_artifact_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = request.session.get('user_email')
            artifact_id = data.get('id')
            
            if not (email and artifact_id):
                return JsonResponse({'error': 'Email and artifact ID are required'}, status=400)

            if not users.objects.filter(email=email).exists():
                return JsonResponse({'error': 'User with this email does not exist'}, status=401)

            user = users.objects.get(email=email)
            if user.upermission.numval == 4:
                return JsonResponse({'error': 'General Public cannot edit artifacts'}, status=402)
            
            artifact = your_table.objects.filter(id=artifact_id).first()
            if not artifact:
                return JsonResponse({'error': 'Artifact does not exist'}, status=403)

            # Optional FKs
            
            try:
                assign_optional_fk(artifact, 'material_of_manufacture', materialtype, data.get('material_of_manufacture'))
                assign_optional_fk(artifact, 'address', address, data.get('address'))
                # Add others here as needed
            except ValueError as e:
                return JsonResponse({'error': str(e)}, status=404)

            # Non-FK fields
            
            field_mapping = {
                'name': 'object_name',
                'description': 'object_description',
                'location': 'location',
                'age': 'object_dated_to',
                'length_mm': 'length_mm',
                'width_mm': 'width_mm',
                'height_mm': 'height_mm',
                'measurement_notes': 'measurement_notes',
                'weight_grams': 'weight_grams',
                'weight_notes': 'weight_notes',
                'sivilich_diameter_in': 'sivilich_diameter_in',
                'deformation_index': 'deformation_index',
                'condition': 'condition',
                'cataloger_name': 'cataloger_name',
                'date_catalogued': 'date_catalogued',
                'location_repository': 'location_repository',
                'plat_lot': 'plat_lot',
                'depth': 'depth',
                'longitude': 'longitude',
                'latitude': 'latitude',
                'distance_from_datum': 'distance_from_datum',
                'grid': 'grid',
                'excavator': 'excavator',
                'notes': 'notes',
                'image': 'image',
                'double_checked_by': 'double_checked_by',
                'questions': 'questions',
                'uhl_check': 'uhl_check',
                'sources': 'sources',
                'location_general': 'location_general',
                'storage_location': 'storage_location',
                'uhl_flags': 'uhl_flags',
                'owner': 'owner',
                'accessor_number': 'accessor_number',
                'catalog_number': 'catalog_number',
            }
            
            for frontend_key, model_field in field_mapping.items():
                if frontend_key in data:
                    setattr(artifact, model_field, data[frontend_key] or None)
            if artifact.address_id == None:
                artifact.address_id = 1
            if artifact.material_of_manufacture_id == None:
                artifact.material_of_manufacture_id = 61
            
            artifact.save()
            return JsonResponse({'message': 'Artifact successfully edited'}, status=200)

        except Exception as e:
            print('In outer exception')
            return JsonResponse({'error': f'Error in editing artifact: {str(e)}'}, status=400)
@csrf_protect
def add_artifact_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Basic required fields
            print("Received data keys:", data.keys())
            artifact = your_table.objects.create(
                object_name=data['object_name'],
                object_description=data['object_description'],
                date_excavated=data['date_excavated'],
                location=data['location'],

                # Optional fields
                address_id=data.get('address'),
                owner=data.get('owner'),
                #accessor_number=data.get('accessor_number'),
                catalog_number=data.get('catalog_number'),
                scanned_3d_id=data.get('scanned_3d'),
                printed_3d_id=data.get('printed_3d'),
                scanned_by=data.get('scanned_by'),
                object_dated_to=data.get('object_dated_to'),
                organic_inorganic_id=data.get('organic_inorganic'),
                species_id=data.get('species'),
                material_of_manufacture_id=data.get('material_of_manufacture'),
                form_object_type_id=data.get('form_object_type'),
                quantity=data.get('quantity'),
                measurement_diameter=data.get('measurement_diameter'),
                length=data.get('length'),
                width=data.get('width'),
                height=data.get('height'),
                measurement_notes=data.get('measurement_notes'),
                weight=data.get('weight'),
                weight_notes=data.get('weight_notes'),
                sivilich_diameter=data.get('sivilich_diameter'),
                deformation_index=data.get('deformation_index'),
                conservation_condition_id=data.get('conservation_condition'),
                cataloguer_name=data.get('cataloguer_name'),
                date_catalogued=data.get('date_catalogued'),
                location_in_repository=data.get('location_in_repository'),
                platlot=data.get('platlot'),
                found_at_depth=data.get('found_at_depth'),
                longitude=data.get('longitude'),
                latitude=data.get('latitude'),
                distance_from_datum=data.get('distance_from_datum'),
                found_in_grid_id=data.get('found_in_grid'),
                excavator=data.get('excavator'),
                notes=data.get('notes'),
                images=data.get('images'),
                data_double_checked_by=data.get('data_double_checked_by'),
                qsconcerns=data.get('qsconcerns'),
                druhlcheck=data.get('druhlcheck'),
                sources_for_id=data.get('sources_for_id'),
                storage_location=data.get('storage_location'),
                uhlflages=data.get('uhlflages'),
            )
            print(f"Added artifact with ID {artifact.id}")
            return JsonResponse({'success': True, 'id': artifact.id})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

def admin_create_user_view(request):
    if request.method == 'POST':
        try:
            adminEmail = request.session.get('user_email') #gets current sessions email
            if not users.objects.filter(email=adminEmail).exists():
                #print('User does not exist')
                return JsonResponse({'error':'User with this email does not exist'}, status = 401)
            user = users.objects.get(email = adminEmail)
            numberValue = user.upermission.numval
            if numberValue != 1:
                return JsonResponse({'error':'Must be an admin to create another user'}, status = 402)
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')
            perm = data.get('permission')
            # Validation logic
            #print('checking if all fields filled')
            if not all([email, password,confirm_password,perm]):
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
            if perm == 'SuperAdmin': 
                permission = permissions.objects.get(givenrole = 'SuperAdmin')
                #print('getting perm')
            if perm == 'Researchers':
                permission = permissions.objects.get(givenrole = 'Researchers')
            elif perm == 'GeneralPublic':
                permission = permissions.objects.get(givenrole = 'GeneralPublic')
                #print('getting perm')
            else:
                return JsonResponse({'error':'Invalid Permission'}, status = 400)
            user = users.objects.create(
                email=email,
                upassword=password,
                activated = True,
                upermission = permission
            )
            #print('after creating user')
            #print(user.email)
            return JsonResponse({'message': 'User created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error':'Error in creating a user'}, status = 400)
        
def admin_edit_user_view(request):
    if request.method == 'POST':
        try:
            adminEmail = request.session.get('user_email')
            if not users.objects.filter(email=adminEmail).exists():
                return JsonResponse({'error': 'Admin user does not exist'}, status=401)

            adminUser = users.objects.get(email=adminEmail)
            if adminUser.upermission.numval != 1:
                return JsonResponse({'error': 'Only admins can edit users'}, status=402)

            data = json.loads(request.body)
            oldEmail = data.get('oldEmail')
            newEmail = data.get('newEmail')
            password = data.get('password')
            permission = data.get('permission')
            activated = data.get('activated')

            if not oldEmail:
                return JsonResponse({'error': 'Old email is required'}, status=400)

            if not users.objects.filter(email=oldEmail).exists():
                return JsonResponse({'error': 'User with the old email does not exist'}, status=400)

            user = users.objects.get(email=oldEmail)

            if newEmail:
                if newEmail != oldEmail and users.objects.filter(email=newEmail).exists():
                    return JsonResponse({'error': 'User with the new email already exists'}, status=400)
                try:
                    validate_email(newEmail)
                except ValidationError:
                    return JsonResponse({'error': 'Invalid email address'}, status=400)
                user.email = newEmail

            if password:
                user.upassword = password  # Replace with hashed password if possible

            if permission:
                if permission not in ['SuperAdmin', 'Researchers', 'GeneralPublic']:
                    return JsonResponse({'error': 'Invalid permission'}, status=400)
                user.upermission = permissions.objects.get(givenrole=permission)
            
            if activated is not None:
                user.activated = activated


            user.save()
            return JsonResponse({'message': 'User updated successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Error editing user: {str(e)}'}, status=400)
        
def admin_delete_user_view(request):
    if request.method == 'POST':
        try:
            adminEmail = request.session.get('user_email') #gets current sessions email
            if not users.objects.filter(email=adminEmail).exists():
                #print('User does not exist')
                return JsonResponse({'error':'User with this email does not exist'}, status = 401)
            user = users.objects.get(email = adminEmail)
            numberValue = user.upermission.numval
            if numberValue != 1:
                return JsonResponse({'error':'Must be an admin to edit another user'}, status = 402)
            data = json.loads(request.body)
            email = data.get('email')

            # Validation logic
            #print('checking if all fields filled')
            if not email:
                return JsonResponse({'error': 'All fields are required'}, status=400)
            #print('checking if object already exists')
            if not users.objects.filter(email=email).exists():
                #print('object already exists')
                return JsonResponse({'error': 'User with this email does not exist'}, status=400)
            
            # Create the user
            #print('Creating user')
            
            user = users.objects.get(email = email)
            
            user.delete()
            
            if not users.objects.filter(email = email).exists():
                    
                    return JsonResponse({'message':'User successfully deleted'}, status = 200)
            #print('after creating user')
            

        except Exception as e:
            return JsonResponse({'error':'Error in deleting a user'}, status = 400)
        
def admin_see_all_users_view(request):
    all_users = users.objects.all()

    all_users_data = [
        {
            'email':user.email,
            'password':user.upassword,
            'permission':user.upermission.givenrole,
            'activated':user.activated
        } for user in all_users
    ]
    return JsonResponse({'Users': all_users_data}, status = 200)
        
def admin_reset_user_password_view(request):
    if request.method == 'POST':
        try:
            adminEmail = request.session.get('user_email') #gets current sessions email
            if not users.objects.filter(email=adminEmail).exists():
                #print('User does not exist')
                return JsonResponse({'error':'User with this email does not exist'}, status = 401)
            user = users.objects.get(email = adminEmail)
            numberValue = user.upermission.numval
            if numberValue != 1:
                return JsonResponse({'error':'Must be an admin to reset another users password'}, status = 402)
            data = json.loads(request.body)
            email = data.get('email')
            newPassword = data.get('newPassword')
            confirmPassword = data.get('confirmPassword')

            # Validation logic
            #print('checking if all fields filled')
            if not all([email, newPassword,confirmPassword]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            #print('checking if object already exists')
            if not users.objects.filter(email=email).exists():
                #print('object already exists')
                return JsonResponse({'error': 'User with this email does not exist'}, status=400)
            #print('validating email')
            # Create the user
            #print('Creating user')
            user = users.objects.get(email = email)
            if newPassword == user.upassword:
                return JsonResponse({'error':'New Password can not be the same as the old password'}, status = 400)
            if newPassword != confirmPassword:
                return JsonResponse({'error':'New and Confirm passwords do not match'}, status = 400)
            try:
                user.upassword = newPassword
                user.save()
                return JsonResponse({'message':'Password successfully changed'}, status = 200)
            except Exception as e:
                return JsonResponse({'error':'Error trying to change password'}, status = 400)
            
        except Exception as e:
            #print('Outer exception')
            return JsonResponse ({'error':'Error in editing artifact'}, status = 400)
        
def logout_view(request):
    request.session.flush()  # Clears all session data, logs out the user
    return JsonResponse({'status': 'ok', 'message': 'Logged out'})


class FrontendAppView(TemplateView):
    template_name = "index.html"

    def dispatch(self, request, *args, **kwargs):
        try:
            return super().dispatch(request, *args, **kwargs)
        except TemplateDoesNotExist:
            return HttpResponse(
                """
                index.html not found ! Build your React app and place it inside the Django static folder
                """,
                status=501,
            )