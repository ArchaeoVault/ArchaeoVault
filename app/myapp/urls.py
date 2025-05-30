from django.contrib import admin
from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/all_artifacts/', views.all_artifacts_view, name='all_artifacts_view'),
    path('api/single_artifact/', views.single_artifact_view, name='single_artifact_view'),
    path('api/image_table/', views.all_image_table_view, name='all_image_table_view'),
    path('api/create_user/', views.create_user_view, name='create_user_view'),
    path('api/login/', views.login_view, name='login_view'),
    path('api/resend_verification', views.resend_verification_view, name='resend_verification_view'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('api/change_password/<uidb64>/<token>/', views.change_password_view, name='change_password_view'),
    path('api/delete_artifact/', views.delete_artifact_view, name='delete_artifact_view'),
    path('api/edit_artifact/', views.edit_artifact_view, name='edit_artifact_view'),
    path('api/logout/', views.logout_view, name='logout_view'),
    path('api/get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),
    path('api/admin_create_user/', views.admin_create_user_view, name='admin_create_user_view'),
    path('api/admin_edit_user/', views.admin_edit_user_view, name='admin_edit_user_view'),
    path('api/admin_delete_user/', views.admin_delete_user_view, name='admin_delete_user_view'),
    path('api/admin_see_all_users/', views.admin_see_all_users_view, name='admin_see_all_users_view'),
    path('api/admin_reset_user_password/', views.admin_reset_user_password_view, name='admin_reset_user_password_view'),
    path('api/send_password_reset', views.send_password_reset_view, name = 'send_password_reset_view'),
    path('api/newport_artifacts/', views.newport_artifacts_view, name='newport_artifacts_view'),
    path('api/portsmouth_artifacts/', views.portsmouth_artifacts_view, name='portsmouth_artifacts_view'),
    path('api/redirect_change_password/<uidb64>/<token>/', views.redirect_change_password, name = 'redirect_change_password'),
    path('api/get_email_from_token/<uidb64>/<token>/', views.get_email_from_token, name='get_email_from_token'),
    path('api/user_permission/', views.get_user_permission, name='get_user_permission'),
    path('api/add_artifact/', views.add_artifact_view, name='add_artifact_view'),

    re_path(r'^.*$', views.home),
]
