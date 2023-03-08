from django.db import models


# Create your models here.
class Project(models.Model):
    name = models.CharField(
        max_length=100, null=False, blank=False, unique=True
    )
    summary = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField(max_length=1000, null=False, blank=False)
    purpose = models.CharField(max_length=100, null=False, blank=False)
    project_deadline = models.DateField(null=False, blank=False)
    contact = models.CharField(max_length=100, null=False, blank=False)
    vote_deadline = models.DateField(null=False, blank=False)
