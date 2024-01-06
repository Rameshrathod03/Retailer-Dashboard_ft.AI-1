from functools import wraps
from django.utils.cache import patch_vary_headers
from django.views.decorators.cache import cache_page

def vary_on_get_param(param):
    def decorator(func):
        @wraps(func)
        def _wrapped_view(request, *args, **kwargs):
            response = func(request, *args, **kwargs)
            if request.method == 'GET':
                param_value = request.GET.get(param, '')
                patch_vary_headers(response, ['Get-Param-' + param_value])
            return response
        return _wrapped_view
    return decorator
