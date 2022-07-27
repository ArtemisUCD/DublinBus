from django.test import SimpleTestCase, Client
from django.urls import reverse, resolve
from buses.views import getShape, getStopsForRoute, getUpdatesForStop, getBusRouteList,getBusStopList, getEstimateTime, getEstimateTime

class testUrls(SimpleTestCase):
    # https://www.youtube.com/watch?v=0MrgsYswT1c
    def setUp(self):
        self.test_str = 'test_str'
        self.test_int = '999'
        # self.route_id = '60-1-b12-1'
        # self.stop_id = '8220DB000002'
        # self.timestamp = '1657181364'
        # self.route_short_name = '7'
        # self.headsign = 'Mountjoy'
        # self.num_stops = '18'
        # self.weather_icon_num = '10'


    def test_getShape_url_is_resolved(self):
        url = reverse('getShape',args=[self.test_str])
        self.assertEquals(resolve(url).func,getShape)

    def test_getStopsForRoute_url_is_resolved(self):
        url = reverse('getStopsForRoute',args=[self.test_str])
        self.assertEquals(resolve(url).func,getStopsForRoute)

    def test_getUpdatesForStop_url_is_resolved(self):
        url = reverse('getUpdatesForStop',args=[self.test_str])
        self.assertEquals(resolve(url).func,getUpdatesForStop)

    def test_getBusRouteList_url_is_resolved(self):
        url = reverse('getBusRouteList')
        self.assertEquals(resolve(url).func,getBusRouteList)

    def test_getBusStopList_url_is_resolved(self):
        url = reverse('getBusStopList')
        self.assertEquals(resolve(url).func,getBusStopList)
    
    def test_getEstimateTime_url_is_resolved(self):
        url = reverse('getEstimateTime',args=[self.test_int,self.test_str,self.test_str,self.test_int,self.test_int])
        self.assertEquals(resolve(url).func,getEstimateTime)
