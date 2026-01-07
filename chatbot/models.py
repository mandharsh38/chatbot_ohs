from django.db import models

# Create your models here.

# ----------------------
# Employees
# ----------------------
class Employee(models.Model):
    username = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

# ----------------------
# Training Modules
# ----------------------
class TrainingModule(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    content_text = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# ----------------------
# MCQs
# ----------------------
class MCQ(models.Model):
    CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]

    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE, related_name="mcqs")
    question_text = models.TextField()
    question_image = models.URLField(max_length=500, blank=True, null=True)
    choice_a = models.TextField()
    choice_b = models.TextField()
    choice_c = models.TextField()
    choice_d = models.TextField()
    correct_choice = models.CharField(max_length=1, choices=CHOICES)
    weight = models.FloatField(default=1.0)

    class Meta:
        indexes = [
            models.Index(fields=['module']),
        ]

    def __str__(self):
        return f"MCQ {self.id} for {self.module.title}"

# ----------------------
# Test Configuration
# ----------------------
class TestConfig(models.Model):
    module = models.OneToOneField(TrainingModule, on_delete=models.CASCADE, related_name="test_config")
    num_questions = models.IntegerField(default=30)
    passing_percentage = models.FloatField(default=70.0)
    retrain_days = models.IntegerField(default=365)
    enforce_retrain = models.BooleanField(default=True)

    def __str__(self):
        return f"TestConfig for {self.module.title}"

# ----------------------
# Test Attempts
# ----------------------
class TestAttempt(models.Model):
    user = models.ForeignKey(Employee, on_delete=models.CASCADE)
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE)
    score = models.FloatField(default=0.0)
    passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'module', 'completed_at']),
        ]

    def __str__(self):
        return f"Attempt {self.id} by {self.user.username}"

# ----------------------
# Test Answers
# ----------------------
class TestAnswer(models.Model):
    CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]

    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(MCQ, on_delete=models.CASCADE)
    selected_choice = models.CharField(max_length=1, choices=CHOICES, blank=True, null=True)
    correct = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['attempt']),
        ]

# ----------------------
# Training Completion Tracker
# ----------------------
class TrainingCompletion(models.Model):
    user = models.ForeignKey(Employee, on_delete=models.CASCADE)
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'module')

    def __str__(self):
        return f"{self.user.username} completed {self.module.title}"
