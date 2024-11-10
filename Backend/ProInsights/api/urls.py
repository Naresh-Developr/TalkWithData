# urls.py
from django.urls import path
from .views import UploadData, ProcessQuery, GetChartRecommendations

urlpatterns = [
    path('upload/', UploadData.as_view(), name='upload-data'),
    path('process-query/', ProcessQuery.as_view(), name='process-query'),
    path('get-chart-recommendations/', GetChartRecommendations.as_view(), name='get-chart-recommendations'),
]
