import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean,TIMESTAMP
from sqlalchemy.sql import select
import urllib.request, json
import os
import warnings
import time

warnings.simplefilter(action='ignore', category=FutureWarning) # hide all warnings from panda future updates !

while True :

    db_password = os.environ['DUBLIN_BUS_PASSWORD']
    db_location = os.environ['DUBLIN_BUS_ENDPOINT']

    engine = create_engine('mysql+mysqlconnector://admin:'+db_password+'@'+db_location+':3306/artemis')
    dbConnection = engine.connect()


    metadata = MetaData(dbConnection)

    trips = Table('trips', metadata, autoload_with=engine)

    s = select([trips.c.trip_id]) # c to say it's a colun 
    result = dbConnection.execute(s)

    trip_id_list = [r for r, in result]
    print(len(trip_id_list))

    api_key = os.environ['GTFSR_API_KEY']

    try:
        url = "https://api.nationaltransport.ie/gtfsr/v1?format=json"

        hdr ={
        # Request headers
        'Cache-Control': 'no-cache',
        'x-api-key' : api_key,
        }

        req = urllib.request.Request(url, headers=hdr)

        req.get_method = lambda: 'GET'
        response = urllib.request.urlopen(req)
        print(response.getcode())#make it is ok, if 200 no problem
        response_string = response.read().decode("utf-8")
        response_json = json.loads(response_string)
        # with open('json_data.json', 'w') as outfile:
        #     json.dump(response_json, outfile)
        # print(response.read())
        # with open('json_data.json') as json_file:
        #     response_json = json.load(json_file)
        index= 0
        Timestamp = response_json['Header']['Timestamp']
        
        
        df_buses_updates = pd.DataFrame(columns=['id','timestamp','trip_id','route_id','start_time',
                                    'start_date','schedule_relationship','is_deleted',
                                    'stop_sequence','stop_id','arrival_delay','arrival_time',
                                    'departure_delay','departure_time'])
        print('len',len(response_json['Entity']))
        for bus in response_json['Entity']:   #goes trhough all the different trips 
            
            #save all the value specific to the trip
            current_trip = bus['TripUpdate']['Trip']
            TripId = current_trip['TripId']
            # print(TripId,'\n\n')
            if TripId in trip_id_list : #check if trip is dublin bus 
                print(TripId,'\n\n')
                RouteId = current_trip['RouteId']
                StartTime = current_trip['StartTime']
                StartDate = current_trip['StartDate']
                ScheduleRelationship = current_trip['ScheduleRelationship']
                IsDeleted = bus['IsDeleted']

                if ScheduleRelationship=='Canceled':
                    StopSequence, StopId, ArrivalDelay,DepartureDelay, ArrivalTime,DepartureTime,ScheduleRelationship = -1,-1,-1,-1,-1,-1,-1
                    index += 1
                    df_buses_updates = df_buses_updates.append({'id':index,'timestamp':Timestamp,'trip_id':TripId,'route_id':RouteId,'start_time':StartTime,
                                        'start_date':StartDate,'schedule_relationship':ScheduleRelationship,'is_deleted':IsDeleted,
                                        'stop_sequence':StopSequence,'stop_id':StopId,'arrival_delay':ArrivalDelay, 'arrival_time':ArrivalTime,
                                        'departure_delay':DepartureDelay,'departure_time':DepartureTime}, ignore_index=True )

                    print('readyto aooen IF')

                else:
                    current_bus = bus['TripUpdate']['StopTimeUpdate']
                    for update in current_bus:
                        StopSequence = update['StopSequence']
                        StopId = update['StopId']
                        keys = update.keys()
                        if 'Arrival' in keys:
                            keys2 = update['Arrival'].keys()
                            if 'Delay' in keys2:
                                ArrivalDelay = update['Arrival']['Delay']
                            else:
                                ArrivalDelay = -1
                            if 'Time' in keys2:
                                ArrivalTime = update['Arrival']['Time']
                            else:
                                ArrivalTime = -1
                        else:
                            ArrivalDelay = -1
                            ArrivalTime = -1

                        if 'Departure' in keys:
                            keys3 = update['Departure'].keys()
                            if 'Delay' in keys3:
                                DepartureDelay = update['Departure']['Delay']
                            else:
                                DepartureDelay = -1
                            if 'Time' in keys3:
                                DepartureTime = update['Departure']['Time']
                            else:
                                DepartureTime = -1
                            
                        else:
                            DepartureDelay = -1
                            DepartureTime = -1


                        #append row to dataframe
                        # new_row = pd.DataFrame({'Timestamp':Timestamp,'TripId':TripId,'RouteId':RouteId,'StartTime':StartTime,
                        #                 'StartDate':StartDate,'ScheduleRelationship':ScheduleRelationship,'IsDeleted':IsDeleted,
                        #                 'StopSequence':StopSequence,'StopId':StopId,'ArrivalDelay':ArrivalDelay,
                        #                 'DepartureDelay':DepartureDelay})
                        #print[new_row]
                        index += 1
                        print('readyto aooen')
                        df_buses_updates = df_buses_updates.append({'id':index,'timestamp':Timestamp,'trip_id':TripId,'route_id':RouteId,'start_time':StartTime,
                                        'start_date':StartDate,'schedule_relationship':ScheduleRelationship,'is_deleted':IsDeleted,
                                        'stop_sequence':StopSequence,'stop_id':StopId,'arrival_delay':ArrivalDelay, 'arrival_time':ArrivalTime,
                                        'departure_delay':DepartureDelay,'departure_time':DepartureTime}, ignore_index=True )

        print('fini')

    except Exception as e:
        print(e)

    meta = MetaData()

    buses_updates = Table(
    'buses_updates', meta, 
    Column('id',Integer,primary_key = True, autoincrement=False ),
    Column('timestamp', TIMESTAMP), 
    Column('trip_id', String(40) ), 
    Column('route_id', String(40)), 
    Column('start_time', String(20) ),
    Column('start_date', Integer ),
    Column('schedule_relationship', String(50) ), 
    Column('is_deleted', Boolean ),
    Column('stop_sequence', Integer ),
    Column('stop_id', String(20) ),
    Column('arrival_delay', Integer ), 
    Column('departure_delay', Integer )
    )

    try: 
        meta.create_all(engine,checkfirst=True) #create table and drop if already exist 
        df_buses_updates.to_sql('buses_updates', dbConnection, if_exists='replace',index=False) #insert the data in the table 

    except ValueError as vx:
        print(vx)

    except Exception as ex:   
        print(ex)

    else:
        print("Table created and completed successfully.")

    finally:
        dbConnection.close()
    print('time to sleep')
    time.sleep(600)
