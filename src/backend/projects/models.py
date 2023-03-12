from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Project(models.Model):
    title = models.CharField(
        verbose_name="project name",
        max_length=100,
        null=False,
        blank=False,
        unique=True
    )
    logo = models.ImageField(
        verbose_name="project logo",
        upload_to="images",
        null=True,
        blank=True
    )
    description = models.TextField(
        verbose_name="project description",
        max_length=1000,
        null=False,
        blank=False
    )
    purpose = models.CharField(
        verbose_name="project purpose",
        max_length=100,
        null=False,
        blank=False
    )
    project_deadline = models.DateField(
        verbose_name="project deadline",
        null=False,
        blank=False
    )
    vote_deadline = models.DateField(
        verbose_name="project vote deadline",
        null=False,
        blank=False
    )
    phase = models.SmallIntegerField(
        verbose_name="project phase",
        null=False,
        blank=False,
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )

    def __str__(self):
        return self.title
