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
        print('this is leng ',len(update_set))
    
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

#test for route 46A = route-id : 60-46A-b12-1
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


# def getTripsAll():
#     trips_set = Trips.objects.all()
#     serializer = TripsSerializer(trips_set,many=True) 
#     print(connection.queries,'tesnulle')
#     return (trips_set) 

@api_view(['GET'])
def getBusRouteList(request):
    route_set = Routes.objects.all()
    trips_set = Trips.objects.all()
    
    route_set_short_name = route_set.order_by('route_short_name').values('route_short_name').distinct() #select all unique name 
    # route_set_short_name = Routes.objects.values('route_short_name')

    unique_routes = []
    for stop in route_set_short_name.iterator():
        route_set_actu = route_set.filter(route_short_name=stop['route_short_name']).first()
        current_route_id = route_set_actu.route_id
        direction=0
        
        for direction in range(0,2):
            trip_set_actu = trips_set.filter(route_id = current_route_id,direction_id=direction).first()
            if trip_set_actu is not None:
                # print(trip_set_actu)
                concat_name_str = stop['route_short_name'] + ' - ' + trip_set_actu.trip_headsign
                concat_name = {'route_id': current_route_id, 'concat_name': concat_name_str }
                unique_routes.append(concat_name)

            # else:
                # print('NOOOOOOOOOOOOOOOOOOOOO')
            

        # for current_route in route_set_actu.iterator():
        #     # current_route_id = route_set_actu[0].route_id
        #     current_route_id = current_route.route_id
        #     print(current_route_id,direction)
        #     full_trip_set_actu = trips_set.filter(route_id = current_route_id)

        #     if direction >=1 & len(full_trip_set_actu)>1 :
        #         trip_set_actu = full_trip_set_actu[1]
        #     else :
        #         trip_set_actu = full_trip_set_actu.first()
        #     # print(current_route_id, trip_set_actu)
            
        #     #print(current_route_id)
            
        #     direction+=1
            
      
    # serializer = RoutesSerializer(route_set_short_name,many=True) 
    print(connection.queries)
    return Response(unique_routes) #return the data 


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
