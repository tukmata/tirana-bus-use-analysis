from django.db import models

class SurveyData(models.Model):
    timestamp = models.DateTimeField()
    time_slot = models.CharField(max_length=50)
    line = models.IntegerField()
    ticket_type = models.CharField(max_length=50)
    price_paid = models.FloatField()
    gender = models.CharField(max_length=10)
    age_group = models.CharField(max_length=20)
    trip_purpose = models.CharField(max_length=100)
    trips = models.IntegerField()

class OperationalData(models.Model):
    line = models.IntegerField()
    kilometers = models.FloatField()
    vehicles = models.IntegerField()
