from django.shortcuts import render
import assemblyai as aai
from django.http import JsonResponse
from .models import Movimiento
import re

def inicio(request):
    return render(request, 'finanzas/index.html')

#Configurar la API Key aquí
aai.settings.api_key="276c1edb92d7463abd0cb19562062217"

def transcribir_audio(request):
    if request.method == 'POST' and request.FILES.get('audio'):
        archivo_audio = request.FILES['audio']

        # 1. Transcribir el audio usando AssemblyAI
        transcriber = aai.Transcriber()

        #Le pasamos el archivo directamente
        transcript = transcriber.transcribe(archivo_audio.read())

        if transcript.status == aai.TranscriptStatus.error:
            return JsonResponse({'error': transcript.error}, status=500)
        texto_final = transcript.text

        #2. Logica simple para extraer el monto (buscamos numeros dentro del texto)
        
        numeros= re.findall(r'\d+', texto_final)
        monto_detectado= int(numeros[0]) if numeros else 0

        #3. Guardar en la bd

        nuevo_gasto= Movimiento.objects.create(
            monto = monto_detectado,
            concepto = texto_final,
            tipo = 'EGRE', 
            metodo_pago = 'Efectivo'
        )

        return JsonResponse({
            'mensaje': 'Gasto Registrado!',
            'transcripcion': texto_final,
            'monto': monto_detectado
        })
    return JsonResponse({'error':'Método no permitido'}, status=400)
         