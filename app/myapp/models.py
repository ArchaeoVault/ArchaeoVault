from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    activated = models.BooleanField(default=False)

    class Meta:
        db_table = 'clients' #can change to fix it

    def __str__(self):
        return f"Profile for user {self.user.email}"
