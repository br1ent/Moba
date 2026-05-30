from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from web.serializers.user.profile import (
    UpdateUsernameSerializer,
    UpdateAvatarSerializer,
    UpdatePasswordSerializer,
    UpdateBioSerializer,
)
from web.serializers import UserSerializer


class UpdateUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdateUsernameSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UpdateAvatarSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdatePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': '密码修改成功'})


class UpdateBioView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdateBioSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)
