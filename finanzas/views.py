from django.shortcuts import render
import assemblyai as aai
import tempfile
import re
from django.http import JsonResponse
from .models import Movimiento

def inicio(request):
    return render(request, 'finanzas/index.html')

# Configurar la API Key de AssemblyAI
aai.settings.api_key = "3f7eca5b1bf448bfa2c71c4b5e77a7cb"

def transcribir_audio(request):
    if request.method == 'POST' and request.FILES.get('audio'):
        archivo_audio = request.FILES['audio']

        # Guardar archivo temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            for chunk in archivo_audio.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

            # Configurar el modelo de AssemblyAI (lista en plural)
            config = aai.TranscriptionConfig(speech_models=["universal"])



        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(tmp_path, config=config)

        # Manejo de errores de AssemblyAI
        if transcript.status == aai.TranscriptStatus.error:
            return JsonResponse({'error': transcript.error}, status=500)

        # Texto final de la transcripción
        texto_final = transcript.text

        # Extraer números del texto para detectar monto
        numeros = re.findall(r'\d+', texto_final)
        monto_detectado = int(numeros[0]) if numeros else 0

        # Guardar en la base de datos
        Movimiento.objects.create(
            monto=monto_detectado,
            concepto=texto_final,
            tipo='EGRE',
            metodo_pago='Efectivo'
        )

        # Respuesta JSON al frontend
        return JsonResponse({
            'mensaje': 'Gasto Registrado!',
            'transcripcion': texto_final,
            'monto': monto_detectado
        })

    return JsonResponse({'error': 'Método no permitido'}, status=400)
