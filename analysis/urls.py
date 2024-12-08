from django.urls import path
from .views import SurveyDataView, OperationalDataView, dynamic_aggregation_view

urlpatterns = [
    path('survey/', SurveyDataView.as_view(), name='survey'),
    path('operation/', OperationalDataView.as_view()),
    path('dynamic-aggregation/', dynamic_aggregation_view, name='dynamic-aggregation'),
]
