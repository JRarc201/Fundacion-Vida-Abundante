// script.js
const images = document.querySelectorAll(".carousel img");
let index = 0;

function changeImage() {
    images[index].style.opacity = 0; // Oculta la imagen actual
    index = (index + 1) % images.length; // Incrementa el índice circularmente
    images[index].style.opacity = 1; // Muestra la siguiente imagen
}

setInterval(changeImage, 5000); // Cambia cada 5 segundos
