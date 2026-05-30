from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return JsonResponse({'detail': '未登录，请先登录'}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
                new_refresh = str(refresh)
            else:
                new_refresh = None

            response = JsonResponse({'access': new_access})

            if new_refresh:
                is_secure = not settings.DEBUG
                response.set_cookie(
                    'refresh_token',
                    new_refresh,
                    httponly=True,
                    samesite='Lax',
                    secure=is_secure,
                    max_age=7 * 24 * 60 * 60,
                    path='/',
                )

            return response

        except TokenError:
            return JsonResponse({'detail': '登录已过期，请重新登录'}, status=401)
