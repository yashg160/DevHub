from django.db import models
from users.models import CustomUser

class Genre(models.Model):
    name = models.CharField(max_length=84)
    subscribers = models.ManyToManyField(CustomUser, related_name="subscribed_genres")

    def __str__(self) :
        return self.name

class Topic(models.Model):
    name = models.CharField(max_length=84)
    category = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name="topics")
    followers = models.ManyToManyField(CustomUser, related_name="followed_topics")

    def __str__(self):
        return "#" + self.name