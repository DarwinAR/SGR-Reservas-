# SGR Reservas - Universidad Cooperativa de Colombia (UCC)

Sistema de Gestión de Reservas de espacios académicos desarrollado como proyecto universitario para la **Universidad Cooperativa de Colombia**.

---

## Tabla de Contenido

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [¿Qué son los Tokens CSS?](#qué-son-los-tokens-css)
3. [¿Cómo funcionan los CSS?](#cómo-funcionan-los-css)
4. [¿Cómo funciona el Responsive?](#cómo-funciona-el-responsive)
5. [¿Cómo funcionan los JS?](#cómo-funcionan-los-js)
6. [¿Cómo funcionan las clases en el HTML?](#cómo-funcionan-las-clases-en-el-html)
7. [Cómo Ejecutar](#cómo-ejecutar)

---

## Estructura del Proyecto

```
SGR-Reservas-/
│
├── server.js                    # Servidor Express + conexión a MongoDB
├── package.json                 # Dependencias del proyecto (Express, Mongoose)
│
├── public/                      # Archivos estáticos servidos por Express
│   │
│   ├── index.html               # Página de inicio
│   ├── reservas.html            # Formulario para crear una reserva
│   ├── reservados.html          # Listado de reservas existentes
│   │
│   ├── assets/                  # Recursos estáticos (imágenes, íconos)
│   │   └── images/
│   │
│   ├── css/                     # Hojas de estilo organizadas por capas
│   │   ├── tokens.css           # Importa todos los tokens (este es el puente)
│   │   ├── base.css             # Reset CSS y estilos globales
│   │   ├── components.css       # Componentes reutilizables (botones, cards)
│   │   ├── navbar.css           # Estilos del navbar (desktop + mobile)
│   │   ├── index.css            # Estilos de la página de inicio
│   │   ├── reservas.css         # Estilos del formulario de reservas
│   │   ├── reservados.css       # Estilos del listado de reservados
│   │   │
│   │   └── tokens/              # Variables CSS (los "tokens de diseño")
│   │       ├── _colors.css      # Colores institucionales + neutrales
│   │       ├── _typography.css  # Fuentes, tamaños y pesos
│   │       ├── _spacing.css     # Espaciados (margin, padding, gap)
│   │       ├── _borders.css     # Bordes y radios
│   │       ├── _shadows.css     # Sombras y elevaciones
│   │       └── _surfaces.css    # Fondos y colores de texto
│   │
│   └── js/                      # Lógica del lado del cliente
│       ├── carousel.js          # Carrusel automático del index
│       ├── navbar.js            # Menú hamburguesa (mobile)
│       ├── reservas.js          # Lógica del formulario + validación con DB
│       └── reservados.js        # Lógica del listado + filtros + paginación
│
└── README.md
```

---

## ¿Qué son los Tokens CSS?

### La idea simple

Los **tokens** son variables CSS. En vez de escribir un color directamente (como `#00abc8`), le ponemos un **nombre** y lo reutilizamos en todas partes.

### ¿Por qué se usa `--` antes del nombre?

Así funciona CSS. Para crear una variable en CSS se **debe** usar el prefijo `--`. Es la sintaxis oficial:

```css
/* Declarar la variable (en tokens/_colors.css) */
:root {
  --color-primary-500: #00abc8;
}

/* Usarla en cualquier otro CSS */
.boton {
  background-color: var(--color-primary-500);
}
```

- **`--`** → Le dice al navegador "esto es una variable CSS"
- **`var()`** → Le dice al navegador "quiero usar el valor de esa variable"

### ¿Qué es `:root`?

Es el elemento raíz del documento (el `<html>`). Cuando declaras una variable dentro de `:root`, queda **disponible en toda la página**. Por eso sólo necesitas definirlas una vez.

### ¿Por qué sólo se definen en la carpeta `tokens/` y ya sirven en todos lados?

Porque el archivo `tokens.css` importa todos los archivos de la carpeta `tokens/`:

```css
/* tokens.css */
@import url('./tokens/_colors.css');
@import url('./tokens/_typography.css');
@import url('./tokens/_spacing.css');
@import url('./tokens/_borders.css');
@import url('./tokens/_shadows.css');
@import url('./tokens/_surfaces.css');
```

Y en el HTML cargamos `tokens.css` **antes** que los demás CSS:

```html
<link rel="stylesheet" href="css/tokens.css">    <!-- 1° Se cargan las variables -->
<link rel="stylesheet" href="css/base.css">       <!-- 2° Después las usamos -->
<link rel="stylesheet" href="css/components.css"> <!-- 3° Y aquí también -->
```

Al cargar primero `tokens.css`, todas las variables quedan disponibles para cualquier CSS que venga después. **No necesitas importar tokens en cada archivo CSS individual.**

### ¿Para qué sirven?

| Problema sin tokens | Solución con tokens |
|---------------------|---------------------|
| Quieres cambiar el azul de la marca → tienes que buscar en 20 archivos y cambiar `#00abc8` en cada uno | Cambias sólo `--color-primary-500` en `_colors.css` y se actualiza en toda la app |
| No recuerdas qué tamaño de letra usar → cada dev pone un valor diferente | Todos usan `var(--font-size-md)` y queda consistente |
| Los paddings son distintos en cada componente | Todos usan `var(--spacing-4)` y se ve uniforme |

### Archivos de tokens y qué contiene cada uno

| Archivo | Qué guarda | Ejemplo |
|---------|-----------|---------|
| `_colors.css` | Todos los colores del proyecto | `--color-primary-500: #00abc8` |
| `_typography.css` | Fuentes, tamaños y pesos de texto | `--font-size-lg: 1.125rem` |
| `_spacing.css` | Espaciados (márgenes, paddings) | `--spacing-4: 1rem` (16px) |
| `_borders.css` | Bordes y esquinas redondeadas | `--border-radius-lg: 12px` |
| `_shadows.css` | Sombras para dar profundidad | `--shadow-md: 0 4px 12px ...` |
| `_surfaces.css` | Fondos y colores de texto | `--surface-bg-card: #ffffff` |

---

## ¿Cómo funcionan los CSS?

### Orden de carga (capas)

Los CSS se cargan en este orden específico y **importa el orden**:

1. **`tokens.css`** → Define las variables (colores, tamaños, etc.)
2. **`base.css`** → Resetea estilos del navegador y aplica valores por defecto (fuente, color de fondo, etc.)
3. **`components.css`** → Estilos de componentes reutilizables (botones, tarjetas, formularios)
4. **`navbar.css`** → Estilos del menú de navegación (desktop y mobile)
5. **`[pagina].css`** → Estilos específicos de cada página (`index.css`, `reservas.css`, etc.)

### ¿Qué hace cada CSS?

**`base.css`** — Aplica un "reset" para que todos los navegadores empiecen iguales:
```css
*, *::before, *::after {
  margin: 0;       /* Quita márgenes por defecto */
  padding: 0;      /* Quita paddings por defecto */
  box-sizing: border-box;  /* El padding no agranda el elemento */
}
```
También configura la fuente y color base usando tokens.

**`components.css`** — Define clases reutilizables como `.btn-primary`, `.card`, `.form-input`. Si necesitas un botón en cualquier página, sólo le pones la clase.

**`navbar.css`** — Tiene los estilos del menú de navegación. Contiene dos versiones: una para desktop (`.navbar-links`) y otra para mobile (`.navbar-mobile`).

**`index.css` / `reservas.css` / `reservados.css`** — Estilos únicos de cada página que no se comparten con las demás.

---

## ¿Cómo funciona el Responsive?

### El concepto

"Responsive" significa que la página se adapta al tamaño de pantalla. Usamos **`@media` queries** para detectar si la pantalla es pequeña (celular) o grande (computador).

### ¿Cómo se aplica en este proyecto?

Usamos una clase para **desktop** y otra para **mobile**. Ejemplo del navbar:

```html
<!-- Versión desktop (se ve en computador) -->
<div class="navbar-links">
    <a href="index.html" class="nav-link active">Inicio</a>
    <a href="reservas.html" class="nav-link">Reservar</a>
</div>

<!-- Versión mobile (se ve en celular) -->
<div class="navbar-mobile" id="navbar-mobile">
    <a href="index.html" class="nav-link-mobile active">Inicio</a>
    <a href="reservas.html" class="nav-link-mobile">Reservar</a>
</div>

<!-- Botón hamburguesa (solo se ve en mobile) -->
<button class="navbar-hamburger" id="navbar-hamburger">
    <span></span><span></span><span></span>
</button>
```

### ¿Cómo se ocultan y muestran?

En el CSS usamos `@media (max-width: 768px)` que significa "cuando la pantalla sea de 768px o menos (celular)":

```css
/* Por defecto (desktop): links visibles, hamburguesa oculta */
.navbar-links      { display: flex; }   /* Se ve */
.navbar-hamburger  { display: none; }   /* No se ve */
.navbar-mobile     { display: none; }   /* No se ve */

/* En mobile (≤768px): links ocultos, hamburguesa visible */
@media (max-width: 768px) {
  .navbar-links     { display: none; }  /* Se oculta */
  .navbar-hamburger { display: flex; }  /* Aparece */
}
```

### ¿Por qué dos clases separadas (`.nav-link` y `.nav-link-mobile`)?

Porque el **diseño es diferente**:
- **Desktop (`.nav-link`)**: Los links van en fila horizontal con padding pequeño
- **Mobile (`.nav-link-mobile`)**: Los links van en columna vertical, son más grandes para tocarlos con el dedo

### Otro ejemplo: la página de reservas

En desktop muestra una imagen a la izquierda (55%) y el formulario a la derecha (45%). En mobile la imagen se oculta y el formulario ocupa el 100%:

```css
/* Desktop: imagen visible, panel flotante a la derecha */
.reservas-imagen { width: 55%; }
.reservas-panel  { width: calc(45% - 40px); position: absolute; right: 20px; }

/* Mobile: imagen oculta, formulario ocupa todo */
@media (max-width: 768px) {
  .reservas-imagen { display: none; }
  .reservas-panel  { width: 100%; position: relative; }
}
```

---

## ¿Cómo funcionan los JS?

### `navbar.js` — Menú hamburguesa

Hace que el botón hamburguesa abra/cierre el menú mobile:

```
1. Usuario toca el botón hamburguesa
2. Se agrega/quita la clase "open" al botón y al menú
3. La clase "open" en CSS hace que el menú se muestre (display: flex)
4. Si el usuario toca fuera del menú, se cierra automáticamente
```

### `carousel.js` — Carrusel automático

Controla las imágenes del hero en la página de inicio:

| Función | Qué hace |
|---------|----------|
| `goToSlide(index)` | Cambia al slide indicado (quita `.active` del actual, lo pone al nuevo) |
| `nextSlide()` | Avanza al siguiente slide |
| `prevSlide()` | Retrocede al slide anterior |
| `startAutoSlide()` | Inicia un temporizador que cambia de slide cada 5 segundos |
| `resetAutoSlide()` | Reinicia el temporizador cuando el usuario interactúa manualmente |

### `reservas.js` — Formulario de reservas (el más complejo)

Este JS maneja todo el flujo de crear una reserva. Tiene varias responsabilidades:

#### 1. Custom Hour Picker (selector de hora personalizado)

El `<select>` nativo de HTML se ve feo, así que se crea un **dropdown visual** encima:

```
- crearHoraPicker(selectEl): Crea el picker visual para un <select> de hora
- llenarHorasInicio(): Genera las opciones de 6 AM a 9 PM
- llenarHorasFin(): Genera opciones solo DESPUÉS de la hora de inicio seleccionada
```

Cuando seleccionas una hora de inicio, se generan las horas de fin que sean **posteriores** (no te deja poner una hora de fin antes de la de inicio).

#### 2. Validación de campos

Antes de enviar el formulario, se verifica que todos los campos obligatorios estén llenos:

```
- validarCampo(campo): Revisa si un campo tiene valor. Si está vacío, le agrega la clase
  "invalido" (borde rojo) y muestra el mensaje de error.
- validarFormulario(): Recorre TODOS los campos requeridos y valida cada uno.
  También verifica que hora_fin > hora_inicio.
```

#### 3. Verificación con la base de datos (¿la hora está ocupada?)

**Así es como sabemos si un horario está ocupado:**

```
1. Se llama a verificarDisponibilidad(espacio, fecha, horaInicio, horaFin)
2. Esta función hace un GET a /api/reservas (trae TODAS las reservas de la DB)
3. Filtra las reservas que coincidan en: mismo espacio + misma fecha
4. Verifica si hay CRUCE de horario: horaInicio < r.hora_fin && horaFin > r.hora_inicio
5. Si hay cruce → retorna los conflictos
```

La lógica del cruce funciona así: dos reservas se cruzan si el inicio de una es antes del fin de la otra Y el fin de una es después del inicio de la otra.

**¿Qué pasa si está ocupado?**

```
1. Se llama a obtenerHorasOcupadas() → trae todas las reservas de esa sala en esa fecha
2. Se llama a calcularDisponibles() → compara todas las horas posibles (6-21) contra las
   ocupadas y devuelve las que están libres
3. Se muestra un MODAL con: "Esta sala ya está reservada en X horario"
   + una lista de horarios disponibles para que el usuario escoja otro
```

#### 4. Envío de la reserva

```
1. Usuario hace clic en "Confirmar Reserva"
2. Se valida el formulario (campos llenos, hora fin > hora inicio)
3. Se verifica disponibilidad contra la DB
4. Si hay conflicto → se muestra el modal y NO se envía
5. Si está libre → se hace POST a /api/reservas con los datos
6. Si el servidor responde OK → se muestra la pantalla de éxito
```

### `reservados.js` — Listado de reservas

Este JS muestra todas las reservas existentes con filtros y paginación:

| Función | Qué hace |
|---------|----------|
| `cargarReservas()` | Hace `GET /api/reservas` y guarda el resultado |
| `aplicarFiltros()` | Filtra por texto (busca en actividad, usuario, nombre sala) y/o por sala |
| `renderizar()` | Muestra las tarjetas de la página actual (máx. 10 por página) |
| `crearTarjeta(reserva)` | Crea el HTML de una tarjeta con la info de la reserva |
| `renderizarPaginacion()` | Muestra los botones de página (1, 2, 3... Anterior, Siguiente) |

**Flujo:**
```
1. Al cargar la página → cargarReservas() trae todo de la DB
2. Se guardan en datosOriginales[]
3. Se aplican filtros → resultado en datosFiltrados[]
4. Se muestra solo la página actual (10 items por página)
5. Si el usuario escribe en el buscador o cambia el filtro de sala → se re-filtra y re-renderiza
```

---

## ¿Cómo funcionan las clases en el HTML?

### ¿Qué es una clase CSS?

Una clase es un **nombre** que le pones a un elemento HTML para darle estilos. En vez de escribir CSS directamente en el elemento (inline), le pones una clase y los estilos se aplican automáticamente.

### ¿Por qué NO se usa CSS inline (style="")?

```html
<!-- ❌ MAL: CSS inline (no hagas esto) -->
<button style="background: #00abc8; color: white; padding: 12px 24px; border-radius: 8px;">
  Reservar
</button>

<!-- ✅ BIEN: Usando una clase -->
<button class="btn-primary">Reservar</button>
```

**Razones:**
- **Reutilización** → La clase `btn-primary` se puede usar en 50 botones sin repetir código
- **Mantenimiento** → Si quieres cambiar el color del botón, lo cambias en UN solo lugar (el CSS), no en 50 HTMLs
- **Separación** → El HTML define la **estructura**, el CSS define la **apariencia**. No se mezclan.

### ¿Cómo se leen las clases en este proyecto?

Las clases siguen un patrón de **nombres descriptivos**:

```html
<!-- El nombre de la clase te dice QUÉ ES y DÓNDE VA -->
<nav class="navbar">              <!-- Es un navbar -->
<div class="navbar-brand">        <!-- Es la marca dentro del navbar -->
<a class="nav-link active">       <!-- Es un link de navegación + está activo -->
<div class="carousel-slide">      <!-- Es un slide del carrusel -->
<div class="reserva-card">        <!-- Es una tarjeta de reserva -->
<span class="campo-error">        <!-- Es el mensaje de error de un campo -->
```

### Ejemplo real del HTML de index.html

```html
<section class="hero-carousel">         <!-- Sección tipo carrusel hero -->
    <div class="carousel-container">     <!-- Contenedor del carrusel -->
        <div class="carousel-slide active">  <!-- Un slide (active = el visible) -->
            <img src="..." alt="...">
            <div class="carousel-overlay">   <!-- Capa oscura encima de la imagen -->
                <h1>Bienvenido...</h1>
            </div>
        </div>
    </div>
</section>
```

Cada clase tiene sus estilos definidos en `index.css`. El HTML **no tiene estilos inline** porque todo se controla desde los archivos CSS.

### Clases con estado (se agregan/quitan con JS)

Algunas clases se **agregan o quitan dinámicamente** con JavaScript:

| Clase | Se agrega cuando... | Efecto visual |
|-------|---------------------|---------------|
| `.active` | Un slide o link está seleccionado | Se muestra (opacity: 1) |
| `.open` | El menú mobile o un dropdown está abierto | Se hace visible (display: flex/block) |
| `.invalido` | Un campo no pasó la validación | Borde rojo + fondo rosado |
| `.visible` | Hay un mensaje de error que mostrar | El mensaje aparece |

---

## Cómo Ejecutar

### Requisitos previos

- **Node.js** (v18 o superior)
- **MongoDB** corriendo localmente en el puerto por defecto (27017)

### Instalación

```bash
npm install
```

### Ejecución

```bash
node server.js
```

El servidor se levanta en **http://localhost:3000**.

### Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` o `/index.html` | Página de inicio con carrusel e info |
| `/reservas.html` | Formulario para crear una nueva reserva |
| `/reservados.html` | Listado de todas las reservas con filtros |

### API REST (cómo se comunica el frontend con la base de datos)

El frontend (JS en el navegador) habla con el backend (server.js) a través de estas rutas:

| Método | Endpoint | Qué hace | Quién lo usa |
|--------|----------|----------|--------------|
| `POST` | `/api/reservas` | Guarda una nueva reserva en MongoDB | `reservas.js` al confirmar |
| `GET` | `/api/reservas` | Devuelve TODAS las reservas | `reservas.js` (verificar conflictos) y `reservados.js` (listar) |

### Flujo completo de una reserva

```
1. Usuario llena el formulario en reservas.html
2. Hace clic en "Confirmar Reserva"
3. reservas.js VALIDA los campos (sin hablar con la DB todavía)
4. reservas.js hace GET /api/reservas para VERIFICAR disponibilidad
5. Si hay conflicto → muestra modal con horarios disponibles
6. Si está libre → hace POST /api/reservas con los datos
7. server.js recibe el POST → guarda en MongoDB → responde OK
8. reservas.js muestra la pantalla de éxito
```

---

> **Proyecto académico** - Universidad Cooperativa de Colombia (UCC)
