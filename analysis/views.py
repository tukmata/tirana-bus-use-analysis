from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SurveyData, OperationalData
from .serializers import SurveyDataSerializer, OperationalDataSerializer
from django.http import JsonResponse
from django.conf import settings
import pandas as pd
import os


class SurveyDataView(APIView):
    def get(self, request):
        data = SurveyData.objects.all()
        serializer = SurveyDataSerializer(data, many=True)
        return Response(serializer.data)


class OperationalDataView(APIView):
    def get(self, request):
        data = OperationalData.objects.all()
        serializer = OperationalDataSerializer(data, many=True)
        return Response(serializer.data)


def dynamic_aggregation_view(request):
    # Load the Excel file dynamically
    file_path = os.path.join(settings.BASE_DIR, "data.xlsx")
    xls = pd.ExcelFile(file_path)

    # Load individual sheets
    survey_data = xls.parse("survey")
    operation_data = xls.parse("operation")

    # Clean the survey data
    survey_data.columns = [
        "timestamp", "time_slot", "station", "bus_line", "ticket_type",
        "used_lines", "trip_purpose", "main_trip_purpose", "trips", "trip_days",
        "gender", "age_group", "price_paid", "ticket_en"
    ]
    survey_data = survey_data.dropna(subset=["price_paid", "trips", "bus_line"])
    survey_data["price_paid"] = pd.to_numeric(survey_data["price_paid"], errors="coerce")
    survey_data["trips"] = pd.to_numeric(survey_data["trips"], errors="coerce")
    survey_data["bus_line"] = survey_data["bus_line"].astype(int)

    # Clean the operation data
    operation_data.columns = ["bus_line", "kilometers", "vehicles"]
    operation_data["kilometers"] = pd.to_numeric(operation_data["kilometers"], errors="coerce")
    operation_data["vehicles"] = pd.to_numeric(operation_data["vehicles"], errors="coerce")

    # Merge survey data with operational data
    survey_data = pd.merge(survey_data, operation_data, on="bus_line", how="left")

    # Calculate revenue, yield, and additional metrics
    VAT_RATE = 0.20
    survey_data["revenue"] = survey_data["price_paid"] * survey_data["trips"]
    survey_data["yield"] = survey_data["revenue"] * (1 - VAT_RATE)
    survey_data["yield_per_km"] = survey_data["yield"] / survey_data["kilometers"]
    survey_data["yield_per_vehicle"] = survey_data["yield"] / survey_data["vehicles"]

    # Aggregate data
    aggregated_data = survey_data.groupby(["bus_line", "time_slot", "age_group"]).agg(
        total_revenue=pd.NamedAgg(column="revenue", aggfunc="sum"),
        total_yield=pd.NamedAgg(column="yield", aggfunc="sum"),
        total_trips=pd.NamedAgg(column="trips", aggfunc="sum"),
        avg_yield_per_trip=pd.NamedAgg(column="yield", aggfunc="mean"),
        avg_yield_per_km=pd.NamedAgg(column="yield_per_km", aggfunc="mean"),
        avg_yield_per_vehicle=pd.NamedAgg(column="yield_per_vehicle", aggfunc="mean")
    ).reset_index()

    # Convert the result to JSON
    result = aggregated_data.to_dict(orient="records")
    return JsonResponse(result, safe=False)
