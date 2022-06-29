from rest_framework import serializers
from .models import Stops, DailyWeather,BusesUpdates

class StopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stops
        fields = ('stop_id', 'stop_name', 'stop_lat', 'stop_lon')

class WeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWeather
        fields = ('date', 'temperature', 'weather_icon')




class BusesUpdatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusesUpdates
        fields = ('id',  'timestamp' ,   'trip_id', 'route_id', 'start_time' , 'start_date', 'schedule_relationship' , 
            'is_deleted' ,  'stop_sequence' , 'stop_id' , 'arrival_delay' , 'arrival_time' , 'departure_delay' ,'departure_time' )

            