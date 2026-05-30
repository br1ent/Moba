from rest_framework.response import Response
from rest_framework.views import APIView
from web.serializers import UserSerializer


class UserinfoView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)
