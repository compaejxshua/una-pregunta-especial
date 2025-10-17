// ===== ELEMENTOS DEL DOM =====
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const content = document.getElementById('content');
const responseMessage = document.getElementById('response-message');
const confettiCanvas = document.getElementById('confetti-canvas');
const buttonsContainer = document.getElementById('buttons-container');

// ===== CONFIGURACIÓN DEL BOTÓN "NO" =====
// Ajusta estos valores para cambiar el comportamiento del botón que huye
const ESCAPE_DISTANCE = 500; // Distancia en píxeles a la que el botón empieza a huir
const MOVE_SPEED = 0.8; // Velocidad de movimiento (0-1, más alto = más rápido)

// Mensajes que cambian cada vez que hacen clic en "No"
const NO_BUTTON_MESSAGES = [
    "No 💔",
    "¿Estás segura?",
    "Piensa bien 🥺",
    "No digas que no 😢",
    "No puedes escaparte de mi amorrr",
    "Daaaaale, dime que sí 🙁",
    "Intenta el otro botón 🙂"
];

let noButtonClickCount = 0; // Contador de clics en el botón "No"

// ===== FUNCIONALIDAD DEL BOTÓN "SÍ" =====
yesButton.addEventListener('click', handleYesClick);
yesButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleYesClick();
    }
});

function handleYesClick() {
    content.style.display = 'none';
    responseMessage.classList.add('show');
    launchConfetti();
}

// ===== FUNCIONALIDAD DEL BOTÓN "NO" (HUYE DEL CURSOR) =====
// El botón se mueve cuando el cursor/dedo se acerca

// Evento de clic en el botón "No" - cambia el texto y lo mueve
noButton.addEventListener('click', handleNoClick);

function handleNoClick() {
    // Incrementar el contador de clics
    noButtonClickCount++;
    
    // Cambiar el texto del botón (ciclar a través de los mensajes)
    const messageIndex = Math.min(noButtonClickCount, NO_BUTTON_MESSAGES.length - 1);
    noButton.innerHTML = NO_BUTTON_MESSAGES[messageIndex];
    
    // Mover el botón a una posición aleatoria en la pantalla
    moveNoButtonToRandomPosition();
}

function moveNoButtonToRandomPosition() {
    const buttonRect = noButton.getBoundingClientRect();
    
    // Calcular posición aleatoria dentro de la pantalla
    const margin = 50; // Margen desde los bordes
    const randomX = margin + Math.random() * (window.innerWidth - buttonRect.width - margin * 2);
    const randomY = margin + Math.random() * (window.innerHeight - buttonRect.height - margin * 2);
    
    // Aplicar nueva posición
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
}

// Para desktop: detectar movimiento del mouse
document.addEventListener('mousemove', (e) => {
    moveNoButtonAway(e.clientX, e.clientY);
});

// Para móvil: detectar inicio de toque
noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    moveNoButtonAway(touch.clientX, touch.clientY);
});

// También detectar movimiento durante el toque
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        moveNoButtonAway(touch.clientX, touch.clientY);
    }
});

function moveNoButtonAway(cursorX, cursorY) {
    // Obtener la posición y dimensiones del botón
    const buttonRect = noButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calcular distancia entre cursor y centro del botón
    const deltaX = cursorX - buttonCenterX;
    const deltaY = cursorY - buttonCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Si el cursor está cerca, mover el botón en dirección opuesta
    if (distance < ESCAPE_DISTANCE) {
        // Calcular nueva posición (dirección opuesta al cursor)
        const angle = Math.atan2(deltaY, deltaX);
        const moveDistance = (ESCAPE_DISTANCE - distance) * MOVE_SPEED;
        
        let newX = buttonCenterX - Math.cos(angle) * moveDistance;
        let newY = buttonCenterY - Math.sin(angle) * moveDistance;
        
        // Obtener límites de la ventana completa (toda la pantalla)
        const minX = buttonRect.width / 2;
        const maxX = window.innerWidth - buttonRect.width / 2;
        const minY = buttonRect.height / 2;
        const maxY = window.innerHeight - buttonRect.height / 2;
        
        // Limitar posición dentro de la pantalla completa
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
        
        // Calcular posición absoluta en la ventana (position: fixed)
        const absoluteX = newX - buttonRect.width / 2;
        const absoluteY = newY - buttonRect.height / 2;
        
        // Aplicar transformación
        noButton.style.left = `${absoluteX}px`;
        noButton.style.top = `${absoluteY}px`;
    }
}

// ===== SISTEMA DE CONFETI =====
// Implementación con Canvas para animación de confeti ligera
function launchConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Configuración del confeti
    const confettiCount = 150; // Número de piezas de confeti
    const confettiPieces = [];
    const colors = ['#b19cd9', '#9370db', '#ff8c42', '#dda0dd', '#8b4fdb', '#ff9f5a'];
    
    // Crear piezas de confeti
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    let animationFrame;
    let startTime = Date.now();
    const duration = 3000; // Duración de la animación (3 segundos)
    
    function animate() {
        const elapsed = Date.now() - startTime;
        
        // Detener después de la duración especificada
        if (elapsed > duration) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar y actualizar cada pieza de confeti
        confettiPieces.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();
            
            // Actualizar posición
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += piece.rotationSpeed;
            
            // Si sale de la pantalla por abajo, no lo recicles (termina la animación)
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== AJUSTE DE CANVAS AL CAMBIAR TAMAÑO DE VENTANA =====
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// ===== INICIALIZACIÓN =====
// Establecer tamaño inicial del canvas
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// Posicionar el botón "No" inicialmente en el centro-derecha de la pantalla
function initNoButtonPosition() {
    const buttonRect = noButton.getBoundingClientRect();
    const centerX = window.innerWidth / 2 + 100;
    const centerY = window.innerHeight / 2;
    
    noButton.style.left = `${centerX - buttonRect.width / 2}px`;
    noButton.style.top = `${centerY - buttonRect.height / 2}px`;
}

// Inicializar posición del botón
initNoButtonPosition();

// Reposicionar al cambiar tamaño de ventana
window.addEventListener('resize', initNoButtonPosition);
