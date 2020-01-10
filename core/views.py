from rest_framework import permissions, authentication
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from core.custom_permissions import isSuperuserOrReadOnly
from core.serializers import GenreSerializer, TopicSerializer
from core.models import Genre
from json import dumps
from django.contrib.auth import get_user_model

User = get_user_model()

class Genres(APIView):
    permission_classes = [isSuperuserOrReadOnly]
    # Fetch all the genres but mark those subscribed.
    def get(self, request):
        try :
            all_genres = {i.name : False for i in Genre.objects.all()}
        except:
            return Response({
                'status' : 'error',
                'data' : 'No Genres present'
            })

        subscribed_genres = [i.name for i in request.user.subscribed_genres]
        for genre in subscribed_genres:
            all_genres[genre] = True
        return Response({
            'status' : 'success',
            'data' : dumps(all_genres)
        })
    
    def post(self, request) :
        try:
            genre = request.data.get('genre')
        except:
            return Response({'status' : 'error', 'message' : 'No data found'})
        serializer = GenreSerializer(genre)
        if serializer.is_valid():
            serializer.save()
        else :
            return Response({'status' : 'error', 'message' : serializer.errors})
        return Response({
            'status' : 'success', 
            'message' : 'Genre {} created succesfully'.format(genre)
        })

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def subscribe_genres(request):
    genres = request.data.get('genres').split(',')
    try:
        genre_objects = [Genre.objects.get(name) for name in genres]
    except:
        return Response({
            'status' : 'error',
            'message' : 'Invalid Genre sent'
        })

    for genre_object in genre_objects:
        genre_object.subscribers.add(request.user)
        genre_object.save()
    
    return Response({
        'status' : 'success',
        'message' : 'Subscribed {} to {}'.format(request.user, ','.join(genres))
    })