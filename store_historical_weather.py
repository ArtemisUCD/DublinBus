from weather import getHistoricalWeather
from sqlalchemy import Column, Date, Integer, String,create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse
import os
from dotenv import load_dotenv

# load environment variable file
load_dotenv()

# load weather data from openweather API
weather_data = getHistoricalWeather()

# Database details from env file
USER = os.environ['MYSQL_USERNAME']
PASSWORD = urllib.parse.quote_plus(os.environ['MYSQL_PASSWORD'])
PORT = os.environ['MYSQL_PORT']
URI= os.environ['MYSQL_URI']
DATABASE =  os.environ['MYSQL_DATABASE']

engine = create_engine(f"mysql+pymysql://{USER}:{PASSWORD}@{URI}:{PORT}/{DATABASE}")
conn = engine.connect()

Base = declarative_base()
class Date(Base):
    __tablename__ = 'historical_weather'

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(String(32), unique=True)
    # main
    temperature = Column(String(32), default="0")
    feelsLike = Column(String(32), default="0")
    pressure = Column(String(32), default="0")
    humidity= Column(String(32), default="0")
    minTemperature=Column(String(32), default="0")
    maxTemperature=Column(String(32), default="0")
    
    wind_speed = Column(String(32), default="0")
    wind_deg = Column(String(32), default="0")
    wind_gust=Column(String(32), default="0")
    
    clouds = Column(String(32), default="0")
    
    weather_id=Column(String(32), default="0")
    weather_main=Column(String(32), default="None")
    weather_description=Column(String(32), default="None")
    weather_icon=Column(String(32), default="None")
    def __str__(self):
        return self.id

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

# set up session to store data
Session = sessionmaker(engine)
db_session = Session()
date_list = weather_data["list"]
for day in date_list:
    date= day["dt"]
    temperature = day["main"]["temp"]
    feelslike = day["main"]["feels_like"]
    pressure = day["main"]["pressure"]
    humidity = day["main"]["humidity"]
    temp_min = day["main"]["temp_min"]
    temp_max = day["main"]["temp_max"]
    
    wind_speed = day["wind"]["speed"]
    wind_deg = day["wind"]["deg"]
    wind_gust = day["wind"]["gust"]
    
    clouds = day["clouds"]["all"]
    
    weather_id = day["weather"][0]["id"]
    weather_main = day["weather"][0]["main"]
    weather_description = day["weather"][0]["description"]
    weather_icon = day["weather"][0]["icon"]

    
    row = Date(
    date = date,
    temperature = temperature,
    feelsLike = feelslike,
    pressure = pressure,
    humidity= humidity,
    minTemperature=temp_min,
    maxTemperature=temp_max,
    wind_speed = wind_speed,
    wind_deg = wind_deg,
    wind_gust=wind_gust,
    clouds = clouds,
    weather_id=weather_id,
    weather_main=weather_main,
    weather_description=weather_description,
    weather_icon=weather_icon,
    )

    # add row to session to be committed at end of dataset
    db_session.add(row)
db_session.commit() # commit dataset when all entries have been parsed
conn.close()

