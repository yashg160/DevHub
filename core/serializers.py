# pylint: disable=W0221
from datetime import datetime
from rest_framework import serializers
from core.models import Genre, Topic, Question, Answer
from users.models import CustomUser
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('name', )

    def create(self, validated_data):
        genre = Genre.objects.create(name=validated_data.get('name'))
        genre.save()
        return genre


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('name', 'category', )


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('question', 'asker', 'requested', 'genres', 'followers', 'topics', 'url',
                  'created_at', 'answers', )

    def create(self, validated_data, **kwargs):
        current_user = kwargs['current_user']
        question = Question.objects.create(
            question = validated_data.get('question'),
            asker = current_user
        )
        question.followers.add(current_user)
        question.updated_at = datetime.now()
        question.url = question.question.lower().replace(' ', '-')
        question.save()
        return question

    def update(self, instance, validated_data, **kwargs):
        new_question = validated_data.get('question', instance.question)
        requested = validated_data.get('requested', [])
        followed = validated_data.get('followed', False)
        unfollowed = validated_data.get('unfollowed', False)
        current_user = kwargs['current_user']
        if followed:
            instance.followers.add(current_user)

        if unfollowed:
            instance.followers.remove(current_user)

        if current_user == instance.asker :
            for username in requested :
                user = CustomUser.objects.get(username = username)
                if user != instance.asker and user not in instance.requested.all():
                    instance.requested.add(user)

        instance.question = new_question
        instance.url = new_question.lower().replace(' ', '-')
        instance.updated_at = datetime.now()
        instance.save()
        return instance


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('answer', 'author', 'upvoters', 'created_at', )

    # pylint: disable=W0221
    def create(self, validated_data, **kwargs):
        answer = Answer.objects.create(
            answer = validated_data.get('answer'),
            author = kwargs['current_user'],
            question = Question.objects.get(url = validated_data.get('question'))
        )
        answer.updated_at = datetime.now()
        answer.save()
        return answer

    def update(self, instance, validated_data, **kwargs):
        instance.answer = validated_data.get('answer', instance.answer)
        if validated_data.get('upvote', False) and instance.author != kwargs['current_user']:
            instance.upvoters.add(kwargs['current_user'])

        instance.updated_at = datetime.now()
        instance.save()
        return instance
