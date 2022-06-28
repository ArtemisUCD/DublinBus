from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from .models import Stops, DailyWeather, BusesUpdates
from rest_framework import viewsets
from .serializers import StopsSerializer, WeatherForecastSerializer, BusesUpdatesSerializer



def index(request):
    return HttpResponse("Hello, world. You're at the bus app index.")

def routes(request,id_route):
    return HttpResponse("Hello, world. These is the dublin bus route num %s. " % id_route)

def stops(request,id_stop):
    stops_list = Stops.objects.order_by('-stop_id')[:5]
    
    output = '<br> '.join([q.stop_name for q in stops_list])
    context = {
        'stops_list': stops_list,
    }
    return render(request, 'stops.html',context)

class StopsView(viewsets.ModelViewSet):
    serializer_class = StopsSerializer
    queryset = Stops.objects.all()

class WeatherView(viewsets.ModelViewSet):
    serializer_class = WeatherForecastSerializer
    queryset = DailyWeather.objects.all()

class BusesUpdatesView(viewsets.ModelViewSet):
    serializer_class = BusesUpdatesSerializer
    queryset = BusesUpdates.objects.all()

    # 13477.3.60-39A-b12-1.213.I to try
    tripId = '13477.3.60-39A-b12-1.213.I'
    if tripId is not None:
        queryset = queryset.filter(trip_id=tripId)
