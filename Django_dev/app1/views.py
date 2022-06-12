from django.shortcuts import render, HttpResponse, redirect
import time
# Create your views here.

from app1.models import date

def weather(request):
    date_list = date.objects.all()
    dict_now = dict()
    for d in date_list:
        dict_now[f"date{d.id}"] = d
    return render(request, "weather.html", dict_now)

def login(request):

    if request.method == "GET":
        return render(request, "login.html", {"go": 0})
    else:
        content = request.POST
        if content["account"] == "admin" and content["password"] == "12345":
            time.sleep(1)
            return redirect("index/")
        else:
            return render(request, "login.html", {"go": 1})

def index(request):
    return render(request, "index.html")

def weather(request):
    all_dates = date.objects.all()
    return render(request, "weather.html", {'dates': all_dates})
