/* ===============================================
   SIMULADOR DE PODER ADQUISITIVO - PODER-ADQUISITIVO.JS
   Escenario F: Pérdida del Poder Adquisitivo
   =============================================== */

// Variables globales
let simulacionActual = null;
let productos = [];
let proximoIdProducto = 1;
let graficoPoderActual = null;  // Almacenar referencia del gráfico actual

// Casos de estudio predefinidos
const casosPredefinidos = {
    caso1: {
        nombre: 'Inflación Moderada',
        ingresoFamiliar: 2500,
        gastoAnterior: 1800,
        gastoActual: 2000,
        productos: [
            { id: 1, nombre: 'Arroz', precioAnterior: 8, precioActual: 9, cantidad: 10 },
            { id: 2, nombre: 'Papa', precioAnterior: 7, precioActual: 8, cantidad: 8 },
            { id: 3, nombre: 'Harina', precioAnterior: 5, precioActual: 6, cantidad: 5 }
        ]
    },
    caso2: {
        nombre: 'Inflación Severa',
        ingresoFamiliar: 2500,
        gastoAnterior: 1800,
        gastoActual: 2400,
        productos: [
            { id: 1, nombre: 'Arroz', precioAnterior: 8, precioActual: 11, cantidad: 10 },
            { id: 2, nombre: 'Papa', precioAnterior: 7, precioActual: 10, cantidad: 8 },
            { id: 3, nombre: 'Aceite', precioAnterior: 12, precioActual: 18, cantidad: 4 }
        ]
    },
    caso3: {
        nombre: 'Crisis Total',
        ingresoFamiliar: 2500,
        gastoAnterior: 2000,
        gastoActual: 3200,
        productos: [
            { id: 1, nombre: 'Arroz', precioAnterior: 8, precioActual: 14, cantidad: 10 },
            { id: 2, nombre: 'Papa', precioAnterior: 7, precioActual: 13, cantidad: 8 },
            { id: 3, nombre: 'Aceite', precioAnterior: 12, precioActual: 22, cantidad: 4 },
            { id: 4, nombre: 'Leche', precioAnterior: 9, precioActual: 16, cantidad: 6 }
        ]
    }
};

// Calcular simulación
function calcularSimulacion(ingresoFamiliar, gastoAnterior, gastoActual, productosLista) {
    // Cálculos básicos
    const incrementoGasto = gastoActual - gastoAnterior;
    const porcentajePerdida = ((gastoActual - gastoAnterior) / gastoAnterior) * 100;
    const saldoAnterior = ingresoFamiliar - gastoAnterior;
    const saldoActual = ingresoFamiliar - gastoActual;
    const pérdidaSaldo = saldoAnterior - saldoActual;
    
    // Clasificación de afectación
    let nivel, color, descripcion;
    if (porcentajePerdida < 10) {
        nivel = 'BAJO';
        color = 'success';
        descripcion = 'Afectación mínima al poder adquisitivo';
    } else if (porcentajePerdida < 25) {
        nivel = 'MODERADO';
        color = 'warning';
        descripcion = 'Afectación significativa - requiere ajustes';
    } else if (porcentajePerdida < 50) {
        nivel = 'CRÍTICO';
        color = 'danger';
        descripcion = 'Afectación severa - debe reducir gastos';
    } else {
        nivel = 'EMERGENCIA';
        color = 'danger';
        descripcion = 'Situación de crisis total - ingresos insuficientes';
    }
    
    // Análisis de productos
    let analisisProductos = [];
    let gastoAnteriorTotal = 0;
    let gastoActualTotal = 0;
    
    productosLista.forEach(p => {
        const gastoAntProd = p.precioAnterior * p.cantidad;
        const gastoActProd = p.precioActual * p.cantidad;
        const incrementoProd = gastoActProd - gastoAntProd;
        const porcentajeProd = ((gastoActProd - gastoAntProd) / gastoAntProd) * 100;
        
        gastoAnteriorTotal += gastoAntProd;
        gastoActualTotal += gastoActProd;
        
        analisisProductos.push({
            nombre: p.nombre,
            precioAnterior: p.precioAnterior,
            precioActual: p.precioActual,
            cantidad: p.cantidad,
            gastoAnterior: gastoAntProd,
            gastoActual: gastoActProd,
            incremento: incrementoProd,
            porcentaje: porcentajeProd
        });
    });
    
    // Proyectar impacto a 6 meses
    const proyeccion6meses = {
        gastoMensual: gastoActual * 6,
        incrementoTotal: incrementoGasto * 6,
        saldoDesaprovechado: pérdidaSaldo * 6
    };
    
    return {
        ingresoFamiliar,
        gastoAnterior,
        gastoActual,
        incrementoGasto,
        porcentajePerdida,
        saldoAnterior,
        saldoActual,
        pérdidaSaldo,
        nivel,
        color,
        descripcion,
        analisisProductos,
        gastoAnteriorTotal,
        gastoActualTotal,
        proyeccion6meses
    };
}

// Mostrar resultados
function mostrarResultados() {
    const resultadosContainer = document.getElementById('resultados-container');
    const tablaContainer = document.getElementById('tabla-productos');
    const clasificacionContainer = document.getElementById('clasificacion-container');
    
    // Recolectar datos
    const ingresoFamiliar = parseFloat(document.getElementById('ingresoFamiliar').value);
    const gastoAnterior = parseFloat(document.getElementById('gastoAnterior').value);
    const gastoActual = parseFloat(document.getElementById('gastoActual').value);
    
    // Validar datos básicos
    if (isNaN(ingresoFamiliar) || isNaN(gastoAnterior) || isNaN(gastoActual) || 
        ingresoFamiliar < 0 || gastoAnterior < 0 || gastoActual < 0) {
        resultadosContainer.innerHTML = mostrarAlerta('danger', 'Validación', 
            'Por favor completa los campos de ingreso y gastos con valores válidos.');
        return;
    }
    
    // Usar productos actuales o vacío
    const productosActuales = productos.length > 0 ? productos : [];
    
    // Calcular simulación
    simulacionActual = calcularSimulacion(
        ingresoFamiliar,
        gastoAnterior,
        gastoActual,
        productosActuales
    );
    
    // Resultados principales
    let html = '';
    
    if (simulacionActual.saldoActual < 0) {
        html += mostrarAlerta('danger', '🚨 CRISIS TOTAL', 
            `Los gastos superan los ingresos. Déficit mensual: ${formatearMoneda(Math.abs(simulacionActual.saldoActual))}`
        );
    } else if (simulacionActual.porcentajePerdida >= 25) {
        html += mostrarAlerta('danger', '⚠️ ALERTA CRÍTICA', 
            `Pérdida del poder adquisitivo del ${simulacionActual.porcentajePerdida.toFixed(1)}%. ` +
            `La familia necesita ${formatearMoneda(simulacionActual.incrementoGasto)} adicionales mensuales.`
        );
    } else {
        html += mostrarAlerta('warning', '⚠️ Inflación Detectada', 
            `Incremento del gasto del ${simulacionActual.porcentajePerdida.toFixed(1)}%.`
        );
    }
    
    html += crearTarjetaResultado('Ingreso Familiar', formatearMoneda(ingresoFamiliar), 'primary');
    html += crearTarjetaResultado('Gasto Anterior', formatearMoneda(gastoAnterior), 'primary');
    html += crearTarjetaResultado('Gasto Actual', formatearMoneda(gastoActual), 'primary');
    html += crearTarjetaResultado('Incremento de Gasto', formatearMoneda(simulacionActual.incrementoGasto), 'danger');
    html += crearTarjetaResultado('Pérdida Adquisitiva', `${simulacionActual.porcentajePerdida.toFixed(1)}%`, 'danger');
    
    resultadosContainer.innerHTML = html;
    
    // Actualizar indicadores
    document.getElementById('incremento-bs').textContent = formatearMoneda(simulacionActual.incrementoGasto);
    document.getElementById('perdida-porcentaje').textContent = `${simulacionActual.porcentajePerdida.toFixed(1)}%`;
    document.getElementById('saldo-anterior').textContent = formatearMoneda(simulacionActual.saldoAnterior);
    
    // CORRECCIÓN: Se cambió .textContent por .innerHTML para renderizar la etiqueta span correctamente
    document.getElementById('saldo-actual').innerHTML = 
        `<span style="color: ${simulacionActual.saldoActual < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">${formatearMoneda(simulacionActual.saldoActual)}</span>`;
    
    // Tabla de productos
    if (simulacionActual.analisisProductos.length > 0) {
        const encabezados = ['Producto', 'Precio Ant.', 'Precio Act.', 'Cantidad', 'Gasto Ant.', 'Gasto Act.', 'Incremento', 'Cambio %'];
        const datosTabla = simulacionActual.analisisProductos.map(p => [
            p.nombre,
            `Bs. ${formatearNumero(p.precioAnterior, 2)}`,
            `Bs. ${formatearNumero(p.precioActual, 2)}`,
            p.cantidad,
            `Bs. ${formatearNumero(p.gastoAnterior, 2)}`,
            `Bs. ${formatearNumero(p.gastoActual, 2)}`,
            `Bs. ${formatearNumero(p.incremento, 2)}`,
            `+${p.porcentaje.toFixed(1)}%`
        ]);
        
        tablaContainer.innerHTML = crearTabla(encabezados, datosTabla);
    } else {
        tablaContainer.innerHTML = '<p class="text-muted text-center py-4">Agrega productos para ver análisis detallado</p>';
    }
    
    // Clasificación
    let htmlClasificacion = `
        <div class="alert alert-${simulacionActual.color} border-2" style="border-color: var(--color-${simulacionActual.color})">
            <h5>Nivel de Afectación: <strong>${simulacionActual.nivel}</strong></h5>
            <p class="mb-0">${simulacionActual.descripcion}</p>
        </div>
    `;
    
    // Proyección a 6 meses
    htmlClasificacion += `
        <div class="alert alert-info mt-3">
            <h6 class="text-info">📊 Proyección a 6 Meses</h6>
            <ul class="mb-0">
                <li>Gasto total proyectado: <strong>${formatearMoneda(simulacionActual.proyeccion6meses.gastoMensual)}</strong></li>
                <li>Incremento acumulado: <strong>${formatearMoneda(simulacionActual.proyeccion6meses.incrementoTotal)}</strong></li>
                <li>Ingresos disponibles: <strong>${formatearMoneda(ingresoFamiliar * 6)}</strong></li>
            </ul>
        </div>
    `;
    
    clasificacionContainer.innerHTML = htmlClasificacion;
    
    // Crear gráfico
    crearGraficoPoder();
}

// Crear gráfico
function crearGraficoPoder() {
    if (!simulacionActual) return;
    
    const canvas = document.getElementById('grafico-poder');
    if (!canvas) return;
    
    // Destruir gráfico anterior si existe
    if (graficoPoderActual) {
        graficoPoderActual.destroy();
        graficoPoderActual = null;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Crear gráfico más detallado y adaptativo
    graficoPoderActual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Gasto Anterior', 'Gasto Actual', 'Ingreso Familiar'],
            datasets: [
                {
                    label: 'Monto (Bs)',
                    data: [
                        simulacionActual.gastoAnterior,
                        simulacionActual.gastoActual,
                        simulacionActual.ingresoFamiliar
                    ],
                    backgroundColor: [
                        '#3b82f6',     // Azul para gasto anterior
                        '#dc2626',     // Rojo para gasto actual
                        '#10b981'      // Verde para ingreso
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                    borderWidth: 2,
                    borderColor: ['#1e40af', '#b91c1c', '#059669']
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 11 },
                    callbacks: {
                        label: function(context) {
                            return 'Bs. ' + formatearNumero(context.parsed.x, 2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb',
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6b7280',
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString('es-BO');
                        }
                    },
                    title: {
                        display: true,
                        text: 'Monto (Bs)',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11, weight: 'bold' },
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

// CORRECCIÓN CRÍTICA: Ahora recibe un parámetro 'prod' opcional para evitar selectores inestables.
// Además, usa insertAdjacentHTML para conservar los valores interactivos del DOM.
function agregarProducto(prod = null) {
    const container = document.getElementById('productos-container');
    const id = proximoIdProducto++;
    
    // Validamos si efectivamente recibimos un objeto de producto válido (y no un evento PointerEvent)
    const esProductoValido = prod && typeof prod === 'object' && 'nombre' in prod;
    
    const nombre = esProductoValido ? prod.nombre : '';
    const precioAnterior = esProductoValido ? prod.precioAnterior : '';
    const precioActual = esProductoValido ? prod.precioActual : '';
    const cantidad = esProductoValido ? prod.cantidad : '';
    
    const html = `
        <div class="producto-item border rounded p-2 mb-2" id="producto-${id}">
            <div class="row g-2 align-items-end">
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm" 
                           placeholder="Nombre producto" data-id="${id}" data-field="nombre" value="${nombre}">
                </div>
                <div class="col-3">
                    <input type="number" class="form-control form-control-sm" 
                           placeholder="P. Ant." min="0" step="0.01" data-id="${id}" data-field="precioAnterior" value="${precioAnterior}">
                </div>
                <div class="col-3">
                    <input type="number" class="form-control form-control-sm" 
                           placeholder="P. Act." min="0" step="0.01" data-id="${id}" data-field="precioActual" value="${precioActual}">
                </div>
                <div class="col-3">
                    <input type="number" class="form-control form-control-sm" 
                           placeholder="Cantidad" min="1" step="1" data-id="${id}" data-field="cantidad" value="${cantidad}">
                </div>
                <div class="col-3">
                    <button type="button" class="btn btn-outline-danger btn-sm w-100" 
                            onclick="eliminarProducto(${id})">Eliminar</button>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
}

// Eliminar producto
function eliminarProducto(id) {
    const elemento = document.getElementById(`producto-${id}`);
    if (elemento) {
        elemento.remove();
        // Actualizar array de productos
        productos = productos.filter(p => p.id !== id);
    }
}

// CORRECCIÓN CRÍTICA: Se modificó la carga secuencial para delegar de forma directa el objeto
// a agregarProducto(), evitando así selectores destructivos y fallas por referencias indefinidas.
function cargarCaso(casoPredefinido) {
    document.getElementById('ingresoFamiliar').value = casoPredefinido.ingresoFamiliar;
    document.getElementById('gastoAnterior').value = casoPredefinido.gastoAnterior;
    document.getElementById('gastoActual').value = casoPredefinido.gastoActual;
    
    // Limpiar productos existentes
    productos = [];
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    
    // Cargar productos del caso de forma directa y segura
    casoPredefinido.productos.forEach((prod) => {
        agregarProducto(prod);
    });
    
    // Actualizar array de productos
    actualizarProductos();
    
    // Simular
    mostrarResultados();
}

// Actualizar array de productos desde inputs
function actualizarProductos() {
    productos = [];
    const items = document.querySelectorAll('.producto-item');
    
    items.forEach(item => {
        const inputs = item.querySelectorAll('input');
        const nombre = inputs[0].value;
        const precioAnterior = parseFloat(inputs[1].value);
        const precioActual = parseFloat(inputs[2].value);
        const cantidad = parseInt(inputs[3].value);
        
        // CORRECCIÓN: Se cambió a !isNaN para evitar comportamientos falsos/nulos indeseados
        if (nombre && !isNaN(precioAnterior) && !isNaN(precioActual) && !isNaN(cantidad)) {
            productos.push({
                id: parseInt(inputs[0].dataset.id || 1),
                nombre,
                precioAnterior,
                precioActual,
                cantidad
            });
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Formulario principal
    const form = document.getElementById('form-poder');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            actualizarProductos();
            mostrarResultados();
        });
    }
    
    // Botón agregar producto
    const btnAgregarProducto = document.getElementById('btn-agregar-producto');
    if (btnAgregarProducto) {
        // CORRECCIÓN: Se encapsuló en una función de flecha anónima para evitar 
        // enviar el objeto PointerEvent nativo como argumento a agregarProducto()
        btnAgregarProducto.addEventListener('click', () => agregarProducto());
    }
    
    // Botones de casos predefinidos
    const btnCaso1 = document.getElementById('caso1-btn');
    const btnCaso2 = document.getElementById('caso2-btn');
    const btnCaso3 = document.getElementById('caso3-btn');
    
    if (btnCaso1) btnCaso1.addEventListener('click', () => cargarCaso(casosPredefinidos.caso1));
    if (btnCaso2) btnCaso2.addEventListener('click', () => cargarCaso(casosPredefinidos.caso2));
    if (btnCaso3) btnCaso3.addEventListener('click', () => cargarCaso(casosPredefinidos.caso3));
    
    // Actualizar productos cuando cambian inputs
    const container = document.getElementById('form-productos');
    if (container) {
        container.addEventListener('change', actualizarProductos);
    }
});

console.log('✅ Simulador de Poder Adquisitivo Cargado');
