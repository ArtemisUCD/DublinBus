from django.http import HttpResponse
from django.shortcuts import render

from .models import Stops, DailyWeather, BusesUpdates, Trips, StopTimes, Shapes, Routes,HourlyWeather
from rest_framework import viewsets
from .serializers import StopsSerializer, WeatherForecastSerializer, HourlyWeatherForecastSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view
import pandas as pd
import datetime as dt
from django.db.models import F
import pickle
import datetime as dt
import holidays


class StopsView(viewsets.ModelViewSet):
    serializer_class = StopsSerializer
    queryset = Stops.objects.all()


class WeatherView(viewsets.ModelViewSet):
    serializer_class = WeatherForecastSerializer
    queryset = DailyWeather.objects.all()

class HourlyWeatherView(viewsets.ModelViewSet):
    serializer_class = HourlyWeatherForecastSerializer
    queryset = HourlyWeather.objects.all()


@api_view(['GET'])
def getUpdatesForStop(request,stop_id_requested):
    # route_id_selected = '60-46A-b12-1' # harcoded trips 
    # stop_id_selected = '8220DB000326' 
    df_trips = pd.DataFrame(list(Trips.objects.all().values()))
    df_route = pd.DataFrame(list(Routes.objects.all().values()))

    if stop_id_requested is not None:
        update_set = BusesUpdates.objects.filter(stop_id=stop_id_requested)     
   
    all_next_buses = []

    for stop in update_set.iterator():
        current_trip_id = stop.trip_id
        current_trip  = df_trips[df_trips['trip_id'] == current_trip_id].iloc[0] #trips_set.filter(trip_id=current_trip_id)
        current_trip_headsign = current_trip['trip_headsign']
        current_route_id = stop.route_id
        current_route = df_route[df_route['route_id'] == current_route_id].iloc[0] #Routes.objects.filter(route_id=stop.route_id).first()
        current_route_num = current_route['route_short_name']
        current_stop_time = StopTimes.objects.filter(trip_id=current_trip_id, stop_sequence=stop.stop_sequence ).values('trip_id','stop_sequence','arrival_time').first()
        planned_arrival_time = current_stop_time['arrival_time']
        estimated_arrival_delay = stop.arrival_delay
        
        if estimated_arrival_delay != -1 :
            estimated_arrival_delay_min = int(estimated_arrival_delay/60)
        else :
            estimated_arrival_delay_min = 0
        
        separator = ":"
        arr_planned = planned_arrival_time.split(separator)
        time_planned_min = int(arr_planned[0])*60 + int(arr_planned[1])
        time_delayed_min = time_planned_min + estimated_arrival_delay_min

        estimated_arrival_time='{:02d}:{:02d}'.format(*divmod(time_delayed_min, 60))

        concat_name = current_route_num + " - " + current_trip_headsign
    
        planned_arrival_time = separator.join(arr_planned[:2])

        if estimated_arrival_delay_min == 0 :
            concat_delay = 'On time'
        elif estimated_arrival_delay_min < 0 : 
            concat_delay = str(abs(estimated_arrival_delay_min)) + ' min early'
        else:
            concat_delay = str(abs(estimated_arrival_delay_min)) + ' min late'

        current_dict = {'concat_name':concat_name, 'planned_arrival_time':planned_arrival_time,'estimated_arrival_delay_min':concat_delay ,
                            'estimated_arrival_time'  : estimated_arrival_time , 'time_planned_min':time_planned_min}
        all_next_buses.append(current_dict)  

    all_next_buses = sorted(all_next_buses, key=lambda d: d['time_planned_min']) 
    # print(connection.queries)
    return Response(all_next_buses) #return the data 


@api_view(['GET'])
def getShape(request, route_id_requested):
    trips_set = Trips.objects.all()

    if route_id_requested is not None:
        trips_set = trips_set.filter(route=route_id_requested)
        first_trip = trips_set.first()
        first_trip_id = first_trip.shape_id

    bus_route_shape = []
    bus_route_shape = Shapes.objects.filter(shape_id=first_trip_id).annotate(lat=F('shape_pt_lat'),lng=F('shape_pt_lon')).values('lat','lng')

    return Response(bus_route_shape) #return the data 


@api_view(['GET'])
def getStopsForRoute(request, route_id_requested):
    
    # incase need to split the string !! just change name argument var to route_var_requested
    ###################################
    # string_list = route_id_requested.split()
    # route_set =  Routes.objects.filter(route_short_name=string_list[0])
    # route_id_requested = route_set.first().route_id
    # print(route_id_requested)
    ###################################
    
    df_trips = pd.DataFrame(list(Trips.objects.all().values('route','trip_id')))

    if route_id_requested is not None:
        first_trip_id = df_trips[df_trips['route'] == route_id_requested]['trip_id'].iloc[0]
      
    bus_route_stops_times = pd.DataFrame(list(StopTimes.objects.filter(trip_id=first_trip_id).values('stop_id')))#all stops on a route 

    bus_route_stops = []
    df_stop = pd.DataFrame(list(Stops.objects.all().values()))

    for stop in bus_route_stops_times.iterrows():
        current_stop_id = stop[1]['stop_id']
        current_stop = df_stop[df_stop['stop_id'] == current_stop_id].iloc[0]
        bus_route_stops.append(current_stop.to_dict())

    # print(connection.queries)
    return Response(bus_route_stops) #return the data 


@api_view(['GET'])
def getBusRouteList(request):
    df_trips = pd.DataFrame(list(Trips.objects.all().values('trip_headsign','route_id')))
    df_route = pd.DataFrame(list(Routes.objects.all().values('route_id','route_short_name')))
    
    trip_set_unique_headsign = Trips.objects.order_by('trip_headsign').values('trip_headsign').distinct() #select all unique trip headsign 

    routes = []
    for trip in trip_set_unique_headsign.iterator():
        route_long_name = trip['trip_headsign']
        route_id = df_trips[df_trips['trip_headsign'] == route_long_name]['route_id'].iloc[0] #Trips.objects.filter(trip_headsign = route_long_name).values('route_id').first()['route_id']
        route_short_name =  df_route[df_route['route_id'] == route_id]['route_short_name'].iloc[0] #Routes.objects.filter(route_id = route_id).values('route_short_name').first()['route_short_name']
        concat_name_str = route_short_name + ' - ' + route_long_name
        route_dict = {'route_id': route_id, 'concat_name': concat_name_str }
        routes.append(route_dict)

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
def getEstimateTime(request,timestamp,route_short_name,headsign,num_stops,weather_icon_num):
    # print(timestamp,route_short_name,headsign)

    # WHAT ABOUT BANKHOLIDAY !!??

    d = {'WEEKDAY_Monday': [0], 'WEEKDAY_Saturday': [0],'WEEKDAY_Sunday': [0], 'WEEKDAY_Thursday': [0],
            'WEEKDAY_Tuesday': [0], 'WEEKDAY_Wednesday': [0], 'HOUROFDAY_7': [0], 'HOUROFDAY_7': [0],
            'HOUROFDAY_8': [0],'HOUROFDAY_9': [0],'HOUROFDAY_10': [0],'HOUROFDAY_11': [0],'HOUROFDAY_12': [0],
            'HOUROFDAY_13': [0],'HOUROFDAY_14': [0],'HOUROFDAY_15': [0],'HOUROFDAY_16': [0],'HOUROFDAY_17': [0],
            'HOUROFDAY_18': [0],'HOUROFDAY_19': [0],'HOUROFDAY_20': [0],'HOUROFDAY_21': [0],
            'HOUROFDAY_22': [0],'HOUROFDAY_23': [0], 'HOUROFDAY_24': [0],'MONTHOFYEAR_August': [0],
            'MONTHOFYEAR_December': [0],'MONTHOFYEAR_February': [0],'MONTHOFYEAR_January': [0],
            'MONTHOFYEAR_July': [0],'MONTHOFYEAR_June': [0],'MONTHOFYEAR_March': [0],
            'MONTHOFYEAR_May': [0],'MONTHOFYEAR_November': [0],'MONTHOFYEAR_October': [0],
            'MONTHOFYEAR_September': [0],'BANKHOLIDAY_True': [0],'weather_icon_02' : [0],'weather_icon_03' : [0],
            'weather_icon_04' : [0],'weather_icon_09' : [0],'weather_icon_10' : [0],'weather_icon_11' : [0],
            'weather_icon_13' : [0],'weather_icon_50' : [0]}
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

    irish_holidays = holidays.Ireland()
    requested_timestamp_str = requested_timestamp.strftime("%d-%m-%Y")

    if requested_timestamp_str in irish_holidays:
        df_input['BANKHOLIDAY_True'][0] = 1

    if weather_icon_num <= 9 :
        str_weather_column = 'weather_icon_0'+ str(weather_icon_num)
    else:
        str_weather_column = 'weather_icon_'+ str(weather_icon_num)

    if str_weather_column in df_input.columns:
        df_input[str_weather_column][0] = 1
        print('ok changed')

    
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


