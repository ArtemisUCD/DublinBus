from weather import getDailyWeather
from sqlalchemy import Column, Date, Integer, String,create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse
from datetime import datetime
import sys
import os
from dotenv import load_dotenv
import time


while True :
    # load environment variable file
    load_dotenv()

    # load weather data from openweather API
    weather_data = getDailyWeather()

    # Database details from env file
   ###########################
    # for windows
    USER = os.environ['MYSQL_USERNAME']
    PASSWORD =(os.environ['DUBLIN_BUS_PASSWORD'])
    PORT = os.environ['MYSQL_PORT']
    URI= os.environ['DUBLIN_BUS_ENDPOINT']
    DATABASE =  os.environ['MYSQL_DATABASE']

    #USER = os.getenv['MYSQL_USERNAME']
    #PASSWORD = urllib.parse.quote_plus(os.getenv['DUBLIN_BUS_PASSWORD'])
    #PORT = os.getenv['MYSQL_PORT']
    #URI= os.getenv['DUBLIN_BUS_ENDPOINT']
    #DATABASE =  os.getenv['MYSQL_DATABASE']


    engine = create_engine(f"mysql+pymysql://{USER}:{PASSWORD}@{URI}:{PORT}/{DATABASE}")
    conn = engine.connect()

    Base = declarative_base()
    class Date(Base):
        __tablename__ = 'daily_weather'
        id = Column(Integer, primary_key=True, autoincrement=True)
        date = Column(String(32), primary_key=True, unique=True)
        temperature = Column(String(32), default="0")
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
        date = datetime.fromtimestamp(day["dt"]).strftime("%A")
        temperature = day["temp"]["day"]
        weather_icon = day["weather"][0]["icon"]

        row = Date(
        id=id,
        date = date,
        temperature = temperature,
        weather_icon=weather_icon,
        )

        # add row to session to be committed at end of dataset
        db_session.add(row)
    db_session.commit() # commit dataset when all entries have been parsed
    conn.close()

    time.sleep(43200) # 12 hours


