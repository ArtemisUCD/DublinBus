from django.db import models

# Create your models here.
class date(models.Model):
    date = models.CharField(max_length=32, unique=True, default="0")
    temperature = models.CharField(max_length=32, default="0")
    feelsLike=models.CharField(max_length=32, default="0")
    pressure=models.CharField(max_length=32, default="0")
    humidity=models.CharField(max_length=32, default="0")
    minTemperature=models.CharField(max_length=32, default="0")
    maxTemperature=models.CharField(max_length=32, default="0")
    wind_speed=models.CharField(max_length=32, default="0")
    wind_deg=models.CharField(max_length=32, default="0")
    wind_gust=models.CharField(max_length=32, default="0")
    clouds=models.CharField(max_length=32, default="0")
    weather_id=models.CharField(max_length=32, default="0")
    weather_main=models.CharField(max_length=32, default="None")
    weather_description=models.CharField(max_length=32, default="None")
    weather_icon=models.CharField(max_length=32, default="None")
