from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from json import dumps

@api_view(['GET'])
def authorize_user(request):
    code = request.get_full_path().split('?code=')[1]
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
    
    return Response({
        "data" : user_data
    })
