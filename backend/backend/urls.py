from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("vitals.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("", include("vitals.urls")),
]
