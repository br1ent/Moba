from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from web.serializers import LoginSerializer, UserSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        response = JsonResponse({
            'message': '登录成功',
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
