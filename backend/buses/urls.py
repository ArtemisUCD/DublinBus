from django.urls import path

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    # # path('', views.detail, name='detail'),
    # # # ex: /polls/5/results/
    # path('<int:id_route>/routes/', views.routes, name='routes'),
    # # ex: /polls/5/vote/
    # path('<int:id_stop>/stops/', views.stops, name='stops'), #carful the name of the variable is important !! same as in views argument
    path('getShape',views.getShape),
]