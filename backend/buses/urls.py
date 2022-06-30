from django.urls import path

from . import views

urlpatterns = [
    path('getShape',views.getShape),
    path('getStopsForRoute/<route_id_requested>/',views.getStopsForRoute),
    
]