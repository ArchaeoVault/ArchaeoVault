from django.db import models


class address(models.Model):
    id = models.IntegerField(primary_key=True)
    streetnumber = models.CharField(max_length=900)
    streetname = models.CharField(max_length=900)
    state = models.CharField(max_length=900)
    countyorcity = models.CharField(max_length=900)
    site = models.CharField(max_length=900)

class threedscannedtable(models.Model): 
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=10)

class threedprintedtable(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=10)

class gridnames(models.Model):
    id = models.IntegerField(primary_key=True)
    typename = models.CharField(max_length=900) #changed

class permissions(models.Model):
    numVal = models.IntegerField(primary_key=True)
    givenrole = models.CharField(max_length=30) #changed

class users(models.Model):
    email = models.CharField(max_length=255, primary_key=True)
    upassword = models.CharField(max_length=500)
    activated = models.BooleanField() #activated
    upermission = models.ForeignKey(permissions, on_delete=models.CASCADE)

class organicinorganic(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=20) #changed

class speciestype(models.Model):
    id = models.IntegerField(primary_key=True)
    typename = models.CharField(max_length=100)


class materialtype(models.Model):
    id = models.IntegerField(primary_key=True)
    typename = models.CharField(max_length=200)


class formtype(models.Model):
    id = models.IntegerField(primary_key=True)
    typename = models.CharField(max_length=500)


class conservationtype(models.Model):
    id = models.IntegerField(primary_key=True)
    typename = models.CharField(max_length=100)
    

class your_table(models.Model):
    address = models.ForeignKey(address, on_delete=models.CASCADE) #foriegn key
    owner = models.CharField(max_length=255)
    date_collected = models.DateTimeField()
    catalog_number = models.CharField(max_length=25)
    object_name = models.CharField(max_length=255)
    scanned_3d = models.ForeignKey(threedscannedtable, on_delete=models.CASCADE)  #foriegn key
    printed_3d = models.ForeignKey(threedprintedtable, on_delete=models.CASCADE)  #foriegn key
    scanned_by = models.CharField(max_length=100)
    date_excavated = models.DateTimeField()
    object_dated_to = models.CharField(max_length=100) #foriegn key
    object_description = models.CharField(max_length=1000)
    organic_inorganic = models.ForeignKey(organicinorganic, on_delete=models.CASCADE) #foriegn key
    species = models.ForeignKey(speciestype, on_delete=models.CASCADE) #foriegn key
    material_of_manufacture = models.ForeignKey(materialtype, on_delete=models.CASCADE) #foriegn key
    form_object_type = models.ForeignKey(formtype, on_delete=models.CASCADE) #foriegn key
    quantity = models.CharField(max_length=100) #changed
    measurement_diameter = models.FloatField()
    length = models.FloatField()
    width = models.FloatField()
    height = models.CharField(max_length=50)
    measurement_notes = models.CharField(max_length=750)
    weight = models.FloatField()
    weight_notes = models.CharField(max_length=50)
    sivilich_diameter = models.FloatField()
    deformation_index = models.FloatField()
    conservation_condition = models.ForeignKey(conservationtype, on_delete=models.CASCADE) #foriegn key
    cataloguer_name = models.ForeignKey(users, on_delete=models.CASCADE) #foriegn key
    date_catalogued = models.DateTimeField()
    location_in_repository= models.CharField(max_length=50)
    platlot = models.CharField(max_length=50)
    found_at_depth = models.CharField(max_length=50) #changed
    longitude = models.CharField(max_length=20) #changed
    latitude = models.CharField(max_length=20) #changed
    distance_from_datum = models.CharField(max_length=25)
    found_in_grid = models.ForeignKey(gridnames, on_delete=models.CASCADE) #foriegn key
    excavator = models.CharField(max_length=50)
    notes = models.CharField(max_length=500)
    images = models.CharField(max_length=500)
    data_double_checked_by = models.CharField(max_length=50)
    qsconcerns = models.CharField(max_length=100)
    druhlcheck = models.CharField(max_length=50)
    sources_for_id = models.CharField(max_length=1000)
    location = models.CharField(max_length=100)
    storage_location = models.CharField(max_length=50)
    uhlflages = models.CharField(max_length=250)
    id = models.IntegerField(primary_key=True)

