from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    password_confirm = serializers.CharField()

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': '两次密码不一致'})
        if not User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': '用户不存在'})
        return data

    def save(self, **kwargs):
        user = User.objects.get(username=self.validated_data['username'])
        user.set_password(self.validated_data['password'])
        user.save()
        return user
