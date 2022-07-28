import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean
import os

meta = MetaData()

db_password = os.environ['DUBLIN_BUS_PASSWORD']
db_location = os.environ['DUBLIN_BUS_ENDPOINT']
engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
dbConnection = engine.connect()

df = pd.read_csv(r"C:\Users\elisebrard\Downloads\google_transit_dublinbus (1)\calendar_dates.txt")

#create the table with correct datatype
calendar_dates = Table(
   'calendar_dates', meta, 
   Column('service_id', String(20)), 
   Column('date', Integer, primary_key = True, autoincrement=False ), 
   Column('exception_type', Integer )
)

try: 
     meta.create_all(engine,checkfirst=False) #create the table if doesnot exist 
     df.to_sql('calendar_dates', dbConnection, if_exists='append',index=False) #insert the data in the table 

except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()