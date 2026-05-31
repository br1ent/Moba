from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = verbose_name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatar/', default='avatar/default.png', blank=True)
    rank_score = models.IntegerField(default=1500, verbose_name='历史最高天梯分')
    current_rank_score = models.IntegerField(default=1500, verbose_name='当前天梯分')
    bio = models.TextField(default='', blank=True, verbose_name='Bio')

    class Meta:
        db_table = 'user_profile'
        verbose_name = 'User Profile'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f'{self.user.username} profile'
