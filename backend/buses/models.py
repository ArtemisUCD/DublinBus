from django.db import models


# all the table from the data alreeady imported on DB 
# python manage.py inspectdb  => gives all the models !

class BusesUpdates(models.Model):
    id = models.BigIntegerField(primary_key=True)
    timestamp = models.BigIntegerField(blank=True, null=True)
    trip_id = models.TextField(blank=True, null=True)
    route_id = models.TextField(blank=True, null=True)
    start_time = models.TextField(blank=True, null=True)
    start_date = models.TextField(blank=True, null=True)
    schedule_relationship = models.TextField(blank=True, null=True)
    is_deleted = models.IntegerField(blank=True, null=True)
    stop_sequence = models.BigIntegerField(blank=True, null=True)
    stop_id = models.TextField(blank=True, null=True)
    arrival_delay = models.BigIntegerField(blank=True, null=True)
    arrival_time = models.BigIntegerField(blank=True, null=True)
    departure_delay = models.BigIntegerField(blank=True, null=True)
    departure_time = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'buses_updates'


class Calendar(models.Model):
    service_id = models.CharField(primary_key=True, max_length=5)
    monday = models.IntegerField(blank=True, null=True)
    tuesday = models.IntegerField(blank=True, null=True)
    wednesday = models.IntegerField(blank=True, null=True)
    thursday = models.IntegerField(blank=True, null=True)
    friday = models.IntegerField(blank=True, null=True)
    saturday = models.IntegerField(blank=True, null=True)
    sunday = models.IntegerField(blank=True, null=True)
    start_date = models.IntegerField(blank=True, null=True)
    end_date = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'calendar'


class CalendarDates(models.Model):
    service = models.OneToOneField(Calendar, models.DO_NOTHING, primary_key=True)
    date = models.IntegerField(blank=True, null=True)
    exception_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'calendar_dates'

class Routes(models.Model):
    route_id = models.CharField(primary_key=True, max_length=20)
    agency_id = models.IntegerField(blank=True, null=True)
    route_short_name = models.CharField(max_length=6, blank=True, null=True)
    route_long_name = models.CharField(max_length=40, blank=True, null=True)
    route_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'routes'

class Shapes(models.Model):
    shape_id = models.CharField(max_length=20, blank=True, null=True)
    shape_pt_lat = models.FloatField(blank=True, null=True)
    shape_pt_lon = models.FloatField(blank=True, null=True)
    shape_pt_sequence = models.IntegerField(blank=True, null=True)
    shape_dist_traveled = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shapes'


class StopTimes(models.Model):
    trip_id = models.CharField(max_length=40, blank=True, null=True)
    arrival_time = models.CharField(max_length=40, blank=True, null=True)
    departure_time = models.CharField(max_length=40, blank=True, null=True)
    stop = models.ForeignKey('Stops', models.DO_NOTHING, blank=True, null=True)
    stop_sequence = models.IntegerField(blank=True, null=True)
    stop_headsign = models.CharField(max_length=50, blank=True, null=True)
    pickup_type = models.IntegerField(blank=True, null=True)
    drop_off_type = models.IntegerField(blank=True, null=True)
    shape_dist_traveled = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stop_times'

class Stops(models.Model):
    stop_id = models.CharField(primary_key=True, max_length=20)
    stop_name = models.CharField(max_length=40, blank=True, null=True)
    stop_lat = models.FloatField(blank=True, null=True)
    stop_lon = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stops'


class Transfers(models.Model):
    from_stop = models.ForeignKey(Stops, models.DO_NOTHING, blank=True, null=True , related_name='from_stop_FK')
    to_stop = models.ForeignKey(Stops, models.DO_NOTHING, blank=True, null=True , related_name='to_stop_FK')
    transfer_type = models.IntegerField(blank=True, null=True)
    min_transfer_time = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transfers'


class Trips(models.Model):
    route = models.ForeignKey(Routes, models.DO_NOTHING, blank=True, null=True)
    service = models.ForeignKey(Calendar, models.DO_NOTHING, blank=True, null=True)
    trip_id = models.CharField(max_length=50, blank=True, null=True)
    shape_id = models.CharField(max_length=20, blank=True, null=True)
    trip_headsign = models.CharField(max_length=100, blank=True, null=True)
    direction_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'trips'

class DailyWeather(models.Model):
    date = models.CharField(primary_key=True, max_length=32)
    temperature = models.CharField(max_length=32, blank=True, null=True)
    weather_icon = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'daily_weather'