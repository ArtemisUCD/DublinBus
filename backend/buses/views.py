from turtle import Shape
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from .models import Stops, DailyWeather, BusesUpdates, Trips, StopTimes, Shapes
from rest_framework import viewsets,generics
from .serializers import StopsSerializer, WeatherForecastSerializer, BusesUpdatesSerializer, TripsSerializer, StopTimesSerializer, ShapesSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


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


#try with hard coded trip id 
class BusesUpdatesView(viewsets.ModelViewSet):
    serializer_class = BusesUpdatesSerializer
    queryset = BusesUpdates.objects.all()

    # 13477.3.60-39A-b12-1.213.I to try
    tripId = '13477.3.60-39A-b12-1.213.I'
    if tripId is not None:
        queryset = queryset.filter(trip_id=tripId)

#test for route 46A = route-id : 60-46A-b12-1
class StopForRouteView(viewsets.ModelViewSet):
    route_id_selected = '60-46A-b12-1'

    # get all trips !
    serializer_class = TripsSerializer
    # serializer_class = StopTimesSerializer
    # queryset = StopTimes.objects.all()
    # for star in queryset.iterator():
    #     if star.id == 1 :
    #         print('first object ')
    #         break
    #queryset = StopTimes.objects.first()
 #   queryset = queryset.filter(id='1')
  #  queryset = queryset.first(trip_id='13250.y1001.60-1-d12-1.1.O')

    #only keep the trips with that route id 
    # if route_id_selected is not None:
    #     queryset = queryset.filter(route=route_id_selected)
    #     first_trip = queryset.first()
    #     trip_id_used = first_trip['trip_id']
        #print(first_trip)
        # trip_id_used = first_trip('trip_id')

    # if trip_id_used is not None:
    #     queryset = queryset.filter(route=route_id_selected)
    #     first_trip = queryset[1]
    #     trip_id_used = first_trip('trip_id')



@api_view(['GET'])
def getShape(request):
    trips_set = Trips.objects.all()
    serializer_class = TripsSerializer

    # get all trips !
    route_id_selected = '60-46A-b12-1'
    shape_set = Shapes.objects.all()

    # queryset = Shapes.objects.all()
    if route_id_selected is not None:
        trips_set = trips_set.filter(route=route_id_selected)
        first_trip = trips_set.first()
        first_trip_id = first_trip.shape_id
        print('first_trip_id : ',first_trip_id)

    bus_route_shape = []
    bus_route_shape = shape_set.filter(shape_id=first_trip_id)
   
    print(len(bus_route_shape),len(shape_set))
    print(bus_route_shape)
    serializer = ShapesSerializer(bus_route_shape,many=True) 

    return Response(serializer.data) #return the data 