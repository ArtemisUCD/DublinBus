import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Float, DateTime
import os


meta = MetaData()

db_password = os.environ['DUBLIN_BUS_PASSWORD']
db_location = os.environ['DUBLIN_BUS_ENDPOINT']
engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
dbConnection = engine.connect()


n=10000 #num of rows
reader = pd.read_csv('stops.txt',chunksize=n)


#create the table with correct datatype
stops = Table(
   'stops', meta, 
   Column('stop_id',String(20),primary_key = True , autoincrement=False),
   Column('stop_name', String(40)), 
   Column('stop_lat', Float ), 
   Column('stop_lon', Float )
)

try: 
    meta.create_all(engine,checkfirst=False) #create the table if does not exist, if error then no appending 
    
    for chunk in reader:
        chunk.to_sql('stops', dbConnection, if_exists='append',index=False) #insert the data in the table 

except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()
     
     
     