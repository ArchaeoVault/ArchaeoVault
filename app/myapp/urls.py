"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
    path('', views.index, name='index'),
    path('all_artifacts/', views.all_artifacts_view, name = 'all_artifacts_view'),
    path('api/create_user/', views.create_user_view, name = 'create_user_view'),
    path('api/login/', views.login_view, name = 'login_view'),
    path('api/change_password', views.change_password_view, name = 'change_password_view'),
    path('api/get_csrf_token/', views.get_csrf_token, name = 'get_csrf_token')
]
