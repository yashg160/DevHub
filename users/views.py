from rest_framework import permissions
from rest_framework.authtoken.models import Token
from core.utils.pagination import SmallResultSetPagination
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.models import CustomUser
from core.serializers import (
    QuestionSerializer, AnswerSerializer, CommentSerializer, GenreSerializer,
    TopicSerializer, CustomUserSerializer
)
from django.contrib.auth import get_user_model
import requests
from json import dumps, loads

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def authorize_user(request, code):
    params = {
        "client_id" : "e97710fdd921e6d456bd",
        "client_secret" : "47bb9addd9b01fc4b35aa4cad29b0d7406c2ac35",
        "code" : code
    }

    access_token = requests.post('https://github.com/login/oauth/access_token', params = params).text
    
    user_data = requests.get(
        'https://api.github.com/user',
        headers = {
            'Authorization' : 'token ' + access_token.split('&')[0].split('=')[1]
        }
    )
    data = loads(user_data.text)
    User = get_user_model()
    user, created_user = User.objects.get_or_create(
        username = data['login'], 
        extra_detail_url = data['url']
    )

    token, _ = Token.objects.get_or_create(user = user)
    
    return Response({
        "data" : data,
        "first_login" : created_user,
        "token" : token.key
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_user_data(request, username):
    try:
        user = CustomUser.objects.get(username=username)
    except :
        return Response({'status' : 'error', 'message' : 'No such User found'})
    
    user_data = requests.get(user.extra_detail_url)
    
    return Response({
        'status' : 'success',
        'data' : loads(user_data.text)
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_user_home(request, username):
    try:
        user = CustomUser.objects.get(username = username)
    except:
        return Response({'status' : 'error', 'message' : 'No such user found'})

    # Get github data
    try:
        profile_data = requests.get(user.extra_detail_url).text
    except:
        profile_data = "{\"error\":\"No user found\"}"
    # Get asked questions
    asked_questions = QuestionSerializer(user.asked_questions.all(), many=True).data
    # Get all anwers
    answered = AnswerSerializer(user.written_answers.all(), many=True).data
    # Get all comments
    written_comments = CommentSerializer(user.written_comments.all(), many=True).data
    # Get all upvoted questions, comments
    upvoted_answers = AnswerSerializer(user.upvoted_answers.all(), many = True).data
    upvoted_comments = CommentSerializer(user.upvoted_comments.all(), many = True).data
    requested_answers = []
    if request.user and request.user == user:
        requested_answers = AnswerSerializer(user.answer_requests.all(), many = True).data
    subscribed_genres = GenreSerializer(user.subscribed_genres.all(), many = True).data
    followed_topics = TopicSerializer(user.followed_topics.all(), many = True).data
    return Response({
        'status' : 'success',
        'data' : {
            'profile_data' : loads(profile_data),
            'asked_questions' : asked_questions,
            'answered' : answered,
            'written_comments' : written_comments,
            'upvoted_answers' : upvoted_answers,
            'upvoted_comments' : upvoted_comments,
            'requested_answers' : requested_answers,
            'subscribed_genres' : subscribed_genres,
            'followed_topics' : followed_topics
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def AllUserView(request):
    paginator = SmallResultSetPagination()
    all_users = get_user_model().objects.all()
    result = CustomUserSerializer(all_users, many=True).data
    result_page = paginator.paginate_queryset(result, request)
    return paginator.get_paginated_response(result_page)