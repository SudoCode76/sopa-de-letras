# 🍜 Sopa de Letras Interactiva

Una sopa de letras física e interactiva creada con Canvas y Matter.js, donde las letras flotan como fideos en un plato y puedes arrastrarlas para formar palabras.

## ✨ Características

- **Sin assets**: Todo dibujado directamente en Canvas
- **Física realista**: Matter.js proporciona colisiones y rebotes naturales
- **Interacción con mouse**: Arrastra letras para formar palabras
- **Palabras múltiples**: Cambia entre diferentes palabras objetivo
- **Diseño responsivo**: Funciona en diferentes tamaños de pantalla

## 🎮 Cómo jugar

1. Abre `index.html` en tu navegador
2. Observa la palabra objetivo en la parte superior
3. Arrastra las letras flotantes con el mouse para seleccionarlas en orden
4. Forma la palabra completa para ganar puntos
5. Las letras tienen física real: rebotan y colisionan entre sí

## 🛠️ Tecnologías

- **HTML5 Canvas**: Para el renderizado gráfico
- **Matter.js**: Motor de física 2D
- **Vanilla JavaScript**: Sin frameworks adicionales
- **CSS3**: Para estilos y animaciones

## 📁 Estructura del proyecto

```
Sopa de letras/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos y diseño
├── game.js         # Lógica del juego y física
└── README.md       # Este archivo
```

## 🎨 Detalles técnicos

### El Plato
- Dibujado con gradientes radiales para dar profundidad
- Paredes circulares creadas con segmentos físicos
- Sombras y efectos visuales para realismo

### Las Letras
- Cada letra es un cuerpo circular en Matter.js
- Renderizadas como texto en Canvas sobre círculos
- Colisionan y rebotan entre sí
- Se pueden arrastrar con el mouse

### Física
- Gravedad ligera (0.3) para movimiento natural
- Restitución 0.6 para rebotes suaves
- Fricción baja para deslizamiento fluido
- Impulsos aleatorios al iniciar

## 🚀 Para empezar

Simplemente abre el archivo `index.html` en cualquier navegador moderno. No requiere servidor ni instalación.

## 🎨 Personalización

¿Quieres cambiar las palabras del juego? ¡Es súper fácil!

1. Abre el archivo `game.js`
2. Busca la línea que dice `const words = [...]`
3. Cambia las palabras por las que quieras
4. Guarda y recarga la página

**Ejemplos de temas:**
- 🐶 Animales: `['PERRO', 'GATO', 'LEON', 'TIGRE', ...]`
- 🌍 Países: `['MEXICO', 'BRASIL', 'ESPAÑA', 'FRANCIA', ...]`
- 🎨 Colores: `['ROJO', 'AZUL', 'VERDE', 'AMARILLO', ...]`

Para más detalles, consulta el archivo **[PERSONALIZACION.md](PERSONALIZACION.md)** 📖

## 🎯 Futuras mejoras

- [ ] Soporte táctil para dispositivos móviles
- [ ] Efectos de partículas al encontrar palabras
- [ ] Niveles de dificultad
- [ ] Temporizador y puntuaciones
- [ ] Sonidos (sin archivos, con Web Audio API)
- [ ] Modo multijugador

## 📝 Licencia

Proyecto libre para uso educativo y personal.

---

¡Disfruta tu sopa de letras! 🍜✨

