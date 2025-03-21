from django.test import TestCase, Client # client for http requests
from django.utils import timezone
from django.urls import reverse
from myapp.models import Artifact

class DisplayArtifactTests(TestCase):

    def setUp(self):
        Artifact.objects.create(
            


        )