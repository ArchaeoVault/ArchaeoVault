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
    typename = models.CharField(max_length=900)

class permissions(models.Model):
    numVal = models.IntegerField(primary_key=True)
    role = models.CharField(max_length=30)

class users(models.Model):
    email = models.CharField(max_length=255, primary_key=True)
    upassword = models.CharField(max_length=500)
    upermission = models.ForeignKey(permissions, on_delete=models.CASCADE)
    activated = models.BooleanField() #activated

class organicinorganic(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=10)

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
    owner = models.CharField(max_length=9000)
    date_collected = models.DateTimeField()
    catalog_number = models.CharField(max_length=900, primary_key=True)
    object_name = models.CharField(max_length=9000)
    scanned_3d = models.ForeignKey(threedscannedtable, on_delete=models.CASCADE)  #foriegn key
    printed_3d = models.ForeignKey(threedprintedtable, on_delete=models.CASCADE)  #foriegn key
    scanned_by = models.CharField(max_length=9000)
    date_excavated = models.DateTimeField()
    object_dated_to = models.CharField(max_length=9000) #foriegn key
    object_description = models.CharField(max_length=750)
    organic_inorganic = models.ForeignKey(organicinorganic, on_delete=models.CASCADE) #foriegn key
    species = models.ForeignKey(speciestype, on_delete=models.CASCADE) #foriegn key
    material_of_manufacture = models.ForeignKey(materialtype, on_delete=models.CASCADE) #foriegn key
    form_object_type = models.ForeignKey(formtype, on_delete=models.CASCADE) #foriegn key
    quantity = models.IntegerField()
    measurement_diameter = models.FloatField()
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    measurement_notes = models.CharField(max_length=50)
    weight = models.FloatField()
    weight_notes = models.CharField(max_length=50)
    sivilich_diameter = models.FloatField()
    deformation_index = models.FloatField()
    conservation_condition = models.ForeignKey(conservationtype, on_delete=models.CASCADE) #foriegn key
    cataloguer_name = models.ForeignKey(users, on_delete=models.CASCADE) #foriegn key
    date_catalogued = models.DateTimeField()
    location_in_repository= models.CharField(max_length=50)
    platlot = models.CharField(max_length=50)
    found_at_depth = models.FloatField()
    longitude = models.FloatField()
    latitude = models.FloatField()
    distance_from_datum = models.CharField(max_length=25)
    found_in_grid = models.ForeignKey(gridnames, on_delete=models.CASCADE) #foriegn key
    excavator = models.CharField(max_length=25)
    notes = models.CharField(max_length=500)
    images = models.CharField(max_length=500)
    data_double_checked_by = models.CharField(max_length=500)
    qsconcerns = models.CharField(max_length=500)
    druhlcheck = models.CharField(max_length=500)
    sources_for_id = models.CharField(max_length=500)
    location = models.CharField(max_length=90)
    storage_location = models.CharField(max_length=90)
    uhlflages = models.CharField(max_length=90)


