from django.db import models




class Address(models.Model):
    id = models.IntegerField(primary_key=True)
    street_number = models.CharField(max_length=900)
    street_name = models.CharField(max_length=900)
    state = models.CharField(max_length=900)
    county_or_city = models.CharField(max_length=900)
    site = models.CharField(max_length=900)

class Scanned3d(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=10)

class Printed3d(models.Model):
    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=10)

class GridNames(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=900)

class Permissions(models.Model):
    numVal = models.IntegerField(primary_key=True)
    role = models.CharField(max_length=30)

class Users(models.Model):
    email = models.CharField(max_length=255, primary_key=True)
    upassword = models.CharField(max_length=500)
    upermission = models.ForeignKey(Permissions, on_delete=models.CASCADE)
    active_flag = models.BooleanField()


class ObjDatedTo(models.Model):
    id = models.IntegerField(primary_key=True)
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()


class OrganicType(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=10)

class SpeciesType(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=10)


class MaterialType(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=10)


class FormType(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=10)


class ConservationType(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=10)


class PicturePath(models.Model):
    id = models.IntegerField(primary_key=True)
    type_name = models.CharField(max_length=10)


    

class Artifact(models.Model):
    address = models.ForeignKey(Address, on_delete=models.CASCADE) #foriegn key
    owner = models.CharField(max_length=9000)
    date_collected = models.DateTimeField()
    catalog_number = models.CharField(max_length=900, primary_key=True)
    object_name = models.CharField(max_length=9000)
    scanned_3d = models.ForeignKey(Scanned3d, on_delete=models.CASCADE)  #foriegn key
    printed_3d = models.ForeignKey(Printed3d, on_delete=models.CASCADE)  #foriegn key
    scanned_by = models.CharField(max_length=9000)
    date_excavated = models.DateTimeField()
    object_dated_to = models.ForeignKey(ObjDatedTo, on_delete=models.CASCADE) #foriegn key
    object_description = models.CharField(max_length=750)
    organic_inorganic = models.ForeignKey(OrganicType, on_delete=models.CASCADE) #foriegn key
    species = models.ForeignKey(SpeciesType, on_delete=models.CASCADE) #foriegn key
    material_of_manufacture = models.ForeignKey(MaterialType, on_delete=models.CASCADE) #foriegn key
    form_object_type = models.ForeignKey(FormType, on_delete=models.CASCADE) #foriegn key
    quantitiy = models.IntegerField()
    measurement_diameter = models.FloatField()
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    measurement_notes = models.CharField(max_length=50)
    weight = models.FloatField()
    weight_notes = models.CharField(max_length=50)
    sivilich_diameter = models.FloatField()
    deformation_index = models.FloatField()
    conservation_condition = models.ForeignKey(ConservationType, on_delete=models.CASCADE) #foriegn key
    cataloguer_name = models.ForeignKey(Users, on_delete=models.CASCADE) #foriegn key
    date_catalogued = models.DateTimeField()
    location_in_repository= models.CharField(max_length=50)
    platlot = models.CharField(max_length=50)
    found_at_depth = models.FloatField()
    longitude = models.FloatField()
    latitude = models.FloatField()
    distance_from_datum = models.CharField(max_length=25)
    found_in_grid = models.ForeignKey(GridNames, on_delete=models.CASCADE) #foriegn key
    exacavator = models.CharField(max_length=25)
    notes = models.CharField(max_length=500)
    images = models.ForeignKey(PicturePath, on_delete=models.CASCADE) #foriegn key
    data_double_checked_by = models.CharField(max_length=500)
    qsconcerns = models.CharField(max_length=500)
    druhlcheck = models.CharField(max_length=500)
    sources_for_id = models.CharField(max_length=500)
    location = models.CharField(max_length=90)
    storage_location = models.CharField(max_length=90)
    uhlflages = models.CharField(max_length=90)


