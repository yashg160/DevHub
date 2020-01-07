from django.db import models
from django.contrib.auth.models import AbstractUser
from users.managers import CustomUserManager

class CustomUser(AbstractUser):
    email = models.EmailField(blank = True)
    username = models.CharField(max_length = 50, unique=True)
    extra_detail_url = models.CharField(max_length=100)
    
    objects = CustomUserManager()
    REQUIRED_FIELDS=[]

    def __str__(self):
        return self.username