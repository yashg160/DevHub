from django.contrib import admin
from django.urls import path, include
import users.views as views

urlpatterns = [
    path('data/<code>', views.authorize_user),
]