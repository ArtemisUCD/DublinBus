import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Float, DateTime
import os


meta = MetaData()

db_password = os.environ['DUBLIN_BUS_PASSWORD']
db_location = os.environ['DUBLIN_BUS_ENDPOINT']
engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
dbConnection = engine.connect()


n=10000 #num of rows
reader = pd.read_csv(r"C:\Users\elisebrard\Downloads\google_transit_dublinbus (1)\trips.txt",chunksize=n)


#create the table with correct datatype
transfers = Table(
   'trips', meta, 
#     Column('id',Integer, ),
    Column('route_id',String(20) ),
    Column('service_id',String(5)),
    Column('trip_id', String(50),primary_key = True,autoincrement=False), 
    Column('shape_id', String(20) ), 
    Column('trip_headsign', String(100) ),
    Column('direction_id', Boolean )
)

try: 
    meta.create_all(engine,checkfirst=False) #create the table if does not exist, if error then no appending 
    
    for chunk in reader:
        chunk.to_sql('trips', dbConnection, if_exists='append',index=False) #insert the data in the table 

except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()
     
     
     