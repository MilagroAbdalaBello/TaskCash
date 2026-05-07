from django.urls import path
from . import views

urlpatterns = [
    # Agrega la coma al final de esta línea:
    path('', views.inicio, name='index'), 
    
    # Y asegúrate de que la siguiente también tenga una (por si agregas más después)
    path('transcribir/', views.transcribir_audio, name='transcribir_audio'),
]
