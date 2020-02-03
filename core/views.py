# pylint: disable=W0703
from django.db.models import Count, Subquery, OuterRef
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes
import core
from core.utils.pagination import SmallResultSetPagination
from core.utils.permissions import isSuperuserOrReadOnly
from core.serializers import (GenreSerializer, QuestionSerializer, AnswerSerializer, HomePageSerializer,
                              CommentSerializer)
from core.models import Genre, Question, Answer, Comment
# from django.contrib.auth import get_user_model

# User = get_user_model()

class GenresView(APIView):
    permission_classes = [isSuperuserOrReadOnly]
    # Fetch all the genres but mark those subscribed.
    def get(self, request):
        try:
            all_genres = {i.name : False for i in Genre.objects.all()}
        except:
            return Response({
                'status' : 'error',
                'data' : 'No Genres present'
            })

        subscribed_genres = [i.name for i in request.user.subscribed_genres.all()]
        for genre in subscribed_genres:
            all_genres[genre] = True
        return Response({
            'status' : 'success',
            'data' : all_genres
        })

    def post(self, request):
        try:
            genre = request.data.get('genre')
        except:
            return Response({'status' : 'error', 'message' : 'No data found'})
        serializer = GenreSerializer(genre)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({'status' : 'error', 'message' : serializer.errors})
        return Response({
            'status' : 'success', 
            'message' : 'Genre {} created succesfully'.format(genre)
        })

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def subscribe_genres(request):

    genres = request.data.get('genres').split(',')
    genre_objects = []
    for genre_name in genres:
        try:
            genre_objects.append(Genre.objects.get(name = genre_name))
        except:
            return Response({
                'status' : 'error',
                'message' : 'Invalid Genre : ' + genre_name
            })

    for genre_object in genre_objects:
        genre_object.subscribers.add(request.user)
        genre_object.save()

    return Response({
        'status' : 'success',
        'message' : 'Subscribed {} to {}'.format(request.user, ','.join(genres))
    })

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def HomePageView(request):
    paginator = SmallResultSetPagination()
    subscribed_genres = request.user.subscribed_genres
    print(subscribed_genres.all())
    answer_subquery = Answer.objects.filter(
        question=OuterRef('pk')
        ).annotate(
            upvotes=Count('upvoters')
        ).order_by('-upvotes')

    questions = Question.objects.annotate(
        answer=Subquery(answer_subquery.values('id')[:1])
        ).filter(genres__in = subscribed_genres.all())
    result = HomePageSerializer(questions, many=True).data
    result_page = paginator.paginate_queryset(result, request)
    return paginator.get_paginated_response(result_page)

class QuestionView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def put(self, request, url):
        try:
            question = Question.objects.get(url = url)
        except core.models.Question.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Question does not exist'})
        updated_question = request.data
        if updated_question.get('question', False) and question.asker != request.user :
            return Response({'status' : 'error', 'message' : 'Not allowed to update this question'}) 
        serializer = QuestionSerializer(question)
        serializer.update(question, updated_question, request.user)
        return Response({
            'status' : 'success',
            'message' : 'Question updated succesfully',
            'url' : serializer.data['url']
        })

    def get(self, request, url):
        try:
            question = Question.objects.get(url = url)
        except core.models.Question.DoesNotExist :
            return Response({'status' : 'error', 'message' : 'Question does not exist'})
        serialized = QuestionSerializer(question)
        return Response({'status' : 'success', 'data' : serialized.data})

    def delete(self, request, url):
        try:
            question = Question.objects.get(url = url)
        except core.models.Question.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Question does not exist'})
        if question.asker != request.user :
            return Response({'status' : 'error', 'message' : 'Not allowed to update this question'}) 
        question.delete()
        return Response({'status' : 'success', 'message' : 'Question deleted succesfully'})

class AnswerView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, answer_id):
        try:
            answer = Answer.objects.get(id = answer_id)
        except core.models.Answer.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Invalid Answer ID'})
        serialized = AnswerSerializer(answer)

        return Response({'status' : 'success', 'data' : serialized.data})

    def put(self, request, answer_id):
        try:
            answer = Answer.objects.get(id = answer_id)
        except core.models.Answer.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Answer does not exist'})
        updated_answer = request.data
        if updated_answer.get('answer', False) and request.user != answer.author :
            return Response({'status' : 'error', 'message' : 'Not authenticated to change this answer'})
        serializer = AnswerSerializer(answer)
        serializer.update(answer, updated_answer, request.user)

        return Response({
            'status' : 'success',
            'message' : 'Answer updated succesfully',
            'answer_id' : serializer.data['id']
        })

    def delete(self, request, answer_id):
        try:
            answer = Answer.objects.get(id = answer_id)
        except core.models.Answer.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Answer does not exist'})
        if answer.author != request.user :
            return Response({'status' : 'error', 'message' : 'Not authenticated to delete this answer'})
        answer.delete()
        return Response({'status' : 'success', 'message' : 'Answer deleted succesfully'})


class QuestionCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        data = request.data
        if not data.get('question') :
            return Response({'status': 'error', 'message': 'Missing question in request body'})
        question_url = data.get('question').question.lower().replace(' ', '-').replace('?', '')
        if Question.objects.filter(url = question_url).exists() :
            return Response({'status' : 'error', 'message' : 'Question already exists'})
        question = Question.objects.create(
            question = data.get('question'),
            asker = request.user
        )
        genres = data.get('genres', [])
        for genre in genres:
            question.genres.add(Genre.objects.get(name=genre))
        question.save()
        question.followers.add(request.user)
        question.updated_at = timezone.now()
        question.url = question_url
        question.save()

        return Response({
            'status' : 'success',
            'message' : 'Question added succesfully'
        })

class AnswerCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        data = request.data
        if not data.get('answer') :
            return Response({'status' : 'error', 'message' : 'Missing answer in request body'})
        try :
            answer = Answer.objects.create(
                answer = data.get('answer'),
                author = request.user,
                question = Question.objects.get(url = data.get('question'))
            )
            answer.updated_at = timezone.now()
            answer.save()
        except Exception as e:
            # return Response({
            #     'status' : 'error', 
            #     'message' : "An error occurred! We'll look into this"
            # })
            return Response({'status' : 'error', 'message' : str(e)})

        return Response({
            'status' : 'success',
            'message' : 'Answer created successfully',
            'answer_id' : answer.id
        })

class CommentView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, comment_id):
        try:
            comment = Comment.objects.get(id = comment_id)
        except core.models.comment.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Comment does not exist'})
        return Response({
            'status' : 'success',
            'data' : CommentSerializer(comment).data
        })

    def put(self, request, comment_id):
        try:
            comment = Comment.objects.get(id = comment_id)
        except core.models.Comment.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Comment does not exist'})
        updated_comment = request.data

        if updated_comment.get('comment', False) and request.user != comment.author :
            return Response({'status' : 'error', 'message' : 'Not authenticated to change this comment'})
        updated_comment['current_user'] = request.user.username
        serializer = CommentSerializer(comment)
        serializer.update(comment, updated_comment, request.user)

        return Response({
            'status' : 'success',
            'message' : 'Comment updated succesfully',
            'answer_id' : serializer.data['id']
        })
    
    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id = comment_id)
        except core.models.Comment.DoesNotExist:
            return Response({'status' : 'error', 'message' : 'Comment does not exist'})
        if comment.author != request.user :
            return Response({'status' : 'error', 'message' : 'Not authenticated to delete this comment'})
        comment.delete()
        return Response({'status' : 'success', 'message' : 'Comment deleted succesfully'})

class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        data = request.data
        if not data.get('comment') :
            return Response({'status' : 'error', 'message' : 'Missing answer in request body'})
        try :
            answer = Answer.objects.get(id = data.get('answer'))
            comment = Comment.objects.create(
                comment = data.get('comment'),
                author = request.user,
                answer = answer
            )
            comment.upvoters.add(request.user)
            comment.updated_at = comment.created_at
            parent_comment = data.get('parent_comment', False)
            if parent_comment:
                comment.parent_comment = Comment.objects.get(id = parent_comment)
            comment.save()
        except Exception as e:
            # return Response({
            #     'status' : 'error', 
            #     'message' : "An error occurred! We'll look into this"
            # })
            return Response({'status' : 'error', 'message' : str(e)})

        return Response({
            'status' : 'success',
            'message' : 'Comment created successfully',
            'comment_id' : comment.id
        })
