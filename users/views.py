from rest_framework import permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
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
