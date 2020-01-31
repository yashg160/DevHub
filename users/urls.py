from django.contrib import admin
from django.urls import path, include
import users.views as views

urlpatterns = [
    path('data/<code>', views.authorize_user),
    path('<str:username>', views.get_user_data),
    path('profile/<str:username>', views.get_user_home),
]