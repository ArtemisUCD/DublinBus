from turtle import Shape
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from .models import Stops, DailyWeather, BusesUpdates, Trips, StopTimes, Shapes, Routes
from rest_framework import viewsets,generics
from .serializers import StopsSerializer, WeatherForecastSerializer, BusesUpdatesSerializer, TripsSerializer, StopTimesSerializer, ShapesSerializer, RoutesSerializer
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

@api_view(['GET'])
def getUpdatesForStop(request):
    route_id_selected = '60-46A-b12-1' # harcoded trips 
    stop_id_selected = '8220DB000326' 
    update_set = BusesUpdates.objects.all()

    if stop_id_selected is not None:
        update_set = update_set.filter(stop_id=stop_id_selected)
        print(len(update_set))

    serializer = BusesUpdatesSerializer(update_set,many=True) 

    return Response(serializer.data) #return the data 


@api_view(['GET'])
def getShape(request, route_id_requested):
    trips_set = Trips.objects.all()

    # get all trips !
    # route_id_selected = '60-46A-b12-1'
    shape_set = Shapes.objects.all()

    # queryset = Shapes.objects.all()
    if route_id_requested is not None:
        trips_set = trips_set.filter(route=route_id_requested)
        first_trip = trips_set.first()
        first_trip_id = first_trip.shape_id
        #print('first_trip_id : ',first_trip_id)

    bus_route_shape = []
    bus_route_shape = shape_set.filter(shape_id=first_trip_id)
    # print(len(bus_route_shape),len(shape_set))
    # print(bus_route_shape)
    serializer = ShapesSerializer(bus_route_shape,many=True) 

    return Response(serializer.data) #return the data 

#test for route 46A = route-id : 60-46A-b12-1
@api_view(['GET'])
def getStopsForRoute(request, route_id_requested):
    # route_id_selected = '60-46A-b12-1' # harcoded trips
    print(route_id_requested)
    trips_set = Trips.objects.all()


    # queryset = Shapes.objects.all()
    if route_id_requested is not None:
        trips_set = trips_set.filter(route=route_id_requested)
        first_trip = trips_set.first()
        first_trip_id = first_trip.trip_id # retrieve and trip ID

    stop_times_set = StopTimes.objects.all()
    # get all stops !
    bus_route_stops_times = []
    bus_route_stops_times = stop_times_set.filter(trip_id=first_trip_id)

    
    bus_route_stops = []
    stop_set = Stops.objects.all()

    for stop in bus_route_stops_times.iterator():
        current_stop_id = stop.stop_id
        current_stop = stop_set.filter(stop_id=current_stop_id)[0] #get first element cus always 1 elemnt cus primary key !
        bus_route_stops.append(current_stop)

    serializer = StopsSerializer(bus_route_stops,many=True) 

    return Response(serializer.data) #return the data 

    
@api_view(['GET'])
def getBusRouteList(request):
    route_set = Routes.objects.all()

    serializer = RoutesSerializer(route_set,many=True) 

    return Response(serializer.data) #return the data 
