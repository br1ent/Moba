from django.http import JsonResponse
from rest_framework.views import APIView


class LogoutView(APIView):
    def post(self, request):
        response = JsonResponse({'message': '退出成功'})
        response.delete_cookie('refresh_token', path='/')
        return response
