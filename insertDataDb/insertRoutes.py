import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean
import os
import numpy as np

meta = MetaData()

db_password = os.environ['DUBLIN_BUS_PASSWORD']
db_location = os.environ['DUBLIN_BUS_ENDPOINT']
engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
dbConnection = engine.connect()

df = pd.read_csv('routes.txt')
#df1,df2,df3,df4,df5,df6,df7,df8,df9,df10,df11,df12 = np.array_split(df, 12)

#create the table with correct datatype
routes = Table(
   'routes', meta, 
   Column('route_id', String(20), primary_key = True, autoincrement=False), 
   Column('agency_id', Integer ), 
   Column('route_short_name', String(6) ),
   Column('route_long_name', String(40) ),
   Column('route_type', Integer )
)

try: 
     meta.create_all(engine,checkfirst=False) #create the table if does not exist, if error then no appending  
     df.to_sql('routes', dbConnection, if_exists='append',index=False) #insert the data in the table 

except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()
     
     
     