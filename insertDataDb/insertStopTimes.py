import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Float, DateTime
import os


meta = MetaData()

db_password = os.environ['LOCAL_DB_PASSWORD']
engine = create_engine('mysql+mysqlconnector://root:'+db_password+'@localhost:3306/artemis')
dbConnection = engine.connect()

df = pd.read_csv('stop_times.txt')

n=10000 #num of rows
reader = pd.read_csv('stop_times.txt',chunksize=n)


#create the table with correct datatype
stop_times = Table(
   'stop_times', meta, 
   Column('id',Integer,primary_key = True ),
   Column('trip_id', String(40)), 
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
     
     
     