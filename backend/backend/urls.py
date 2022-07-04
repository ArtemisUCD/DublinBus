"""dublinBusDjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from buses import views

router = routers.DefaultRouter()
router.register(r'stop_', views.StopsView, 'stop')
router.register(r'forecast', views.WeatherView, 'weather_forecast')
# router.register(r'busesUpdates', views.BusesUpdatesView, 'busesUpdates')
# router.register(r'StopForRoute', views.StopForRouteView, 'StopForRoute')
# router.register(r'get', views.getShape, basename='MyModel')

# ListCreateAPIView.as_view(queryset=User.objects.all(), serializer_class=UserSerializer), name='user-list')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('buses/', include('buses.urls')),
    path('api/', include(router.urls)),
   # path('',include('buses.urls'))
    # path('api/trips', views.TripsSerializer.as_view()),
]
