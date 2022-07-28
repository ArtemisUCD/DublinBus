import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Float, DateTime
import os


meta = MetaData()

db_password = os.environ['DUBLIN_BUS_PASSWORD']
db_location = os.environ['DUBLIN_BUS_ENDPOINT']
engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
dbConnection = engine.connect()


n=10000 #num of rows
reader = pd.read_csv(r"C:\Users\elisebrard\Downloads\google_transit_dublinbus (1)\stop_times.txt",chunksize=n)


#create the table with correct datatype
stop_times = Table(
   'stop_times', meta, 
   Column('id',Integer,primary_key = True ),
   Column('trip_id', String(50)), 
   Column('arrival_time', String(40) ), 
   Column('departure_time', String(40) ), 
   Column('stop_id', String(20) ),
   Column('stop_sequence', Integer ),
   Column('stop_headsign', String(50) ), 
   Column('pickup_type', Boolean ),
   Column('drop_off_type', Boolean ),
   Column('shape_dist_traveled', Float )
)

try: 
    meta.create_all(engine,checkfirst=False) #create the table if does not exist, if error then no appending 
    
    for chunk in reader:
        chunk.to_sql('stop_times', dbConnection, if_exists='append',index=False) #insert the data in the table 

except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()
     
     
     