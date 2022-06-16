import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ['WEATHER_API_KEY']
# function to return historical weather data for Dublin
def getHistoricalWeather():
    datapointCount = 10
    url = f"http://history.openweathermap.org/data/2.5/history/city?lat=53.3037&lon=-6.2324&type=hour&cnt={datapointCount}&appid={api_key}"
    r = requests.get(url) 
    json_data = json.loads(r.text)
    return json_data

def getDailyWeather():
    datapointCount = 7
    url = f"http://api.openweathermap.org/data/2.5/forecast/daily?lat=53.303&lon=-6.232&cnt={datapointCount}&appid={api_key}"
    r = requests.get(url) 
    json_data = json.loads(r.text)
    return json_data

