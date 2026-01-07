from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/module/<int:module_id>/content/', views.get_module_content, name='get_module_content'),
    path('api/module/<int:module_id>/start_test/', views.start_test, name='start_test'),
    path("api/module/<int:module_id>/ask/", views.ask_question, name="ask_question"),
]
