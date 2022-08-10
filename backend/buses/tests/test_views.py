from django.test import TestCase, Client
from django.urls import reverse
from buses.urls import urlpatterns 
from buses.models import Stops, DailyWeather, BusesUpdates, Trips, StopTimes, Shapes, Routes,HourlyWeather 
from buses.views import getShape, getStopsForRoute, getUpdatesForStop, getBusRouteList,getBusStopList, getEstimateTime, getEstimateTime

import json

class testViews(TestCase):

    def setUp(self):
        # self.client = Client()
        self.stop1 = Stops.objects.create(stop_id = "rr",stop_name = "ff",stop_lat = "22",stop_lon = "22")

    def test_getBusStopList_GET(self):
        response = self.client.get('/buses/getBusStopList/')
        # print(getBusStopList('request'))
        self.assertEqual(response.status_code, 200)
        
