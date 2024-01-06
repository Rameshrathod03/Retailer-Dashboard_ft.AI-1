from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("accessToken/", views.AccessTokenView.as_view(), name="access_token"),

    path("customerProfile/", views.CustomerProfile.as_view(), name="customer_profile"),
]