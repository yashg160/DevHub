from rest_framework.permissions import BasePermission

SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')

class isSuperuserOrReadOnly(BasePermission):
    """
    Request authenticated if Superuser  
    Or it is a read-only request
    """
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            (
                request.user and
                request.user.is_authenticated and
                request.user.is_superuser
            )
        )