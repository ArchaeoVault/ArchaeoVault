import os

dir_to_check =  r'/var/www/html/artifact_images/FINISHED JPG'

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

    #Insert here (catalog number as foreign key and file name which is image)

    print(catalog_number)