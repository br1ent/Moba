from rest_framework.response import Response
from rest_framework.views import APIView
from web.serializers import ResetPasswordSerializer


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': '密码重置成功'})
