from weather import getHourlyWeather
from sqlalchemy import Column, Date, Integer, String,create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse
from datetime import datetime
import sys
import os
from dotenv import load_dotenv
import time

# load environment variable file
load_dotenv()

while True :
    print('start store_hourly_weather.py')

    # load weather data from openweather API
    weather_data = getHourlyWeather()

    # print(weather_data)

    # Database details from env file
    ###########################
    # for windows
    f=open("keys.txt","r")
    lines=f.read().splitlines()
    USER = lines[0]
    PASSWORD = lines[1]
    PORT = lines[2]
    URI= lines[3]
    DATABASE =  lines[4]
    f.close()

    # USER = os.environ['MYSQL_USERNAME']
    # PASSWORD = urllib.parse.quote_plus(os.environ['DUBLIN_BUS_PASSWORD'])
    # PORT = os.environ['MYSQL_PORT']
    # URI= os.environ['DUBLIN_BUS_ENDPOINT']
    # DATABASE =  os.environ['MYSQL_DATABASE']

    engine = create_engine(f"mysql+pymysql://{USER}:{PASSWORD}@{URI}:{PORT}/{DATABASE}")
    conn = engine.connect()

    Base = declarative_base()
    class Date(Base):
        __tablename__ = 'hourly_weather'
        id = Column(Integer, primary_key=True, autoincrement=True)
        date = Column(String(32), primary_key=True, unique=True)
        temperature = Column(String(32), default="0")
        uvi = Column(String(32), default="0")
        humidity = Column(String(32), default="0")
        wind = Column(String(32), default="0")
        def __str__(self):
            return self.id

    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    # set up session to store data
    Session = sessionmaker(engine)
    db_session = Session()
    date_list = weather_data["hourly"]
    for hour in date_list:
        date = hour["dt"]
        temperature = hour["temp"]
        uvi = hour["uvi"]
        humidity = hour["humidity"]
        wind = hour["wind_speed"]
        

        row = Date(
        id=id,
        date = date,
        temperature = temperature,
        uvi = uvi,
        humidity = humidity,
        wind = wind,
        )

        # add row to session to be committed at end of dataset
        db_session.add(row)
    db_session.commit() # commit dataset when all entries have been parsed
    conn.close()
    print('finish store_hourly_weather.py && sleep for 1 hour ')
    time.sleep(3600) #1hour
