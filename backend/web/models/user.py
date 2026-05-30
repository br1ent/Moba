from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatar/', default='', blank=True)
    rank_score = models.IntegerField(default=1000, verbose_name='排位分')
    bio = models.TextField(default='', blank=True, verbose_name='个人简介')

    class Meta:
        db_table = 'user'
        verbose_name = 'user'
        verbose_name_plural = verbose_name
