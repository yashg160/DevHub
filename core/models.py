from django.db import models
from users.models import CustomUser

class Genre(models.Model):
    name = models.CharField(max_length=84)
    subscribers = models.ManyToManyField(CustomUser, related_name="subscribed_genres")

    def __str__(self):
        return self.name

class Topic(models.Model):
    name = models.CharField(max_length=84)
    followers = models.ManyToManyField(CustomUser, related_name="followed_topics")

    def __str__(self):
        return "#" + self.name

class Question(models.Model):
    question = models.CharField(max_length = 128, blank = False)
    asker = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name="asked_questions")
    requested = models.ManyToManyField(CustomUser, related_name="answer_requests")
    genres = models.ManyToManyField(Genre, related_name = "questions")
    followers = models.ManyToManyField(CustomUser, related_name="followed_questions")
    topics = models.ManyToManyField(Topic, related_name="questions")
    url = models.CharField(max_length = 150)
    created_at = models.DateTimeField(auto_now_add = True, blank = True)
    updated_at = models.DateTimeField(auto_now_add = True, blank = True)

    class Meta:
        ordering = ('-created_at', )

    def __str__(self):
        return self.question

class Answer(models.Model):
    answer = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name="written_answers")
    question = models.ForeignKey(Question, on_delete = models.CASCADE, related_name="answers")
    upvoters = models.ManyToManyField(CustomUser, related_name="upvoted_answers")
    created_at = models.DateTimeField(auto_now_add = True, blank = True)
    updated_at = models.DateTimeField(auto_now_add = True, blank = True)


class Comment(models.Model):
    comment = models.CharField(max_length = 200)
    author = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name = "written_comments")
    answer = models.ForeignKey(Answer, on_delete = models.CASCADE, related_name="comments")
    upvoters = models.ManyToManyField(CustomUser, related_name="upvoted_comments")
    parent_comment = models.OneToOneField("self", on_delete = models.CASCADE, related_name="next_in_thread")
    child_comment = models.OneToOneField("self", on_delete = models.CASCADE, related_name="previous_in_thread")
    created_at = models.DateTimeField(auto_now_add = True, blank = True)
    updated_at = models.DateTimeField(auto_now_add = True, blank = True)
