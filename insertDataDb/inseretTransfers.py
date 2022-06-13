import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Float, DateTime
import os


meta = MetaData()

db_password = os.environ['LOCAL_DB_PASSWORD']
engine = create_engine('mysql+mysqlconnector://root:'+db_password+'@localhost:3306/artemis')
dbConnection = engine.connect()


n=10000 #num of rows
reader = pd.read_csv('transfers.txt',chunksize=n)


#create the table with correct datatype
transfers = Table(
   'transfers', meta, 
    Column('id',Integer,primary_key = True ),
    Column('from_stop_id',String(20)),
    Column('to_stop_id', String(20)), 
    Column('transfer_type', Integer ), 
    Column('min_transfer_time', Integer )
)

try: 
    meta.create_all(engine,checkfirst=False) #create the table if does not exist, if error then no appending 
    
    for chunk in reader:
        chunk.to_sql('transfers', dbConnection, if_exists='append',index=False) #insert the data in the table 

except ValueError as vx:
     print(vx)

except Exception as ex:   
     print(ex)

else:
     print("Table created and completed successfully.")

finally:
     dbConnection.close()
     
     
     