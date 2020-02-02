# pylint: disable=W0221
from datetime import datetime
from rest_framework import serializers
from core.models import Genre, Topic, Question, Answer, Comment
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
    all_answers = serializers.SerializerMethodField()
    genres = serializers.SerializerMethodField()

    def get_followers_list(self, instance):
        return([follower.username for follower in instance.followers.all()])

    def get_all_answers(self, instance):
        return([AnswerSerializer(answer).data for answer in instance.answers.all()])

    def get_genres(self, instance):
        return([genre.name for genre in instance.genres.all()])

    class Meta:
        model = Question
        fields = ('question', 'asker_name', 'requested', 'genres', 'followers_list', 
                  'topics', 'url', 'created_at', 'updated_at', 'all_answers', )

    def update(self, instance, validated_data, current_user):
        new_question = validated_data.get('question', instance.question)
        requested = validated_data.get('requested', [])
        genres = validated_data.get('genres', [])
        followed = validated_data.get('followed', False)
        unfollowed = validated_data.get('unfollowed', False)
        
        if followed and (
            not instance.followers.filter(username= current_user.username).exists()
            ):
            instance.followers.add(current_user)
        
        if unfollowed and instance.followers.filter(username= current_user.username).exists():
            instance.followers.remove(current_user)

        if current_user == instance.asker :
            for username in requested :
                user = CustomUser.objects.get(username = username)
                if user != instance.asker and (
                    not instance.requested.filter(username = user1.username).exists()
                    ):
                    instance.requested.add(user)
            for genre in genres :
                try:
                    instance.genres.add(Genre.objects.get(name = genre))
                except:
                    pass
        instance.question = new_question
        instance.url = new_question.lower().replace(' ', '-').replace('?', '')
        instance.updated_at = datetime.now()
        instance.save()
        return instance


class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.CharField(source='question.url')
    author_name = serializers.CharField(source='author.username')
    upvoters = serializers.SerializerMethodField()
    comment_thread = serializers.SerializerMethodField()
    upvotes = serializers.SerializerMethodField()

    def get_upvoters(self, instance):
        return([person.username for person in instance.upvoters.all()])

    def get_upvotes(self, instance):
        return instance.upvoters.all().count()

    def get_comment_thread(self, instance):
        primary_comment = instance.replied_comments.filter(parent_comment = None)
        if(primary_comment.count() == 0): return []
        return [CommentThreadSerializer(comment).data for comment in primary_comment]
        
    class Meta:
        model = Answer
        fields = ('id', 'question', 'answer', 'upvotes', 'author_name', 'upvoters',
                  'comment_thread', 'created_at', 'updated_at', )

    # pylint: disable=W0221
    def update(self, instance, validated_data, current_user):
        instance.answer = validated_data.get('answer', instance.answer)
        if validated_data.get('upvote', False) and instance.author != current_user:
            instance.upvoters.add(current_user)

        if validated_data.get('remove_upvote', False) and instance.author != current_user and (
            instance.upvoters.filter(username=current_user.username).exists()
        ):
            instance.upvoters.remove(current_user)
        
        instance.updated_at = datetime.now()
        instance.save()
        return instance

class HomePageSerializer(serializers.ModelSerializer):
    asker_name = serializers.CharField(source = 'asker.username')
    followers_list = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()
    genres = serializers.SerializerMethodField()

    def get_followers_list(self, instance):
        return([follower.username for follower in instance.followers.all()])

    def get_answer(self, instance):
        return AnswerSerializer(Answer.objects.get(id=instance.answer)).data

    def get_genres(self, instance):
        return([genre.name for genre in instance.genres.all()])

    class Meta:
        model = Question
        fields = ('question', 'asker_name', 'requested', 'genres', 'followers_list',
                  'topics', 'url', 'created_at', 'updated_at', 'answer', )


class CommentThreadSerializer(serializers.ModelSerializer):
    child_comments = serializers.SerializerMethodField()
    author_name = serializers.CharField(source = 'author.username')
    upvotes = serializers.SerializerMethodField()
    
    def get_child_comments(self, instance):
        child_comments = Comment.objects.filter(parent_comment = instance)
        if child_comments.count() == 0:
            return []
        return([CommentThreadSerializer(comment).data for comment in child_comments]) 

    def get_upvotes(self, instance):
        return instance.upvoters.all().count()

    class Meta:
        model = Comment
        fields = ('answer', 'author_name', 'comment', 'upvotes', 'child_comments', 
                  'created_at', 'updated_at', )


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source = 'author.username')
    upvotes = serializers.SerializerMethodField()

    def get_upvotes(self, instance):
        return instance.upvoters.all().count()

    class Meta:
        model = Comment
        fields = ('id', 'comment', 'author_name', 'upvotes', 'parent_comment',
                  'created_at', 'updated_at', )

    def update(self, instance, validated_data, current_user):
        instance.comment = validated_data.get('comment', instance.comment)
        
        upvote = validated_data.get('upvote', False)
        remove_upvote = validated_data.get('remove_upvote', False)

        if upvote and (not instance.upvoters.get(username = current_user.username).exists()):
            instance.comment.upvoters.add(current_user)
        
        if remove_upvote and instance.upvoters.get(username = current_user.username).exists():
            instance.comment.upvoters.remove(current_user)

        instance.updated_at = datetime.now()
        instance.save()
        return instance