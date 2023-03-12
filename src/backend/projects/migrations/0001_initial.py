# Generated by Django 4.1.7 on 2023-03-12 09:35

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        max_length=100, unique=True, verbose_name="project name"
                    ),
                ),
                (
                    "logo",
                    models.ImageField(
                        blank=True,
                        null=True,
                        upload_to="images",
                        verbose_name="project logo",
                    ),
                ),
                (
                    "description",
                    models.TextField(
                        max_length=1000, verbose_name="project description"
                    ),
                ),
                (
                    "purpose",
                    models.CharField(max_length=100, verbose_name="project purpose"),
                ),
                ("project_deadline", models.DateField(verbose_name="project deadline")),
                (
                    "context",
                    models.CharField(max_length=100, verbose_name="project context"),
                ),
                (
                    "vote_deadline",
                    models.DateField(verbose_name="project vote deadline"),
                ),
                (
                    "phase",
                    models.IntegerField(
                        default=1,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(4),
                        ],
                        verbose_name="project phase",
                    ),
                ),
            ],
        ),
    ]