from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Rival
import logging

logger = logging.getLogger(__name__)

def index(request):
    rivals = Rival.objects.all()
    return render(request, 'index.html', {'rivals': rivals})

def update_count(request, name, type):
    logger.debug(f"Request method: {request.method}")
    logger.debug(f"CSRF token: {request.META.get('CSRF_COOKIE')}")
    logger.debug(f"Name: {name}, Type: {type}")

    if request.method == 'POST':
        try:
            rival = get_object_or_404(Rival, name=name)
            if type == 'SVP':
                rival.svp_count += 1
            elif type == 'MVP':
                rival.mvp_count += 1
            rival.save()
            logger.debug(f"Updated counts - SVP: {rival.svp_count}, MVP: {rival.mvp_count}")
            return JsonResponse({'svp_count': rival.svp_count, 'mvp_count': rival.mvp_count})
        except Exception as e:
            logger.error(f"Error updating counts: {e}")
            return JsonResponse({'error': 'Error updating counts'}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)