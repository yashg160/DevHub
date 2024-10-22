# pylint: disable=C0413
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reactora.settings')
from random import randint

import django
django.setup()
from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework.authtoken.models import Token

from faker import Faker
from tqdm import tqdm

from core.models import Question, Answer, Genre, Comment
User = get_user_model()
fake = Faker()
fake.seed_instance(4500)

def add_genres():
    GENRES = ['Technology', 'Religion', 'Philosphy', 'Science', 'Politics',
              'Entrepreneurship', 'Life', 'News', 'Startup', 'Culture', 'Business',
              'Facts', 'Humor', 'Travel', 'Innovation', 'Sports', 'Health']
    for genre_name in tqdm(GENRES):
        Genre.objects.create(
            name = genre_name
        )
    print(f'Created {len(GENRES)} genres succesfully!')

def add_users(n = 50, t = 5):
    data = {}
    genre = Genre.objects.all()
    for _ in tqdm(range(n)):
        profile = fake.simple_profile(sex=None)
        new_user = User.objects.create(
            username = profile['username'],
            email = profile['mail'],
            first_name = profile['name'].split(' ')[0],
            last_name = profile['name'].split(' ')[1]
        )
        
        token = Token.objects.create(user = new_user)
        data[new_user.username] = token.key
        for _ in range(t):
            new_user.subscribed_genres.add(genre[randint(0, genre.count()-1)])
        new_user.save()
    print("Created objects : ")
    for key, val in data.items():
        print(f'{key} : {val}')

def add_questions(m = 2, t = 3):
    # Adds m questions for each user with t topics
    all_users = User.objects.all()
    genre = Genre.objects.all()
    for user in tqdm(all_users):
        for _ in range(m):
            question = Question.objects.create(
                question = fake.text(max_nb_chars=100).replace('.', '').lower() + '?',
                asker = user
            )
            question.followers.add(user)
            question.updated_at = timezone.now()
            question.url = question.question.lower().replace(' ', '-').replace('?', '')
            for _ in range(t):
                question.genres.add(genre[randint(0, genre.count()-1)])
            question.save()

    print(f'Created {all_users.count()*m} questions succesfully!')

def add_answers(m = 5):
    # add m answers for each question
    all_questions = Question.objects.all()
    all_users = User.objects.all()
    user_size = all_users.count() - 1
    for question in tqdm(all_questions):
        for _ in range(m):
            answer = Answer.objects.create(
                answer = fake.text(max_nb_chars=500),
                author = all_users[randint(0, user_size)],
                question = question
            )
            answer.updated_at = timezone.now()
            answer.save()
    print(f'Created {all_questions.count()*m} answers succesfully!')

def add_comments(m = 2):
    all_users = User.objects.all()
    user_size = all_users.count() - 1
    all_answers = Answer.objects.all()
    for answer in tqdm(all_answers):
        for _ in range(m):
            Comment.objects.create(
                answer = answer,
                author = all_users[randint(0, user_size)],
                comment = fake.text(max_nb_chars = 150)
            )
    print(f'Created {all_answers.count()*m} comments succesfully!')
    
def add_child_comments(m = 2):
    all_users = User.objects.all()
    user_size = all_users.count() - 1
    all_comments = Comment.objects.all()
    for parent_comment in tqdm(all_comments):
        for _ in range(m):
            Comment.objects.create(
                answer = parent_comment.answer,
                parent_comment = parent_comment,
                author = all_users[randint(0, user_size)],
                comment = fake.text(max_nb_chars = 150)
            )
    print(f'Created {all_comments.count()*m} child comments succesfully!')

if __name__ == "__main__" :
    Token.objects.all().delete()
    Comment.objects.all().delete()
    Genre.objects.all().delete()
    User.objects.all().delete()
    Question.objects.all().delete()
    Answer.objects.all().delete()
    add_genres()
    add_users()
    add_questions()
    add_answers()
    add_comments()
    add_child_comments()