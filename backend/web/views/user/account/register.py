from django.conf import settings
from django.http import JsonResponse
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from web.serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        response = JsonResponse({
            'message': '注册成功',
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        })

        is_secure = not settings.DEBUG
        response.set_cookie(
            'refresh_token',
            str(refresh),
            httponly=True,
            samesite='Lax',
            secure=is_secure,
            max_age=7 * 24 * 60 * 60,
            path='/',
        )

        return response
