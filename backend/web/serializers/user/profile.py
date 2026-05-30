from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UpdateUsernameSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError('用户名已存在')
        return value

    def save(self):
        user = self.context['request'].user
        user.username = self.validated_data['username']
        user.save()
        return user


class UpdateAvatarSerializer(serializers.Serializer):
    avatar = serializers.ImageField()

    def save(self):
        user = self.context['request'].user
        profile = user.profile
        profile.avatar = self.validated_data['avatar']
        profile.save()
        return profile


class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('当前密码错误')
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': '两次密码不一致'})
        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class UpdateBioSerializer(serializers.Serializer):
    bio = serializers.CharField(max_length=200, required=False, allow_blank=True)

    def save(self):
        user = self.context['request'].user
        profile = user.profile
        profile.bio = self.validated_data.get('bio', '')
        profile.save()
        return profile
