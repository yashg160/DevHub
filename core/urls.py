from django.urls import path
from core.views import GenresView, subscribe_genres, HomePageView

urlpatterns = [
    path('genre', GenresView.as_view()),
    path('genres/subscribe', subscribe_genres),
    path('home', HomePageView),
]
