// Motor de física Matter.js
const { Engine, Runner, World, Bodies, Mouse, MouseConstraint, Events, Body } = Matter;

// Configuración del juego
const config = {
    width: 800,
    height: 600,
    bowlRadius: 280,
    letterSize: 30,
    letterCount: 20
};


const words = ['REQUISITOS', 'ANALISIS', 'DISEÑO', 'IMPLEMENTACION', 'PRUEBAS', 'DESPLIEGUE', 'MANTENIMIENTO'];



let currentWord = words[0];
let foundWords = 0;

// Referencias
let canvas, ctx, engine, world, runner, mouseConstraint;
let letterBodies = [];
let selectedLetters = [];
let steamParticles = [];

// Inicializar el juego
function init() {
    console.log('Iniciando juego...');

    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas no encontrado');
        return;
    }

    canvas.width = config.width;
    canvas.height = config.height;
    ctx = canvas.getContext('2d');

    console.log('Canvas configurado:', canvas.width, 'x', canvas.height);

    // Crear motor de física
    engine = Engine.create({
        gravity: { x: 0, y: 0.05 } // Gravedad muy suave para flotación
    });
    world = engine.world;


    console.log('Motor de física creado');

    // Crear bordes del plato (paredes circulares)
    createBowlWalls();
    console.log('Paredes del plato creadas');

    // Crear letras flotantes
    createLetters();
    console.log('Letras creadas:', letterBodies.length);

    // Crear partículas de vapor
    createSteamParticles();
    console.log('Partículas de vapor creadas');

    // Mouse control
    const mouse = Mouse.create(canvas);
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    World.add(world, mouseConstraint);

    // Mantener el mouse sincronizado con el canvas
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    // Eventos
    Events.on(mouseConstraint, 'startdrag', handleDragStart);
    Events.on(mouseConstraint, 'enddrag', handleDragEnd);

    // Runner
    runner = Runner.create();
    Runner.run(runner, engine);

    console.log('Motor de física iniciado');

    // Loop de animación personalizado
    animate();

    // Event listeners para botones
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('changeWordBtn').addEventListener('click', changeWord);

    console.log('Juego inicializado correctamente');
}

// Crear las paredes del plato (círculo)
function createBowlWalls() {
    const segments = 32;
    const thickness = 20;
    const centerX = config.width / 2;
    const centerY = config.height / 2;

    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;

        const x1 = centerX + Math.cos(angle) * config.bowlRadius;
        const y1 = centerY + Math.sin(angle) * config.bowlRadius;
        const x2 = centerX + Math.cos(nextAngle) * config.bowlRadius;
        const y2 = centerY + Math.sin(nextAngle) * config.bowlRadius;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const wallAngle = Math.atan2(y2 - y1, x2 - x1);

        const wall = Bodies.rectangle(midX, midY, length, thickness, {
            isStatic: true,
            angle: wallAngle,
            render: { fillStyle: '#8B4513' }
        });

        World.add(world, wall);
    }
}

// Crear letras como cuerpos físicos
function createLetters() {
    // Limpiar letras anteriores
    letterBodies.forEach(letter => World.remove(world, letter));
    letterBodies = [];
    selectedLetters = [];

    // Crear letras del alfabeto + letras de la palabra objetivo
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = [];

    // Asegurar que tenemos las letras de la palabra objetivo
    for (let char of currentWord) {
        letters.push(char);
    }

    // Rellenar con letras aleatorias
    while (letters.length < config.letterCount) {
        letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    // Mezclar
    letters.sort(() => Math.random() - 0.5);

    // Crear cuerpos físicos para cada letra
    const centerX = config.width / 2;
    const centerY = config.height / 2;

    letters.forEach((letter, index) => {
        const angle = (index / letters.length) * Math.PI * 2;
        const radius = Math.random() * 100 + 50;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const letterBody = Bodies.circle(x, y, config.letterSize, {
            restitution: 0.4,
            friction: 0.1,
            frictionAir: 0.08, // Mayor resistencia del caldo
            density: 0.0005, // Muy liviano para flotar
            render: { fillStyle: '#FFD700' },
            label: letter
        });

        // Aplicar velocidad inicial aleatoria más suave
        Body.setVelocity(letterBody, {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
        });

        World.add(world, letterBody);
        letterBodies.push(letterBody);
    });
}

// Crear partículas de vapor
function createSteamParticles() {
    for (let i = 0; i < 15; i++) {
        steamParticles.push({
            x: config.width / 2 + (Math.random() - 0.5) * config.bowlRadius * 2,
            y: config.height / 2 - config.bowlRadius + Math.random() * 50,
            size: Math.random() * 20 + 10,
            opacity: Math.random() * 0.3,
            speed: Math.random() + 0.5,
            drift: (Math.random() - 0.5) * 0.5
        });
    }
}

// Actualizar y dibujar vapor
function updateSteam() {
    steamParticles.forEach(particle => {
        // Mover hacia arriba
        particle.y -= particle.speed;
        particle.x += particle.drift;
        particle.opacity -= 0.002;
        particle.size += 0.2;

        // Resetear si sale de la pantalla
        if (particle.y < 0 || particle.opacity <= 0) {
            particle.x = config.width / 2 + (Math.random() - 0.5) * config.bowlRadius * 2;
            particle.y = config.height / 2 - config.bowlRadius + Math.random() * 30;
            particle.size = Math.random() * 20 + 10;
            particle.opacity = Math.random() * 0.3 + 0.1;
            particle.speed = Math.random() + 0.5;
            particle.drift = (Math.random() - 0.5) * 0.5;
        }
    });

    // Dibujar vapor
    steamParticles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
    });
}

// Dibujar el plato
function drawBowl() {
    const centerX = config.width / 2;
    const centerY = config.height / 2;

    // Sombra del plato
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Borde del plato (marrón oscuro)
    ctx.beginPath();
    ctx.arc(centerX, centerY, config.bowlRadius + 15, 0, Math.PI * 2);
    ctx.fillStyle = '#654321';
    ctx.fill();
    ctx.restore();

    // Interior del plato - caldo (gradiente para dar profundidad)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, config.bowlRadius);
    gradient.addColorStop(0, '#FFE4B5');
    gradient.addColorStop(0.5, '#F4D6A0');
    gradient.addColorStop(0.8, '#E8C070');
    gradient.addColorStop(1, '#DEB887');

    ctx.beginPath();
    ctx.arc(centerX, centerY, config.bowlRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Capa de caldo líquido con transparencia
    const liquidGradient = ctx.createRadialGradient(centerX, centerY - 50, 100, centerX, centerY, config.bowlRadius);
    liquidGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    liquidGradient.addColorStop(0.5, 'rgba(255, 235, 180, 0.2)');
    liquidGradient.addColorStop(1, 'rgba(255, 200, 100, 0.1)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, config.bowlRadius, 0, Math.PI * 2);
    ctx.fillStyle = liquidGradient;
    ctx.fill();

    // Detalle del caldo (ondas animadas)
    const time = Date.now() * 0.001;
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const waveRadius = config.bowlRadius - 50 - i * 20;
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const wave = Math.sin(angle * 5 + time + i) * 3;
            const x = centerX + Math.cos(angle) * (waveRadius + wave);
            const y = centerY + Math.sin(angle) * (waveRadius + wave);
            if (angle === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Burbujas en el caldo
    drawBubbles(centerX, centerY, time);

    // Brillo en el borde
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, config.bowlRadius + 10, 0, Math.PI * 2);
    ctx.stroke();
}

// Dibujar burbujas flotantes en el caldo
function drawBubbles(centerX, centerY, time) {
    const bubbleCount = 8;

    for (let i = 0; i < bubbleCount; i++) {
        const angle = (i / bubbleCount) * Math.PI * 2 + time * 0.5;
        const radius = 80 + Math.sin(time * 2 + i) * 40;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius + Math.sin(time * 3 + i) * 10;
        const size = 3 + Math.sin(time * 4 + i) * 2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Dibujar letras
function drawLetters() {
    letterBodies.forEach((letter) => {
        const { x, y } = letter.position;
        const isSelected = selectedLetters.includes(letter);

        // Sombra de la letra
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Círculo de fondo (fideo)
        ctx.beginPath();
        ctx.arc(x, y, config.letterSize, 0, Math.PI * 2);

        if (isSelected) {
            // Gradiente para letra seleccionada
            const selGradient = ctx.createRadialGradient(x, y, 0, x, y, config.letterSize);
            selGradient.addColorStop(0, '#FFD700');
            selGradient.addColorStop(1, '#FFA500');
            ctx.fillStyle = selGradient;
        } else {
            // Gradiente normal
            const gradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, config.letterSize);
            gradient.addColorStop(0, '#FFFACD');
            gradient.addColorStop(1, '#F0E68C');
            ctx.fillStyle = gradient;
        }

        ctx.fill();
        ctx.restore();

        // Borde
        ctx.strokeStyle = isSelected ? '#FF6347' : '#DAA520';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Letra
        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.label, x, y);

        // Número de orden si está seleccionada
        if (isSelected) {
            const orderIndex = selectedLetters.indexOf(letter) + 1;
            ctx.fillStyle = '#FF6347';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(orderIndex, x + config.letterSize - 8, y - config.letterSize + 8);
        }
    });
}

// Aplicar fuerzas fluidas para simular el caldo
function applyFluidForces() {
    const time = Date.now() * 0.001;

    letterBodies.forEach(letter => {
        // Corrientes circulares simulando el caldo
        const dx = letter.position.x - config.width / 2;
        const dy = letter.position.y - config.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.bowlRadius - config.letterSize) {
            // Fuerza de flotación fuerte hacia arriba
            const buoyancy = Math.sin(time * 0.8 + letter.id * 0.5) * 0.0008;
            Body.applyForce(letter, letter.position, {
                x: (Math.random() - 0.5) * 0.0002,
                y: buoyancy - 0.0006 // Flotación constante hacia arriba
            });

            // Corriente circular más fuerte
            const angle = Math.atan2(dy, dx);
            const currentForce = 0.0001;
            Body.applyForce(letter, letter.position, {
                x: Math.sin(angle) * currentForce,
                y: -Math.cos(angle) * currentForce
            });

            // Limitar velocidad para evitar que se salgan
            const maxSpeed = 3;
            const speed = Math.sqrt(letter.velocity.x ** 2 + letter.velocity.y ** 2);
            if (speed > maxSpeed) {
                Body.setVelocity(letter, {
                    x: (letter.velocity.x / speed) * maxSpeed,
                    y: (letter.velocity.y / speed) * maxSpeed
                });
            }
        }
    });
}

// Loop de animación
function animate() {
    ctx.clearRect(0, 0, config.width, config.height);

    drawBowl();
    applyFluidForces(); // Simular corrientes del caldo
    drawLetters();
    updateSteam(); // Vapor saliendo del caldo

    requestAnimationFrame(animate);
}

// Manejar inicio de arrastre
function handleDragStart(event) {
    const body = event.body;
    if (letterBodies.includes(body)) {
        if (!selectedLetters.includes(body)) {
            selectedLetters.push(body);
            checkWord();
        }
    }
}

// Manejar fin de arrastre
function handleDragEnd(event) {
    // Opcional: puedes agregar lógica aquí si necesitas
}

// Verificar si se formó la palabra
function checkWord() {
    const formedWord = selectedLetters.map(letter => letter.label).join('');

    if (formedWord === currentWord) {
        // ¡Palabra encontrada!
        foundWords++;
        document.getElementById('score').textContent = foundWords;

        // Celebración visual
        celebrateWord();

        // Limpiar selección y cambiar palabra automáticamente
        setTimeout(() => {
            selectedLetters = [];
            // Cambiar a una nueva palabra automáticamente
            changeWord();
        }, 1500);
    } else if (formedWord.length >= currentWord.length) {
        // Palabra incorrecta, limpiar
        selectedLetters = [];
    }
}

// Celebración cuando se encuentra una palabra
function celebrateWord() {
    // Aplicar impulso a todas las letras
    letterBodies.forEach(letter => {
        const angle = Math.random() * Math.PI * 2;
        const force = 0.05;
        Body.applyForce(letter, letter.position, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force
        });
    });

    // Efecto visual
    canvas.style.filter = 'brightness(1.3)';
    setTimeout(() => {
        canvas.style.filter = 'brightness(1)';
    }, 200);
}

// Reiniciar el juego
function resetGame() {
    createLetters();
    foundWords = 0;
    document.getElementById('score').textContent = foundWords;
}

// Cambiar palabra objetivo
function changeWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById('target-word').textContent = currentWord;
    resetGame();
}

// Iniciar cuando se cargue la página
window.addEventListener('load', () => {
    // Verificar que Matter.js esté cargado
    if (typeof Matter === 'undefined') {
        console.error('Matter.js no está cargado');
        alert('Error: Matter.js no se pudo cargar. Por favor, verifica tu conexión a internet.');
        return;
    }

    // Pequeño retraso para asegurar que todo esté listo
    setTimeout(init, 100);
});
