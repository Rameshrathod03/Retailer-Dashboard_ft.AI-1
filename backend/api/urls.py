from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("accessToken/", views.AccessTokenView.as_view(), name="access_token"),

    path("customerProfile/", views.CustomerProfile.as_view(), name="customer_profile"),

    path("marketAnalysis/", views.MarketAnalysis.as_view(), name="market_analysis"),

    path("marketing/", views.Marketing.as_view(), name="marketing"),

    path("generateContent/", views.GenerateContent.as_view(), name="generate_content"),
]