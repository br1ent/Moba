from rest_framework import serializers
from django.contrib.auth import get_user_model
from web.models import UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    rank_score = serializers.SerializerMethodField()
    current_rank_score = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'rank_score', 'current_rank_score', 'bio']

    def get_avatar(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.avatar:
            return profile.avatar.url
        from django.conf import settings
        return settings.MEDIA_URL + 'avatar/default.png'

    def get_rank_score(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.rank_score if profile else 1500

    def get_current_rank_score(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.current_rank_score if profile else 1500

    def get_bio(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.bio if profile else ''
