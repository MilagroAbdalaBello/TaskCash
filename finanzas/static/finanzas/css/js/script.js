// Selección de elementos del DOM
const modal = document.getElementById('miModal');
const btnAbrir = document.getElementById('abrirModal');
const btnCerrar = document.getElementById('cerrarModal');
const historialBtn=document.getElementById("verHistorial");
const contenido=document.getElementById("contenido");
const escribirBtn=document.getElementById("abrirModal");


// 1. Manejo del Modal y Vistas
btnAbrir.addEventListener('click', (e) => {
    e.preventDefault();
    seccionHistorial.style.display = 'none'; // Ocultamos historial al escribir
    modal.showModal(); 
});

btnCerrar.addEventListener('click', () => {
    modal.close();
});

historialBtn.addEventListener("click", function(e) {
    e.preventDefault(); //evita que recargue

    contenido.innerHTML = `
    <h2>Historial de gastos</h2>
`;

});

escribirBtn.addEventListener("click", function(e){
    e.preventDefault();

    contenido.innerHTML = `
    <h2>Nuevo Gasto</h2>
`;
});



