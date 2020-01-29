from django.urls import path
from core.views import (
    GenresView, subscribe_genres, HomePageView, QuestionView, AnswerView, 
    CommentView, QuestionCreateView, AnswerCreateView, CommentCreateView
)


urlpatterns = [
    path('genre', GenresView.as_view()),
    path('genres/subscribe', subscribe_genres),
    path('home', HomePageView),
    path('questions', QuestionCreateView.as_view()),
    path('questions/<str:url>', QuestionView.as_view()),
    path('answers', AnswerCreateView.as_view()),
    path('answers/<str:answer_id>', AnswerView.as_view()),
    path('comments', CommentCreateView.as_view()),
    path('comments/<str:comment_id>', CommentView.as_view()),
]
