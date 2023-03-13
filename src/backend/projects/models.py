from datetime import datetime
from zoneinfo import ZoneInfo
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Project(models.Model):
    users = models.ManyToManyField(
        verbose_name="project users",
        to="users.User",
        blank=False,
        null=False,
    )
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
        null=False,
        blank=False
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
    deadline = models.DateField(
        verbose_name="project deadline",
        blank=True,
        default=datetime.now(ZoneInfo("Asia/Tokyo")).strftime("%Y-%m-%d")
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
    invalid = models.BooleanField(
        verbose_name="invalid project",
        default=False,
        blank=True,
    )

    def __str__(self):
        return self.title
