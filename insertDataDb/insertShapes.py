
import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float
import os

meta = MetaData()

db_password = os.environ['DUBLIN_BUS_PASSWORD']
db_location = os.environ['DUBLIN_BUS_ENDPOINT']
engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
dbConnection = engine.connect()

n=10000
reader = pd.read_csv('shapes.txt',chunksize=n)


#create the table with correct datatype
shapes = Table(
   'shapes', meta, 
   Column('id',Integer,primary_key = True ),
   Column('shape_id', String(20)), 
   Column('shape_pt_lat', Float ), 
   Column('shape_pt_lon', Float ), 
   Column('shape_pt_sequence', Integer ),
   Column('shape_dist_traveled', Float )
)

try: 
    meta.create_all(engine,checkfirst=False) #create the table if does not exist, if error then no appending 
 
    for chunk in reader:
        chunk.to_sql('shapes', dbConnection, if_exists='append',index=False) #insert the data in the table 
 
except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()
     
     
     