from django.http import FileResponse
from django.conf import settings
import os


def spa_view(request, path=''):
    index_path = os.path.join(settings.BASE_DIR, 'static', 'frontend', 'index.html')
    return FileResponse(open(index_path, 'rb'))
