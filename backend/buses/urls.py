from django.urls import path

from . import views

urlpatterns = [
    path('getShape/<route_id_requested>/',views.getShape, name='getShape'),
    path('getStopsForRoute/<route_id_requested>/',views.getStopsForRoute, name='getStopsForRoute'),
    path('getUpdatesForStop/<stop_id_requested>/',views.getUpdatesForStop, name='getUpdatesForStop'),
    path('getBusRouteList',views.getBusRouteList, name='getBusRouteList'),
    path('getBusStopList',views.getBusStopList, name='getBusStopList'),
    # path('getEstimateTime',views.getEstimateTime, name='getEstimateTime'),
    path('getEstimateTime/<int:timestamp>/<route_short_name>/<headsign>/<int:num_stops>/<int:weather_icon_num>',views.getEstimateTime, name='getEstimateTime'),
]