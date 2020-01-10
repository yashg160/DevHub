from django.contrib import admin
from django.urls import path, include
from core.views import GenresView, subscribe_genres

urlpatterns = [
    path('genre', GenresView.as_view()),
    path('genres/subscribe', subscribe_genres)
]