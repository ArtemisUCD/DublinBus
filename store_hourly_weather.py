from weather import getHourlyWeather
from sqlalchemy import Column, Date, Integer, String,create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse
from datetime import datetime
import os
from dotenv import load_dotenv

# load environment variable file
load_dotenv()

# load weather data from openweather API
weather_data = getHourlyWeather()

print(weather_data)

# Database details from env file

PASSWORD = 'dublinBus55!'
URI= 'dublinbus.cgaizveb7ftf.us-east-1.rds.amazonaws.com'

engine = create_engine(f"mysql+pymysql://admin:{PASSWORD}@{URI}:3306/artemis")
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
