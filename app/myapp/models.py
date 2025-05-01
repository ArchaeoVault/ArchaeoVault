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
    numval = models.IntegerField(primary_key=True)
    givenrole = models.CharField(max_length=30)

class users(models.Model):
    email = models.CharField(max_length=255, primary_key=True)
    upassword = models.CharField(max_length=500)
    activated = models.BooleanField()
    upermission = models.ForeignKey(permissions, on_delete=models.CASCADE, db_column='upermission')
    
    def save(self, *args, **kwargs):
        # Prevent last_login updates
        if 'update_fields' in kwargs and 'last_login' in kwargs['update_fields']:
            kwargs['update_fields'].remove('last_login')
        super().save(*args, **kwargs)

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
    address = models.ForeignKey(address, on_delete=models.CASCADE,db_column='Address',blank = True, null=True) #foriegn key
    owner = models.CharField(max_length=255,db_column='Owner',blank = True, null=True)
    date_collected = models.DateTimeField(db_column='Accessor number (date collected)',blank = True, null=True)
    catalog_number = models.CharField(max_length=25,db_column='Catalog # (day inventory)',blank = True, null=True)
    object_name = models.CharField(max_length=255,db_column='Object Name',blank = True, null=True)
    scanned_3d = models.ForeignKey(threedscannedtable, on_delete=models.CASCADE,db_column='3D Scanned',blank = True, null=True)  #foriegn key
    printed_3d = models.ForeignKey(threedprintedtable, on_delete=models.CASCADE,db_column='3D Printed',blank = True, null=True)  #foriegn key
    scanned_by = models.CharField(max_length=100, db_column='Scanned By',blank = True, null=True)
    date_excavated = models.DateTimeField(db_column='Date excavated (field bag date)',blank = True, null=True)
    object_dated_to = models.CharField(max_length=100,db_column='Object dated to',blank = True, null=True) #foriegn key
    object_description = models.CharField(max_length=1000,db_column='Object Description',blank = True, null=True)
    organic_inorganic = models.ForeignKey(organicinorganic, on_delete=models.CASCADE,db_column='inorganic/organic',blank = True, null=True) #foriegn key
    species = models.ForeignKey(speciestype, on_delete=models.CASCADE,db_column='species',blank = True,null=True) #foriegn key
    material_of_manufacture = models.ForeignKey(materialtype, on_delete=models.CASCADE,db_column='Material of manufactur',blank = True, null=True) #foriegn key
    form_object_type = models.ForeignKey(formtype, on_delete=models.CASCADE,db_column='Form (object type)',blank = True, null=True) #foriegn key
    quantity = models.CharField(max_length=100,db_column='Quantity',blank = True, null=True) #changed
    measurement_diameter = models.FloatField(db_column='Measurements (diameter/circumference) - length',blank = True, null=True)
    length = models.FloatField(db_column='Length (mm)',blank = True, null=True)
    width = models.FloatField(db_column='Width (mm)',blank = True, null=True)
    height = models.CharField(max_length=50,db_column='Height (mm)',blank = True, null=True)
    measurement_notes = models.CharField(max_length=750,db_column='Measurement Notes',blank = True, null=True)
    weight = models.FloatField(db_column='weight (grams)',blank = True, null=True)
    weight_notes = models.CharField(max_length=50,db_column='Weight Notes',blank = True, null=True)
    sivilich_diameter = models.FloatField(db_column='Sivilich Diameter (in)',blank = True, null=True)
    deformation_index = models.FloatField(db_column='Deformation Index',blank = True, null=True)
    conservation_condition = models.ForeignKey(conservationtype, on_delete=models.CASCADE,db_column='Conservation & condition',blank = True, null=True) #foriegn key
    cataloguer_name = models.CharField(max_length = 50,db_column='Cataloger name',blank = True, null=True) #foriegn key
    #cataloguer_name = models.ForeignKey(users, on_delete=models.CASCADE,db_column='Cataloger name') #foriegn key
    date_catalogued = models.DateTimeField(db_column='Date Catalogued on',blank = True, null=True)
    location_in_repository= models.CharField(max_length=50, db_column='Location in repository',blank = True, null=True)
    platlot = models.CharField(max_length=50,db_column='PLAT/LOT',blank = True, null=True)
    found_at_depth = models.CharField(max_length=50,db_column='Found at Depth below surface (report UNIT. mm prefered)',blank = True, null=True) #changed
    longitude = models.CharField(max_length=20,db_column='Longitude',blank = True, null=True) #changed
    latitude = models.CharField(max_length=20,db_column='Latitude',blank = True, null=True) #changed
    distance_from_datum = models.CharField(max_length=25,db_column='Distance from Datum',blank = True, null=True)
    found_in_grid = models.ForeignKey(gridnames, on_delete=models.CASCADE,db_column='Found in grid',blank = True, null=True) #foriegn key
    excavator = models.CharField(max_length=50,db_column='Excavator',blank = True, null=True)
    notes = models.CharField(max_length=500,db_column='Notes',blank = True, null=True)
    images = models.CharField(max_length=500,db_column='Image (add column for each additional image)',blank = True, null=True)
    data_double_checked_by = models.CharField(max_length=50,db_column='Data entry double checked by ',blank = True, null=True)
    qsconcerns = models.CharField(max_length=100,db_column='Questions/ concerns ',blank = True, null=True)
    druhlcheck = models.CharField(max_length=50,db_column='Dr.Uhl Check',blank = True, null=True)
    sources_for_id = models.CharField(max_length=1000,db_column='SOURCES FOR ID',blank = True, null=True)
    location = models.CharField(max_length=100,db_column='Location',blank = True, null=True)
    storage_location = models.CharField(max_length=50,db_column='Storage Location',blank = True, null=True)
    uhlflages = models.CharField(max_length=250,db_column='Uhl Flags',blank = True, null=True)
    #id = models.AutoField(primary_key=True)
    id = models.IntegerField(primary_key=True)


class imagetable(models.Model):
    id = models.BigAutoField(primary_key=True)
    your_table_id = models.ForeignKey(your_table, on_delete=models.CASCADE,db_column='your_table_id', null = True) #foriegn key
    filepath = models.CharField(max_length=100,db_column='filepath')
    