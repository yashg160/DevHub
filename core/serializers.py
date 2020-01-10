from core.models import Genre, Topic
from rest_framework import serializers

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('name', )
    
    def create(self, validated_data) :
        genre = Genre.objects.create(name = validated_data.get('name'))
        genre.save()
        return genre


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('name', 'category', )