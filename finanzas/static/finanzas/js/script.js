let mediaRecorder;
let audioChunks = [];

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

// Hacemos la función global para que el HTML la encuentre
window.manejarClick = async function() {
    console.log("¡Click detectado!");
    const btnGrabar = document.getElementById('btnGrabar');
    const estado = document.getElementById('texto-ia');

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            
            mediaRecorder.onstop = async () => {
                estado.innerText = "⏳ Procesando audio...";
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                await enviarAudioAlServidor(audioBlob);
                audioChunks = [];
            };

            audioChunks = [];
            mediaRecorder.start();
            
            // --- CAMBIOS VISUALES INMEDIATOS ---
            btnGrabar.style.backgroundColor = "#ff0000"; 
            btnGrabar.style.color = "white";
            btnGrabar.innerText = "🛑 DETENER GRABACIÓN";
            
            // Mensaje que confirma que ya está grabando
            estado.innerHTML = "<b style='color: red;'>🔴 ¡YA ESTOY GRABANDO! Hablá ahora...</b>";
            console.log("Grabación iniciada correctamente");

        } catch (err) {
            alert("Error: No se pudo activar el micrófono. Revisa los permisos en el candado de la URL.");
        }
    } else {
        mediaRecorder.stop();
        btnGrabar.style.backgroundColor = "";
        btnGrabar.style.color = "";
        btnGrabar.innerText = "🎤 Grabar Gasto";
        estado.innerText = "Analizando...";
    }
}

async function enviarAudioAlServidor(blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'grabacion.wav');
    const response = await fetch('/finanzas/transcribir/', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    });
    const data = await response.json();
    document.getElementById('texto-ia').innerText = "Transcripción: " + data.transcripcion;
}