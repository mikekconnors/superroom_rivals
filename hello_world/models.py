# filepath: /workspaces/codespaces-django/hello_world/models.py
from django.db import models

class Rival(models.Model):
    name = models.CharField(max_length=100)
    svp_count = models.IntegerField(default=0)
    mvp_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name