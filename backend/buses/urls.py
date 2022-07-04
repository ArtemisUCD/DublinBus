from django.urls import path

from . import views

urlpatterns = [
    path('getShape/<route_id_requested>/',views.getShape),
    path('getStopsForRoute/<route_id_requested>/',views.getStopsForRoute),
    path('getUpdatesForStop',views.getUpdatesForStop),
    path('getBusRouteList',views.getBusRouteList),

]