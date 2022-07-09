from turtle import Shape
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from .models import Stops, DailyWeather, BusesUpdates, Trips, StopTimes, Shapes, Routes
from rest_framework import viewsets,generics
from .serializers import StopsSerializer, WeatherForecastSerializer, BusesUpdatesSerializer, TripsSerializer, StopTimesSerializer, ShapesSerializer, RoutesSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.cache import cache
from django.db import connection
import pandas as pd


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
def getUpdatesForStop(request,stop_id_requested):
    # route_id_selected = '60-46A-b12-1' # harcoded trips 
    # stop_id_selected = '8220DB000326' 
    update_set = BusesUpdates.objects.all()
    trips_set = Trips.objects.all()
    stop_times_set = StopTimes.objects.all()
    route_set = Routes.objects.all()

    if stop_id_requested is not None:
        update_set = update_set.filter(stop_id=stop_id_requested)
        # print('this is leng ',len(update_set))
    
    all_next_buses = []
    for stop in update_set.iterator():
        current_trip_id = stop.trip_id
        current_trip  = trips_set.filter(trip_id=current_trip_id)
        if current_trip.exists(): #when the trip id doesn't match 
            current_trip  = trips_set.filter(trip_id=current_trip_id).first()
            current_trip_headsign = current_trip.trip_headsign
            current_route = route_set.filter(route_id=stop.route_id).first()
            current_route_num = current_route.route_short_name
            concat_name = current_route_num + " - " + current_trip_headsign
            current_stop_time = stop_times_set.filter(trip_id=current_trip_id, stop_sequence=stop.stop_sequence ).first()
            planned_arrival_time = current_stop_time.arrival_time
            planned_departure_time = current_stop_time.departure_time
            estimated_arrival_delay = stop.arrival_delay
            estimated_departure_delay = stop.departure_delay
            current_dict = {'concat_name':concat_name, 'planned_arrival_time':planned_arrival_time,'estimated_arrival_delay':estimated_arrival_delay,
                              'planned_departure_time':planned_departure_time, 'estimated_departure_delay':estimated_departure_delay }
            all_next_buses.append(current_dict)  
            

    serializer = BusesUpdatesSerializer(update_set,many=True) 

    return Response(all_next_buses) #return the data 


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

@api_view(['GET'])
def getStopsForRoute(request, route_id_requested):
    # route_id_selected = '60-46A-b12-1' # harcoded trips
    
    # incase need to split the string !! just change name argument var to route_var_requested
    ###################################
    # string_list = route_id_requested.split()
    # route_set =  Routes.objects.filter(route_short_name=string_list[0])
    # route_id_requested = route_set.first().route_id
    # print(route_id_requested)
    ###################################
    
    df_trips = pd.DataFrame(list(Trips.objects.all().values('route','trip_id')))

    # queryset = Shapes.objects.all()
    if route_id_requested is not None:
        # trips_set = trips_set.filter(route=route_id_requested)
        first_trip_id = df_trips[df_trips['route'] == route_id_requested]['trip_id'].iloc[0]
        # first_trip = trips_set.first()
        # first_trip_id = first_trip.trip_id # retrieve and trip ID

    # df_stop_times = pd.DataFrame(list(StopTimes.objects.all().value()))
    # get all stops !
    # bus_route_stops_times = []
    bus_route_stops_times = pd.DataFrame(list(StopTimes.objects.filter(trip_id=first_trip_id).values('stop_id')))#all stops on a route 

    bus_route_stops = []
    df_stop = pd.DataFrame(list(Stops.objects.all().values()))

    for stop in bus_route_stops_times.iterrows():
        current_stop_id = stop[1]['stop_id']
    #     current_stop = Stops.objects.filter(stop_id=current_stop_id)[0] #get first element cus always 1 elemnt cus primary key !
        current_stop = df_stop[df_stop['stop_id'] == current_stop_id].iloc[0]
        bus_route_stops.append(current_stop.to_dict())

    # serializer = StopsSerializer(bus_route_stops,many=True) 
    # print(connection.queries)
    return Response(bus_route_stops) #return the data 

# @api_view(['GET'])
# def getBusRouteList(request):
#     # route_set = .all()
#     # trips_set = all()
    
#     trip_set_unique_headsign = Trips.objects.order_by('trip_headsign').values('trip_headsign').distinct() #select all unique trip headsign 
#     print(len(trip_set_unique_headsign))
#     # route_set_short_name = Routes.objects.values('route_short_name')

#     routes = []
#     for trip in trip_set_unique_headsign.iterator():
#         route_long_name = trip['trip_headsign']
#         route_id = Trips.objects.filter(trip_headsign = route_long_name).values('route_id').first()['route_id']
#         route_short_name = Routes.objects.filter(route_id = route_id).values('route_short_name').first()['route_short_name']
#         concat_name_str = route_short_name + ' - ' + route_long_name
#         route_dict = {'route_id': route_id, 'concat_name': concat_name_str }
#         routes.append(route_dict)

#     print(connection.queries)
#     print(len(routes))
#     return Response(routes) #return the data 


@api_view(['GET'])
def getBusRouteList(request):
    df_trips = pd.DataFrame(list(Trips.objects.all().values('trip_headsign','route_id')))
    df_route = pd.DataFrame(list(Routes.objects.all().values('route_id','route_short_name')))
    
    trip_set_unique_headsign = Trips.objects.order_by('trip_headsign').values('trip_headsign').distinct() #select all unique trip headsign 
    print(len(trip_set_unique_headsign))
    print(df_trips.columns.values.tolist())

    routes = []
    for trip in trip_set_unique_headsign.iterator():
        route_long_name = trip['trip_headsign']
        route_id = df_trips[df_trips['trip_headsign'] == route_long_name]['route_id'].iloc[0] #Trips.objects.filter(trip_headsign = route_long_name).values('route_id').first()['route_id']
        route_short_name =  df_route[df_route['route_id'] == route_id]['route_short_name'].iloc[0] #Routes.objects.filter(route_id = route_id).values('route_short_name').first()['route_short_name']
        concat_name_str = route_short_name + ' - ' + route_long_name
        route_dict = {'route_id': route_id, 'concat_name': concat_name_str }
        routes.append(route_dict)
        # print(route_short_name)

    print(connection.queries)
    print(len(routes))
    return Response(routes) #return the data 



@api_view(['GET'])
def getBusStopList(request):
    stop_set = Stops.objects.all()

    stop_list = []
    for stop in stop_set.iterator():
        stop_name_str = stop.stop_name
        stop_name_str_short = stop_name_str.split(", ")
        concat_name = {'stop_name': stop_name_str_short[0]}
        stop_list.append(stop_name_str_short[0])
        
    unique_stop_list = []
    unique_stop_dict = []
    for i in stop_list:
        if i not in unique_stop_list:
            unique_stop_list.append(i)
            unique_stop_dict.append({'stop_name':i})
    print(connection.queries)
    return Response(unique_stop_dict) #return the data 
