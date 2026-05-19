# SGR Reservas - Universidad Cooperativa de Colombia (UCC)

Sistema de Gestión de Reservas de espacios académicos desarrollado como proyecto universitario para la **Universidad Cooperativa de Colombia**.

---

## Tabla de Contenido

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Sistema de Diseño (Design Tokens)](#sistema-de-diseño-design-tokens)
3. [Paleta de Colores](#paleta-de-colores)
4. [Tipografía](#tipografía)
5. [Clases Utilitarias](#clases-utilitarias)
6. [Cómo Ejecutar](#cómo-ejecutar)

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
│   │       └── logo_ucc.png     # Logo oficial de la UCC (usado como favicon)
│   │
│   ├── css/                     # Hojas de estilo organizadas por capas
│   │   ├── tokens.css           # Archivo central que importa todos los tokens
│   │   ├── base.css             # Reset CSS y estilos globales base
│   │   ├── components.css       # Componentes reutilizables (botones, cards, forms)
│   │   ├── index.css            # Estilos específicos de la página de inicio
│   │   ├── reservas.css         # Estilos específicos del formulario de reservas
│   │   ├── reservados.css       # Estilos específicos del listado de reservados
│   │   │
│   │   └── tokens/              # Tokens de diseño (variables CSS)
│   │       ├── _colors.css      # Paleta de colores institucionales + neutrales
│   │       ├── _typography.css  # Familias, tamaños, pesos y alturas de línea
│   │       ├── _spacing.css     # Escala de espaciado (margin, padding, gap)
│   │       ├── _borders.css     # Grosor, radio y color de bordes
│   │       ├── _shadows.css     # Niveles de elevación y sombras
│   │       └── _surfaces.css    # Colores de fondo y texto sobre superficies
│   │
│   └── js/                      # Lógica del lado del cliente
│       ├── reservas.js          # Lógica del formulario de reservas (POST a la API)
│       └── reservados.js        # Lógica del listado de reservas (GET de la API)
│
└── README.md                    # Este archivo
```

### ¿Por qué esta estructura de carpetas?

| Carpeta | Justificación |
|---------|---------------|
| `assets/images/` | Separa los recursos gráficos del código, facilitando su mantenimiento y reemplazo. |
| `css/tokens/` | Centraliza las **variables de diseño** en un solo lugar. Si se necesita cambiar un color o un tamaño, se cambia en un solo archivo y se refleja en toda la aplicación. |
| `css/` (raíz) | Contiene los estilos organizados por **capas**: primero tokens, luego base, después componentes, y finalmente estilos específicos de cada página. |
| `js/` | Agrupa toda la lógica del cliente. Cada archivo JS corresponde a una página HTML específica. |

Esta organización sigue el principio de **separación de responsabilidades**: cada archivo tiene un propósito claro y no mezcla funcionalidades.

---

## Sistema de Diseño (Design Tokens)

Los **Design Tokens** son variables CSS que almacenan las decisiones de diseño visual del proyecto. En lugar de usar colores, tamaños o fuentes arbitrarias, se utilizan estas variables para garantizar **consistencia** en toda la interfaz.

### ¿Por qué usar tokens?

- **Consistencia visual**: Todos los componentes usan los mismos valores.
- **Mantenimiento fácil**: Cambiar un color institucional en un solo lugar lo actualiza en todo el sistema.
- **Escalabilidad**: Agregar nuevas páginas o componentes es sencillo porque ya existen las reglas definidas.
- **Comunicación clara**: Cualquier miembro del equipo entiende qué significa `--color-primary-500` o `--surface-bg-card`.

### Archivos de tokens

| Archivo | Contenido |
|---------|-----------|
| `_colors.css` | Paleta completa de colores: primarios, secundarios, de acento y neutrales, cada uno con 10 niveles de intensidad (50–900). |
| `_typography.css` | Familias tipográficas, escala de tamaños (xs a 4xl), pesos (regular a bold), alturas de línea y clases utilitarias `.label-*`. |
| `_spacing.css` | Escala de espaciado basada en múltiplos de 4px, más alias semánticos como `--spacing-card-pad`. |
| `_borders.css` | Grosor de bordes (thin, medium, thick), radios (sm a full), colores de borde semánticos y clases utilitarias. |
| `_shadows.css` | Sombras de elevación (xs a xl), sombras con color de marca, y anillos de focus. |
| `_surfaces.css` | Colores de fondo para cada nivel de la interfaz (base, surface, card, elevated) y colores de texto correspondientes. |

---

## Paleta de Colores

Basada en el **logo oficial de la Universidad Cooperativa de Colombia**:

| Token | Código HEX | Uso |
|-------|-----------|-----|
| `--color-primary-500` | `#00abc8` | **Azul verdoso (Teal)** - Color principal de la marca. Usado en encabezados, botones principales y acentos. |
| `--color-secondary-500` | `#80ba26` | **Verde** - Color secundario. Usado en botones alternativos y elementos de éxito. |
| `--color-accent-500` | `#cad401` | **Amarillo verdoso** - Color de acento. Usado para resaltar información o badges. |

Cada color tiene **10 niveles** de intensidad (50 = más claro, 900 = más oscuro) para cubrir todos los casos de uso: fondos suaves, bordes, texto, hover states, etc.

### Neutrales

Los grises se usan para fondos, bordes, texto secundario y elementos deshabilitados:

| Token | Código HEX | Uso |
|-------|-----------|-----|
| `--color-neutral-50` | `#f8f9fa` | Fondo base de la página |
| `--color-neutral-200` | `#e9ecef` | Bordes sutiles |
| `--color-neutral-600` | `#6c757d` | Texto secundario / muted |
| `--color-neutral-900` | `#212529` | Texto principal |

---

## Tipografía

| Token | Valor | Descripción |
|-------|-------|-------------|
| `--font-family-primary` | Segoe UI, Roboto, sans-serif | Fuente principal del sistema |
| `--font-size-md` | 1rem (16px) | Tamaño base de texto |
| `--font-size-3xl` | 2rem (32px) | Títulos de página |
| `--font-weight-semibold` | 600 | Peso para labels y botones |

---

## Clases Utilitarias

### Tipografía (`.label-{tamaño}-{peso}`)

Combinan tamaño y peso en una sola clase para aplicar rápidamente:

```html
<p class="label-medium-medium">Texto base, peso medio</p>
<span class="label-small-regular">Texto pequeño, peso regular</span>
<h2 class="heading-medium">Título mediano</h2>
```

**Tamaños disponibles**: `xs`, `small`, `medium`, `large`, `xl`
**Pesos disponibles**: `regular`, `medium`, `semibold`, `bold`

### Bordes

```html
<div class="border-light rounded-md">Borde suave con esquinas medianas</div>
<div class="border-primary rounded-lg">Borde de color primario</div>
```

### Superficies (variables CSS)

```css
/* Ejemplo de uso en estilos propios */
.mi-componente {
  background-color: var(--surface-bg-card);      /* Fondo blanco de tarjeta */
  border: var(--border-width-thin) solid var(--border-fill-medium);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-card-pad);
  box-shadow: var(--shadow-md);
}
```

### Componentes predefinidos

| Clase | Descripción |
|-------|-------------|
| `.page-header` | Encabezado de página con fondo blanco y borde inferior |
| `.btn-primary` | Botón principal con gradiente del color primario UCC |
| `.btn-secondary` | Botón secundario con el verde institucional |
| `.btn-outline` | Botón con borde y fondo transparente |
| `.card` | Tarjeta con fondo blanco, sombra y hover animado |
| `.form-container` | Contenedor de formulario centrado con sombra |
| `.form-section` | Sección dentro de un formulario (agrupa campos) |
| `.form-input` / `.form-select` / `.form-textarea` | Campos de formulario con estilos consistentes |

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
| `/` o `/index.html` | Página de inicio con acceso a reservar |
| `/reservas.html` | Formulario para crear una nueva reserva |
| `/reservados.html` | Listado de todas las reservas existentes |

### API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/reservas` | Crea una nueva reserva |
| `GET` | `/api/reservas` | Obtiene todas las reservas |

---

> **Proyecto académico** - Universidad Cooperativa de Colombia (UCC)
