import os
import sys
import django
#Setup django environment
# Add the project root to Python's path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Going up two levels

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.local')  # replace with your actual project name

# Initialize Django
django.setup()

from myapp.models import your_table
from myapp.models import imagetable
#######################

#dir_to_check =  r'/var/www/html/artifact_images/FINISHED JPG'
dir_to_check = r'C:\Users\prory\OneDrive\Documents\2024-2025\Spring 2025\Capstone\image_test'

#Get list of images in the chosen directory
images = os.listdir(dir_to_check)

for image in images:
    catalog_number = ""

    #Split each image by dash and if the substring is a number concatenate to extract only the catalog number from the file name
    split_img = image.split("-")
    for substr in split_img:
        if substr.isnumeric():
            catalog_number += substr + "-"
    
    #Remove unecessary dash from end of catalog number
    catalog_number = catalog_number[:-1]

    # Get id by using select statement with catalog #
    # select id from public.myapp_your_table where "Catalog # (day inventory)" = '2022-9-29-576'
    artifacts = your_table.objects.filter(catalog_number__icontains=catalog_number)
    for artifact in artifacts:
        artifact_id = artifact.id
        imagetable.objects.create(your_table_id=artifact, filepath=image)
        print("Artifact ID: ",artifact_id," Catalog Number: ",catalog_number," FileName: ",image, "\n")

