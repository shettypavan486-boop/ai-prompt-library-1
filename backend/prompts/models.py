from django.db import models
from django.core.exceptions import ValidationError


class Prompt(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if len(self.title.strip()) < 3:
            raise ValidationError({"title": "Title must be at least 3 characters."})

        if len(self.content.strip()) < 20:
            raise ValidationError({"content": "Content must be at least 20 characters."})

        if self.complexity < 1 or self.complexity > 10:
            raise ValidationError({"complexity": "Complexity must be between 1 and 10."})

    def __str__(self):
        return self.title
