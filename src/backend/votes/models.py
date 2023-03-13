from django.db import models


class Vote(models.Model):
    users = models.ForeignKey(
        verbose_name="vote user",
        to="users.User",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    proposal = models.ForeignKey(
        verbose_name="Reference proposal",
        to="proposals.Proposal",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
    )
    vote = models.BooleanField(
        verbose_name="vote",
        null=False,
        blank=False,
    )

    def __str__(self):
        return self.proposal.title
