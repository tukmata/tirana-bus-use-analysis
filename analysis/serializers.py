from rest_framework import serializers
from .models import SurveyData, OperationalData

class SurveyDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyData
        fields = '__all__'

class OperationalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationalData
        fields = '__all__'
