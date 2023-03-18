from django.db import models
from django.core.validators import MinLengthValidator


class User(models.Model):
    wallet_address = models.CharField(
        verbose_name="user wallet address",
        max_length=42,
        validators=[MinLengthValidator(42)],
        null=False,
        blank=False,
        unique=True
    )
    email = models.EmailField(
        verbose_name="Email address",
        null=False,
        blank=False,
        unique=True
    )
    # icon = models.ImageField(
    #     verbose_name="user icon",
    #     upload_to="images",
    #     null=False,
    #     blank=False
    # )
    tokenId = models.IntegerField(
        verbose_name="user token id",
        null=False,
        blank=False,
    )

    def __str__(self):
        return self.wallet_address
