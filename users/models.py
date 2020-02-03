from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from json import loads
from django.dispatch import receiver
from users.managers import CustomUserManager
import requests

class CustomUser(AbstractUser):
    email = models.EmailField(blank = True)
    username = models.CharField(max_length = 50, unique=True)
    extra_detail_url = models.CharField(max_length=100)
    
    objects = CustomUserManager()
    REQUIRED_FIELDS=[]

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    bio = models.CharField(max_length=150)
    company = models.CharField(max_length=100)
    user = models.OneToOneField(CustomUser, related_name = 'profile', on_delete=models.CASCADE)

@receiver(post_save, sender = CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(
            user = instance
        )

@receiver(post_save, sender = CustomUser)
def save_user_profile(sender, instance, **kwargs):
    try:
        user_data = loads(requests.get(instance.extra_detail_url).text)
        name = user_data['name'].split(' ')
        instance.first_name = name[0] if len(name) <= 2 else ' '.join(name[:-1])
        instance.last_name = name[-1]
        instance.save()
        instance.profile.bio = user_data['bio']
        instance.profile.company = user_data['company']
    except:
        pass
    instance.profile.save()