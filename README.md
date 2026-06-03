# Crisis Economics Simulator

## 📌 Descripción General

**Crisis Economics Simulator** es una aplicación web educativa interactiva que simula tres escenarios de crisis socioeconómica, permitiendo a estudiantes y usuarios comprender cómo las variables económicas impactan la realidad de una sociedad.

## 🎯 Objetivos del Proyecto

1. **Educativo**: Enseñar modelado matemático y análisis de impacto económico
2. **Interactivo**: Permitir experimentar con diferentes escenarios y ver resultados en tiempo real
3. **Relevante**: Abordar crisis reales que afectan a economías en desarrollo
4. **Accesible**: Diseño responsivo que funciona en cualquier dispositivo

## 📁 Estructura de Carpetas

```
proyecto-web-crisis/
│
├── index.html                          # Página principal - Portal de bienvenida
│
├── pages/                              # Carpeta con páginas individuales
│   ├── carburantes.html               # Simulador de Carburantes (Escenario A)
│   ├── escasez.html                   # Simulador de Pánico de Compras (Escenario E)
│   └── poder-adquisitivo.html         # Simulador de Poder Adquisitivo (Escenario F)
│
├── css/                                # Estilos
│   └── estilos.css                    # CSS personalizado (colores grises, azules, rojos)
│
├── js/                                 # Scripts JavaScript
│   ├── main.js                        # Funciones globales y utilidades
│   ├── carburantes.js                 # Lógica del Escenario A
│   ├── escasez.js                     # Lógica del Escenario E
│   └── poder-adquisitivo.js           # Lógica del Escenario F
│
├── img/                                # Imágenes (opcional)
│   └── [imágenes del proyecto]
│
└── README.md                           # Este archivo
```

## 🎨 Características de Diseño

### Paleta de Colores
- **Azules**: #2563eb (principal), #0891b2 (info), #1e40af (oscuro)
- **Rojos**: #dc2626 (peligro), #ef4444 (alerta)
- **Grises**: #1f2937 a #f9fafb (escala completa)

### Responsividad
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

### Tecnologías Utilizadas
- **HTML5** con semántica completa
- **CSS3** con variables, gradientes y animaciones
- **JavaScript Vanilla** (sin dependencias)
- **Bootstrap 5.3** para componentes y grid
- **Chart.js 4.4** para gráficos interactivos

## 📊 Los Tres Escenarios

### 🛢️ Escenario A: Simulador de Abastecimiento de Carburantes

**Situación**: Una estación de servicio enfrenta escasez de combustible debido a limitaciones de importación.

**Variables de Entrada**:
- Reserva inicial de carburante (litros)
- Consumo diario estimado (litros)
- Reabastecimiento diario disponible (litros)
- Nivel crítico de reserva (litros)

**Modelo Matemático**:
```
Reserva_final = Reserva_inicial + Reabastecimiento - Consumo
```

**Cálculos Realizados**:
- Proyección diaria de autonomía
- Día exacto cuando se alcanza nivel crítico
- Comparativa entre consumo normal y alto
- Tabla de 30 días de operación
- Gráfico de tendencia de reservas

**Casos de Estudio**:
1. Escasez Moderada: 9 días hasta nivel crítico
2. Crisis Severa: 3 días hasta nivel crítico
3. Estabilidad Relativa: Proyecto sin crisis

---

### 🛒 Escenario E: Simulador de Pánico de Compras por Escasez

**Situación**: Los rumores de escasez generan comportamiento irracional de compra que crea la crisis real.

**Variables de Entrada**:
- Demanda comercial normal (unidades)
- Porcentaje de aumento por pánico (%)
- Stock total disponible en almacén (unidades)
- Número de personas/familias comprando

**Modelo Matemático**:
```
Nueva_Demanda = Demanda_Normal + (Demanda_Normal × %_Aumento)
Déficit = Nueva_Demanda - Stock_Disponible
```

**Cálculos Realizados**:
- Nueva demanda total con pánico
- Detección de desabastecimiento
- Unidades faltantes (déficit)
- Compra promedio por persona
- Número de personas insatisfechas
- Duración del stock disponible

**Casos de Estudio**:
1. Pánico Leve: 20% aumento, stock suficiente
2. Pánico Moderado: 40% aumento, déficit de 20 unidades
3. Pánico Masivo: 80% aumento, crisis total

---

### 💰 Escenario F: Simulador de Pérdida del Poder Adquisitivo

**Situación**: Una familia mantiene ingresos fijos mientras la inflación erosiona su poder de compra.

**Variables de Entrada**:
- Ingreso familiar mensual (Bs)
- Gasto anterior (Bs)
- Gasto actual (Bs)
- Precios de productos de canasta básica (antes/después)
- Cantidades de productos comprados

**Modelo Matemático**:
```
Incremento_Gasto = Gasto_Actual - Gasto_Anterior
Pérdida_Porcentaje = (Incremento_Gasto / Gasto_Anterior) × 100
Nivel_Afectación = clasificar(Pérdida_Porcentaje)
```

**Cálculos Realizados**:
- Incremento total de gastos
- Porcentaje de pérdida del poder adquisitivo
- Comparativa de saldos (antes vs después)
- Clasificación automática (Bajo/Moderado/Crítico/Emergencia)
- Análisis por producto con impacto individual
- Proyección a 6 meses

**Casos de Estudio**:
1. Inflación Moderada: 11% aumento (saldo reducido pero viable)
2. Inflación Severa: 33% aumento (situación complicada)
3. Crisis Total: 60% aumento (ingresos insuficientes)

## 🔧 Funcionalidades Técnicas

### Validación de Formularios
```javascript
// Se valida que todos los campos:
- No estén vacíos
- Sean números válidos
- Sean positivos (>= 0)
```

### Visualización de Datos
- **Tarjetas HTML**: Para resultados principales
- **Tablas Interactivas**: Con formato y colores según contexto
- **Gráficos Chart.js**: Líneas, barras y comparativas
- **Indicadores**: Paneles de información clave

### Casos de Estudio Predefinidos
Cada simulador incluye 3 casos con datos fijos para verificar funcionamiento:
- Botones para cargar casos automáticamente
- Los campos se rellenan instantáneamente
- La simulación se ejecuta automáticamente

## 📱 Secciones Requeridas (Todas Implementadas)

1. **✅ Inicio**: Página principal con portal de navegación
2. **✅ Contexto**: Explicación de crisis socioeconómica
3. **✅ Simulador**: Formularios interactivos con validación
4. **✅ Resultados**: Área dinámica con inyección DOM
5. **✅ Casos de Estudio**: Ejemplos predefinidos verificables
6. **✅ Conclusiones**: Aprendizajes y reflexiones
7. **✅ Créditos**: Información del estudiante/grupo

## 🎓 Criterios de Evaluación

| Componente | Puntos | Estado |
|-----------|--------|--------|
| Bootstrap/CSS y Responsividad | 21 | ✅ Completo |
| Lógica JavaScript y DOM | 37 | ✅ Completo |
| Casos de Estudio e Infraestructura | 18 | ✅ Completo |
| Repositorio y Publicación | 14 | ⏳ Pendiente |
| **TOTAL** | **105** | - |

## 🚀 Cómo Usar

### Instalación Local

1. **Clonar o descargar** el proyecto
2. **Abrir `index.html`** en un navegador web
3. **Navegar** usando la barra de menú superior
4. **Ingresar datos** o **cargar casos predefinidos**
5. **Ver resultados** actualizarse en tiempo real

### Publicación en Internet

#### Opción 1: GitHub Pages
```bash
git init
git add .
git commit -m "Inicial"
git remote add origin https://github.com/tu-usuario/proyecto-web-crisis.git
git push -u origin main
```
Luego en GitHub Settings > Pages > seleccionar rama main

#### Opción 2: Netlify
1. Ir a https://netlify.com
2. Conectar repositorio GitHub
3. Auto-deploy en cada push

#### Opción 3: Vercel
1. Ir a https://vercel.com
2. Importar proyecto
3. Publicar automáticamente

## 📚 Modelos Matemáticos Implementados

### Carburantes
```
Día i: Reserva[i] = Reserva[i-1] + Reabastecimiento - Consumo
```
**Complejidad**: O(n) donde n = días a proyectar

### Pánico de Compras
```
Demanda = Demanda_Base × (1 + Porcentaje_Pánico)
Cobertura_Días = Stock / Demanda
```
**Complejidad**: O(1)

### Poder Adquisitivo
```
Pérdida% = ((Gasto_Actual - Gasto_Anterior) / Gasto_Anterior) × 100
Saldo_Impacto = (Ingreso - Gasto_Actual) - (Ingreso - Gasto_Anterior)
```
**Complejidad**: O(p) donde p = número de productos

## 🎨 Personalización

### Cambiar Colores
En `css/estilos.css`, modificar las variables CSS:
```css
:root {
    --color-primary: #2563eb;      /* Cambiar aquí */
    --color-danger: #dc2626;       /* Cambiar aquí */
    --color-gray-900: #111827;     /* Cambiar aquí */
}
```

### Agregar Productos Automáticos
En `poder-adquisitivo.html`, modificar `casosPredefinidos`:
```javascript
caso1: {
    productos: [
        { nombre: 'Nuevo Producto', precioAnterior: 10, precioActual: 15, cantidad: 5 }
    ]
}
```

## 🐛 Solución de Problemas

### Gráficos No Aparecen
- Verificar que Chart.js esté cargado: `https://cdn.jsdelivr.net/npm/chart.js`
- Comprobar que haya datos en la simulación

### Estilos No Carguen
- Verificar ruta correcta a `css/estilos.css`
- En Firefox: Ctrl+Shift+R para limpiar caché

### Bootstrap No Funciona
- Verificar CDN: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.0`
- Comprobar conexión a internet

## 📞 Contacto y Soporte

**Proyecto**: Crisis Economics Simulator
**Materia**: Programación Web I
**Estudiante**: [Tu Nombre Aquí]
**Año**: 2024

---

## ✨ Características Adicionales Implementadas

Más allá de los requisitos mínimos:

1. **🎨 Diseño Profesional**: Gradientes, animaciones sutiles y paleta coherente
2. **📊 Gráficos Interactivos**: Chart.js con múltiples tipos
3. **📱 Totalmente Responsivo**: Tested en móvil, tablet y desktop
4. **⚡ Validación Completa**: Campos, tipos de datos, valores negativos
5. **🎯 Casos Predefinidos**: 3 casos por simulador con variaciones realistas
6. **💾 Cálculos Proyectivos**: Simulación a múltiples períodos (30-120 días)
7. **🎓 Contexto Educativo**: Explicaciones detalladas de cada crisis
8. **♿ Accesibilidad**: Semántica HTML5 correcta y contraste WCAG AA

---

**Última actualización**: Junio 2024
**Versión**: 1.0 - Completa y Funcional
