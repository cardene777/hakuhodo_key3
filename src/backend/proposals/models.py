from django.db import models


class Proposal(models.Model):
    users = models.OneToOneField(
        verbose_name="proposal users",
        to="users.User",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    projects = models.ForeignKey(
        verbose_name="Reference project",
        to="projects.Project",
        on_delete=models.CASCADE,
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
    description = models.TextField(
        verbose_name="project description",
        max_length=1000,
        null=False,
        blank=False
    )

    def __str__(self):
        return self.title
