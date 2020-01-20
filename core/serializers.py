from datetime import datetime
from rest_framework import serializers
from core.models import Genre, Topic, Question

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

    def create(self, validated_data):
        question = Question.objects.create(**validated_data)
        question.url = question.question.lower().replace(' ', '-')
        question.save()
        return question

    def update(self, instance, validated_data):
        new_question = validated_data.get('question', instance.question)
        instance.question = new_question
        instance.url = new_question.lower().replace(' ', '-')
        instance.updated_at = datetime.now()
        instance.save()
        return instance
