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
import datetime as dt
from django.db.models import F
import pickle
from datetime import datetime  
import datetime as dt

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
    # update_set = pd.DataFrame(list(BusesUpdates.objects.all().values()))
    df_trips = pd.DataFrame(list(Trips.objects.all().values()))
    # df_stop_times = pd.DataFrame(list(StopTimes.objects.all().values('trip_id','stop_sequence','arrival_time')))
    df_route = pd.DataFrame(list(Routes.objects.all().values()))

    if stop_id_requested is not None:
        update_set = BusesUpdates.objects.filter(stop_id=stop_id_requested)
        # print('this is leng ',len(update_set))
    
    all_next_buses = []
    for stop in update_set.iterator():
        current_trip_id = stop.trip_id
        current_trip  = df_trips[df_trips['trip_id'] == current_trip_id].iloc[0] #trips_set.filter(trip_id=current_trip_id)
        current_trip_headsign = current_trip['trip_headsign']
        current_route_id = stop.route_id
        current_route = df_route[df_route['route_id'] == current_route_id].iloc[0] #Routes.objects.filter(route_id=stop.route_id).first()
        current_route_num = current_route['route_short_name']
        # current_stop_time = df_stop_times[df_stop_times['trip_id'] == current_trip_id & df_stop_times['stop_sequence'] == stop.stop_sequence].iloc[0]
        current_stop_time = StopTimes.objects.filter(trip_id=current_trip_id, stop_sequence=stop.stop_sequence ).values('trip_id','stop_sequence','arrival_time').first()
        planned_arrival_time = current_stop_time['arrival_time']
        estimated_arrival_delay = stop.arrival_delay
        
        if estimated_arrival_delay != -1 :
            # time_change = datetime.timedelta(minutes=2)
            print('diff -1', type(estimated_arrival_delay))
            estimated_arrival_delay_min = int(estimated_arrival_delay/60)
        else :
            estimated_arrival_delay_min = 0
        separator = ":"
        arr_planned = planned_arrival_time.split(separator)
        arr_planned[1] = int(arr_planned[1]) + estimated_arrival_delay_min
   
        if arr_planned[1] >= 60 :
            arr_planned[1] = arr_planned[1] - 60
            arr_planned[0] = int(arr_planned[0]) +1
            arr_planned[1] = str(arr_planned[1])
            arr_planned[0] = str(arr_planned[0])

        if arr_planned[1] < 0 :
            arr_planned[1] = arr_planned[1] + 60
            arr_planned[0] = int(arr_planned[0]) -1
            arr_planned[1] = str(arr_planned[1])
            arr_planned[0] = str(arr_planned[0])
        arr_planned[1] = str(arr_planned[1])
        print(arr_planned)
        concat_name = current_route_num + " - " + current_trip_headsign
        # planned_arrival_time = dt.strptime(planned_arrival_time, '%H:%M:%S')
        # date_and_time = datetime.datetime(2021, 8, 22, 11, 2, 5)


        estimated_arrival_time = separator.join(arr_planned)

        current_dict = {'concat_name':concat_name, 'planned_arrival_time':planned_arrival_time,'estimated_arrival_delay_min':estimated_arrival_delay_min ,
                            'estimated_arrival_time'  : estimated_arrival_time }
        all_next_buses.append(current_dict)  
        
        # if current_trip.exists(): #when the trip id doesn't match 
            # current_trip  = trips_set.filter(trip_id=current_trip_id).first()
    #     current_trip_headsign = current_trip.trip_headsign
    #         current_route = route_set.filter(route_id=stop.route_id).first()
    #         current_route_num = current_route.route_short_name
    #         concat_name = current_route_num + " - " + current_trip_headsign
    #         current_stop_time = stop_times_set.filter(trip_id=current_trip_id, stop_sequence=stop.stop_sequence ).first()
    #         planned_arrival_time = current_stop_time.arrival_time
    #         planned_departure_time = current_stop_time.departure_time
    #         estimated_arrival_delay = stop.arrival_delay
    #         estimated_departure_delay = stop.departure_delay
    #         current_dict = {'concat_name':concat_name, 'planned_arrival_time':planned_arrival_time,'estimated_arrival_delay':estimated_arrival_delay,
    #                           'planned_departure_time':planned_departure_time, 'estimated_departure_delay':estimated_departure_delay }
    #         all_next_buses.append(current_dict)  
            

    # serializer = BusesUpdatesSerializer(update_set,many=True) 
    print(connection.queries)
    return Response(all_next_buses) #return the data 


@api_view(['GET'])
def getShape(request, route_id_requested):
    trips_set = Trips.objects.all()

    # get all trips !
    # route_id_selected = '60-46A-b12-1'
    # shape_set = Shapes.objects.all()

    # queryset = Shapes.objects.all()
    if route_id_requested is not None:
        trips_set = trips_set.filter(route=route_id_requested)
        first_trip = trips_set.first()
        first_trip_id = first_trip.shape_id
        #print('first_trip_id : ',first_trip_id)

    bus_route_shape = []
    bus_route_shape = Shapes.objects.filter(shape_id=first_trip_id).annotate(lat=F('shape_pt_lat'),lng=F('shape_pt_lon')).values('lat','lng')
    # print(len(bus_route_shape),len(shape_set))
    # print(bus_route_shape)
    # serializer = ShapesSerializer(bus_route_shape,many=True) 
    # print(connection.queries)
    return Response(bus_route_shape) #return the data 

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

@api_view(['GET'])
def getBusRouteList(request):
    df_trips = pd.DataFrame(list(Trips.objects.all().values('trip_headsign','route_id')))
    df_route = pd.DataFrame(list(Routes.objects.all().values('route_id','route_short_name')))
    
    trip_set_unique_headsign = Trips.objects.order_by('trip_headsign').values('trip_headsign').distinct() #select all unique trip headsign 
    # print(len(trip_set_unique_headsign))
    # print(df_trips.columns.values.tolist())

    routes = []
    for trip in trip_set_unique_headsign.iterator():
        route_long_name = trip['trip_headsign']
        route_id = df_trips[df_trips['trip_headsign'] == route_long_name]['route_id'].iloc[0] #Trips.objects.filter(trip_headsign = route_long_name).values('route_id').first()['route_id']
        route_short_name =  df_route[df_route['route_id'] == route_id]['route_short_name'].iloc[0] #Routes.objects.filter(route_id = route_id).values('route_short_name').first()['route_short_name']
        concat_name_str = route_short_name + ' - ' + route_long_name
        route_dict = {'route_id': route_id, 'concat_name': concat_name_str }
        routes.append(route_dict)
        # print(route_short_name)

    # print(connection.queries)
    # print(len(routes))
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
    # print(connection.queries)
    return Response(unique_stop_dict) #return the data 




# http://localhost:8000/buses/getEstimateTime/1657181364/7/Mountjoy%20Square/18/
@api_view(['GET'])
def getEstimateTime(request,timestamp,route_short_name,headsign,num_stops):
    # print(timestamp,route_short_name,headsign)
    d = {'WEEKDAY_Monday': [0], 'WEEKDAY_Saturday': [0],'WEEKDAY_Sunday': [0], 'WEEKDAY_Thursday': [0],
            'WEEKDAY_Tuesday': [0], 'WEEKDAY_Wednesday': [0], 'HOUROFDAY_7': [0], 'HOUROFDAY_7': [0],
            'HOUROFDAY_8': [0],'HOUROFDAY_9': [0],'HOUROFDAY_10': [0],'HOUROFDAY_11': [0],'HOUROFDAY_12': [0],
            'HOUROFDAY_13': [0],'HOUROFDAY_14': [0],'HOUROFDAY_15': [0],'HOUROFDAY_16': [0],'HOUROFDAY_17': [0],
            'HOUROFDAY_18': [0],'HOUROFDAY_19': [0],'HOUROFDAY_20': [0],'HOUROFDAY_21': [0],
            'HOUROFDAY_22': [0],'HOUROFDAY_23': [0], 'HOUROFDAY_24': [0],'MONTHOFYEAR_August': [0],
            'MONTHOFYEAR_December': [0],'MONTHOFYEAR_February': [0],'MONTHOFYEAR_January': [0],
            'MONTHOFYEAR_July': [0],'MONTHOFYEAR_June': [0],'MONTHOFYEAR_March': [0],
            'MONTHOFYEAR_May': [0],'MONTHOFYEAR_November': [0],'MONTHOFYEAR_October': [0],
            'MONTHOFYEAR_September': [0],'BANKHOLIDAY_True': [0]}
    df_input = pd.DataFrame(data=d)

    requested_timestamp =  dt.datetime.fromtimestamp(timestamp)
    today_weekday = requested_timestamp.weekday()
    print('requested_timestamp : ',requested_timestamp,' week day : ',today_weekday )
    if today_weekday == 0:
        df_input['WEEKDAY_Monday'][0] = 1
    elif today_weekday == 1:
        df_input['WEEKDAY_Tuesday'][0] = 1
    elif today_weekday == 2:
        df_input['WEEKDAY_Wednesday'][0] = 1
    elif today_weekday == 3:
        df_input['WEEKDAY_Thursday'][0] = 1
    elif today_weekday == 5:
        df_input['WEEKDAY_Saturday'][0] = 1
    elif today_weekday == 6:
        df_input['WEEKDAY_Sunday'][0] = 1

    str_hour_column = 'HOUROFDAY_'+ str(requested_timestamp.hour)

    if str_hour_column in df_input.columns:
        df_input[str_hour_column][0] = 1

    today_month = requested_timestamp.month
    if today_month == 1:
        df_input['MONTHOFYEAR_January'][0] = 1
    elif today_month == 2:
        df_input['MONTHOFYEAR_February'][0] = 1
    elif today_month == 3:
        df_input['MONTHOFYEAR_March'][0] = 1
    elif today_month == 5:
        df_input['MONTHOFYEAR_May'][0] = 1
    elif today_month == 6:
        df_input['MONTHOFYEAR_June'][0] = 1
    elif today_month == 7:
        df_input['MONTHOFYEAR_July'][0] = 1
    elif today_month == 8:
        df_input['MONTHOFYEAR_August'][0] = 1
    elif today_month == 9:
        df_input['MONTHOFYEAR_September'][0] = 1
    elif today_month == 10:
        df_input['MONTHOFYEAR_October'][0] = 1
    elif today_month == 11:
        df_input['MONTHOFYEAR_November'][0] = 1
    elif today_month == 12:
        df_input['MONTHOFYEAR_December'][0] = 1


    route_id = Routes.objects.filter(route_short_name = route_short_name).values('route_id').first()['route_id']
    first_trip_id = Trips.objects.filter(route_id=route_id).values('trip_id').first()['trip_id']
    stops_list = pd.DataFrame(list(StopTimes.objects.filter(trip_id=first_trip_id).values('stop_id')))
    num_stop_total = len(stops_list)
    percentage_of_route = (num_stops / num_stop_total)%100
    print('percentage_of_route',percentage_of_route)

    headsign_arr = headsign.split()
   
    trip_set_both_direction = Trips.objects.filter(route_id=route_id).order_by('trip_headsign').values('trip_headsign','direction_id').distinct() #select all unique trip headsign 

    ## KEEP ### most commun used words in all bus headsigns
    # from collections import Counter
    # trip_set_unique= Trips.objects.order_by('trip_headsign').values('trip_headsign','direction_id').distinct()
    # super_str =''
    # for trip in trip_set_unique.iterator():
    #     super_str += trip['trip_headsign']
    # super_str_arr = super_str.split()
    # Counter = Counter(super_str_arr)
    # most_occur = Counter.most_common(30)
    # print(most_occur)

    redundant_word_list = ['Road','College','Street','Square','Train','Park', 'of', 'Station', 'Avenue','Bus','Dublin' ]

    print('trip_set_both_direction',(trip_set_both_direction))
    # first_headsign = trip_set_both_direction[0]['trip_headsign']
    first_headsign_arr = trip_set_both_direction[0]['trip_headsign'].split(' - ')
    first_headsign_direction = first_headsign_arr[0]
    first_headsign_direction_arr = first_headsign_direction.split()
    
    print('first_headsign_direction_arr :',first_headsign_direction_arr)
    first_headsign_direction_arr_filtered = list(filter(lambda word: word not in redundant_word_list, first_headsign_direction_arr))
    print('first_headsign_direction_arr_filtered :',first_headsign_direction_arr_filtered)
    print('headsign_arr : ',headsign_arr)

    if any(word in headsign_arr for word in first_headsign_direction_arr_filtered):
        direction = trip_set_both_direction[1]['direction_id']
        print('correct direction : ', direction)
    else:
        direction = trip_set_both_direction[0]['direction_id']
        print('not correct direction : ', direction)
    pickle_direction = direction + 1

    pickle_name = 'C:\\Users\\eoin_\\projects\\dublinBus\\' + str(route_short_name) + '_' + str(pickle_direction) + '_model.pkl'

    print(pickle_name)

    pickled_model = pickle.load(open(pickle_name, 'rb'))
    total_time_route = pickled_model.predict(df_input)
    print("total journey time",total_time_route)
    time_num_stops = int(total_time_route * percentage_of_route)
    return Response(time_num_stops)


