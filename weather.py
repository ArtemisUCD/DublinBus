import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()
f=open("/home/student/keys.txt","r")
lines=f.read().splitlines()
api_key = lines[6]
f.close()
# function to return historical weather data for Dublin
def getHistoricalWeather():
    datapointCount = 10
    url = f"http://history.openweathermap.org/data/2.5/history/city?lat=53.3037&lon=-6.2324&type=hour&cnt={datapointCount}&appid={api_key}"
    r = requests.get(url) 
    json_data = json.loads(r.text)
    return json_data

def getDailyWeather():
    datapointCount = 7
    url = f"http://api.openweathermap.org/data/2.5/forecast/daily?lat=53.303&lon=-6.232&cnt={datapointCount}&appid={api_key}&units=metric"
    r = requests.get(url) 
    json_data = json.loads(r.text)
    return json_data

def getHourlyWeather():
    datapointCount = 48
    hourly_api_key = '2cdffb9226f70e5762693a143d32a0f0'
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat=53.3434&lon=-6.26761&exclude=minutely,daily,minutely,alerts,current&appid={hourly_api_key}"
    r = requests.get(url) 
    json_data = json.loads(r.text)
    return json_data

