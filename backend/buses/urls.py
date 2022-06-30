from django.urls import path

from . import views

urlpatterns = [
    path('getShape',views.getShape),
    path('getStopsForRoute',views.getStopsForRoute),
    
]