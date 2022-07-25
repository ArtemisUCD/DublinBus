from rest_framework import serializers
from .models import Stops, DailyWeather,BusesUpdates, Trips, StopTimes, Shapes,Routes, HourlyWeather

class StopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stops
        fields = ('stop_id', 'stop_name', 'stop_lat', 'stop_lon')

class WeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWeather
        fields = ('date', 'temperature', 'weather_icon')

class HourlyWeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = HourlyWeather
        fields = ('date', 'temperature', 'uvi', 'humidity', 'wind')

class BusesUpdatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusesUpdates
        fields = ('id',  'timestamp' ,   'trip_id', 'route_id', 'start_time' , 'start_date', 'schedule_relationship' , 
            'is_deleted' ,  'stop_sequence' , 'stop_id' , 'arrival_delay' , 'arrival_time' , 'departure_delay' ,'departure_time' )

class TripsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trips
        fields = ('route' ,'service','trip_id' ,  'shape_id' ,  'trip_headsign' , 'direction_id'  )
 
class StopTimesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StopTimes
        fields = ('trip_id' ,  'arrival_time' , 'departure_time' , 'stop', 'stop_sequence' , 'stop_headsign',  'pickup_type', 'drop_off_type','shape_dist_traveled' )
      #  fields = '__all__' #other way to do it 


class ShapesSerializer(serializers.ModelSerializer): 
    class Meta:
            model = Shapes
            fields = ( 'shape_id' , 'shape_pt_lat' , 'shape_pt_lon',  'shape_pt_sequence',  'shape_dist_traveled')

   

class RoutesSerializer(serializers.ModelSerializer): 
    class Meta:
            model = Routes
            fields = '__all__'

   
class RouteNameConcatSerializer(object):
    def __init__(self, email, content, created=None):
        self.email = email
        self.content = content
      