const { jsPDF } = window.jspdf;

const photoButtonsContainer = document.getElementById('photo-buttons');
const photoPreview = document.getElementById('photo-preview');
const generatePdfButton = document.getElementById('generate-pdf');
const photoWarning = document.getElementById('photo-warning');
const maxPhotos = 20;
let photoCount = 0;
let photoData = []; // Array para almacenar información de las imágenes

// Crear botones para subir imágenes
for (let i = 1; i <= maxPhotos; i++) {
    const button = document.createElement('button');
    button.textContent = `Agregar Foto ${i}`;
    button.type = 'button';
    button.onclick = () => uploadPhoto(i);
    photoButtonsContainer.appendChild(button);
}

function uploadPhoto(index) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgContainer = document.createElement('div');
                const img = document.createElement('img');
                img.src = e.target.result;
                imgContainer.appendChild(img);

                // Crear y mostrar el nombre del archivo
                const fileName = document.createElement('p');
                fileName.textContent = file.name; // Nombre del archivo
                fileName.style.textAlign = 'center'; // Centrar el texto
                imgContainer.appendChild(fileName);

                // Estilizar contenedor de imagen
                imgContainer.style.margin = '5px';
                imgContainer.style.display = 'inline-block'; // Para que las imágenes estén una al lado de la otra
                imgContainer.style.textAlign = 'center'; // Centrar el contenido
                photoPreview.appendChild(imgContainer);

                // Guardar datos de la imagen
                photoData.push({ src: e.target.result, name: file.name });
            };
            reader.readAsDataURL(file);
            photoCount++;

            // Verificar si se alcanzó el máximo
            if (photoCount >= maxPhotos) {
                photoWarning.style.display = 'block';
                fileInput.disabled = true; // Desactivar el botón si se alcanza el máximo
            } else {
                photoWarning.style.display = 'none';
            }
        }
    };
    fileInput.click();
}

generatePdfButton.addEventListener('click', () => {
    const clientName = document.getElementById('client-name').value;
    const city = document.getElementById('city').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const comments = document.getElementById('comments').value;

    const pdf = new jsPDF();
    
    // Parte 1: Información del cliente
    pdf.text(`Nombre del Cliente: ${clientName}`, 10, 10);
    pdf.text(`Ciudad: ${city}`, 10, 20);
    pdf.text(`Fecha de Inicio: ${startDate}`, 10, 30);
    pdf.text(`Fecha de Fin: ${endDate}`, 10, 40);
    pdf.text(`Comentarios:`, 10, 50);
    pdf.text(comments, 10, 60);

    // Guardar la primera parte
    pdf.addPage();

    // Parte 2: Imágenes
    pdf.text('Fotos:', 10, 10);
    
    if (photoData.length > 0) {
        photoData.forEach((photo, index) => {
            const imgWidth = 50;
            const imgHeight = 50;
            const imgX = 10;
            const imgY = 20 + (index * (imgHeight + 10));

            pdf.addImage(photo.src, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            pdf.text(photo.name, imgX, imgY + imgHeight + 5); // Agregar el nombre debajo de la imagen
        });
    }

    pdf.save(`${clientName}_Mantenimiento_A_C.pdf`);
});
