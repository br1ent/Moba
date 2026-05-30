from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from web.views.user.account import RegisterView, LoginView, ResetPasswordView

urlpatterns = [
    path('user/account/register/', RegisterView.as_view(), name='register'),
    path('user/account/login/', LoginView.as_view(), name='login'),
    path('user/account/reset_password/', ResetPasswordView.as_view(), name='reset_password'),
    path('user/account/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
