let mediaRecorder;
let audioChunks = [];

// 1. Función para obtener el token de seguridad de Django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// 2. Lógica para grabar y enviar
async function configurarGrabacion() {
    const btnGrabar = document.getElementById('btnGrabar'); // Asegúrate de tener este ID en tu HTML

    if (!btnGrabar) return;

    btnGrabar.onclick = async () => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                await enviarAudioAlServidor(audioBlob);
                audioChunks = [];
            };

            mediaRecorder.start();
            btnGrabar.innerText = "🛑 Detener y Enviar";
        } else {
            mediaRecorder.stop();
            btnGrabar.innerText = "🎤 Grabar Gasto";
        }
    };
}

async function enviarAudioAlServidor(blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'grabacion.wav');

    try {
        const response = await fetch('/finanzas/transcribir/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        const data = await response.json();
        
        if (data.mensaje) {
            alert(data.mensaje + "\nTexto: " + data.transcripcion + "\nMonto: $" + data.monto);
        } else {
            alert("Error de la IA: " + data.error);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Hubo un error al conectar con el servidor.");
    }
}

// Ejecutar la configuración al cargar la página
document.addEventListener('DOMContentLoaded', configurarGrabacion);