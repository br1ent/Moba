from django.urls import path
from web.views.user.account import (
    RegisterView, LoginView, ResetPasswordView,
    UserinfoView, CookieTokenRefreshView, LogoutView,
)
from web.views.user.profile import (
    UpdateUsernameView, UpdateAvatarView, UpdatePasswordView, UpdateBioView,
)

urlpatterns = [
    path('user/account/register/', RegisterView.as_view(), name='register'),
    path('user/account/login/', LoginView.as_view(), name='login'),
    path('user/account/reset_password/', ResetPasswordView.as_view(), name='reset_password'),
    path('user/account/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('user/account/userinfo/', UserinfoView.as_view(), name='userinfo'),
    path('user/account/logout/', LogoutView.as_view(), name='logout'),
    path('user/profile/update_username/', UpdateUsernameView.as_view(), name='update_username'),
    path('user/profile/update_avatar/', UpdateAvatarView.as_view(), name='update_avatar'),
    path('user/profile/update_password/', UpdatePasswordView.as_view(), name='update_password'),
    path('user/profile/update_bio/', UpdateBioView.as_view(), name='update_bio'),
]
