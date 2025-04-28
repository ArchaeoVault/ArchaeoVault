import os
import sys
import django
from django.db.models import Max

#Setup django environment
# Add the project root to Python's path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Going up two levels

# Set the Django settings module
env = os.environ.get('DJANGO_ENV', 'None')
if env == 'production':
    settings_dir = 'app.production'
else:
    settings_dir = 'app.local'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_dir)  # replace with your actual project name

# Initialize Django
django.setup()

from myapp.models import your_table
from myapp.models import imagetable
#######################

dir_to_check =  r'/var/www/html/artifact_images/FINISHED JPG'

#Get list of images in the chosen directory
images = os.listdir(dir_to_check)

for image in images:
    catalog_number = ""

    #Split each image by dash and if the substring is a number concatenate to extract only the catalog number from the file name

    #Some file names have only the catalog number so when this is the case removing the jpeg allows us to extract the whole number
    image_cleaned = image.replace(".jpeg", "")
    
    #Accounting for some files have catalogue number of 'MD'
    split_img = image_cleaned.split("-")
    contains_comma = False
    comma_substr = ""
    catalog_numbers = []

    for substr in split_img:
        if substr.isnumeric():
            catalog_number += substr + "-"
        elif((substr.find(",") != -1)):
            contains_comma = True
            comma_substr = substr
        elif('MD' in substr):
            catalog_number += substr + '-'

    #Remove unecessary dash from end of catalog number
    catalog_number = catalog_number[:-1]
    if contains_comma:
        split_catalog = comma_substr.split(",")
        for letter in split_catalog:
            new_catalog_number = catalog_number + '-' + letter
            catalog_numbers.append(new_catalog_number)
    else:
        
        catalog_numbers.append(catalog_number)


    # Get id by using select statement with catalog #
    for catalog_number in catalog_numbers:
        artifacts = your_table.objects.filter(catalog_number=catalog_number)
        for artifact in artifacts:
            artifact_id = artifact.id
            max_id = imagetable.objects.aggregate(Max('id'))['id__max']
            if max_id is None:
                max_id = 0
            
            existing_record = imagetable.objects.filter(filepath=image,your_table_id=artifact.id)
            if(len(existing_record)==0):
                imagetable.objects.create(your_table_id=artifact, filepath=image, id=max_id+1)
                print("Artifact ID: ",artifact_id," Catalog Number: ",catalog_number," FileName: ",image, "\n")
            else:
                print("Already exists ","Artifact ID: ",artifact_id," Catalog Number: ",catalog_number," FileName: ",image, "\n")
            

