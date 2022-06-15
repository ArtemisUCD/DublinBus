import requests
import json

# function to return historical weather data for Dublin
def getHistoricalWeather():
    with open("weatherKey.txt","r") as f:
        for line in f:
            api_key = line.split(None, 1)[0]

    datapointCount = 10
    url = f"http://history.openweathermap.org/data/2.5/history/city?lat=53.3498&lon=6.2603&type=hour&cnt={datapointCount}&appid={api_key}"

    r = requests.get(url) 
    json_data = json.loads(r.text)
    return json_data
