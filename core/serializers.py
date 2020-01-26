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
    asker_name = serializers.CharField(source = 'asker.username')
    followers_list = serializers.SerializerMethodField()

    def get_followers_list(self, instance):
        return([follower.username for follower in instance.followers.all()])

    class Meta:
        model = Question
        fields = ('question', 'asker_name', 'requested', 'genres', 'followers_list', 
                  'topics', 'url', 'created_at', 'updated_at', 'answers', )

    def update(self, instance, validated_data, current_user):
        new_question = validated_data.get('question', instance.question)
        requested = validated_data.get('requested', [])
        followed = validated_data.get('followed', False)
        unfollowed = validated_data.get('unfollowed', False)
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
        instance.url = new_question.lower().replace(' ', '-').replace('?', '')
        instance.updated_at = datetime.now()
        instance.save()
        return instance


class AnswerSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='question.url')
    author_name = serializers.CharField(source='author.username')
    upvoters = serializers.SerializerMethodField()

    def get_upvoters(self, instance):
        return([person.username for person in instance.upvoters.all()])

    class Meta:
        model = Answer
        fields = ('id', 'url', 'answer', 'author_name', 'upvoters', 'created_at', 'updated_at', )

    # pylint: disable=W0221
    def update(self, instance, validated_data, current_user):
        instance.answer = validated_data.get('answer', instance.answer)
        if validated_data.get('upvote', False) and instance.author != current_user:
            instance.upvoters.add(current_user)

        instance.updated_at = datetime.now()
        instance.save()
        return instance
