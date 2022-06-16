from rest_framework import serializers
from .models import Stops, DailyWeather

class StopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stops
        fields = ('stop_id', 'stop_name', 'stop_lat', 'stop_lon')

class WeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWeather
        fields = ('date', 'temperature', 'weather_icon')

