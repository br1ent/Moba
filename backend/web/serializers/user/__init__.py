from rest_framework import serializers
from django.contrib.auth import get_user_model
from web.models import UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    rank_score = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'rank_score', 'bio']

    def get_avatar(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.avatar:
            return profile.avatar.url
        return ''

    def get_rank_score(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.rank_score if profile else 1000

    def get_bio(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.bio if profile else ''
