/* ===============================================
   CRISIS ECONOMICS - MAIN.JS
   Lógica de navegación global y utilidades
   =============================================== */

// Funciones de validación
function validarFormulario(datos) {
    for (let key in datos) {
        if (datos[key] === null || datos[key] === '' || isNaN(datos[key])) {
            return false;
        }
        if (parseFloat(datos[key]) < 0) {
            return false;
        }
    }
    return true;
}

// Formatear números
function formatearNumero(numero, decimales = 2) {
    return parseFloat(numero).toLocaleString('es-BO', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    });
}

// Formatear moneda
function formatearMoneda(numero) {
    return `Bs. ${formatearNumero(numero, 2)}`;
}

// Mostrar alerta
function mostrarAlerta(tipo, titulo, mensaje) {
    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <strong>${titulo}</strong><br>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    return alertaHTML;
}

// Crear tarjeta de resultado
function crearTarjetaResultado(label, valor, tipo = 'primary') {
    return `
        <div class="result-card">
            <div class="result-label">${label}</div>
            <div class="result-value" style="color: var(--color-${tipo})">${valor}</div>
        </div>
    `;
}

// Crear indicador
function crearIndicador(titulo, valor, tipo = 'default') {
    let colorClase = 'var(--color-primary)';
    
    if (tipo === 'danger') colorClase = 'var(--color-danger)';
    if (tipo === 'success') colorClase = 'var(--color-success)';
    if (tipo === 'warning') colorClase = 'var(--color-warning)';
    if (tipo === 'info') colorClase = 'var(--color-info)';
    
    return `
        <div class="indicator-card">
            <h5>${titulo}</h5>
            <p style="font-size: 1.875rem; font-weight: 700; color: ${colorClase}; margin: 0.5rem 0;">
                ${valor}
            </p>
        </div>
    `;
}

// Crear tabla HTML
function crearTabla(encabezados, datos, claseFilas = []) {
    let html = '<table class="table table-striped table-hover">';
    
    // Encabezados
    html += '<thead><tr>';
    encabezados.forEach(encabezado => {
        html += `<th>${encabezado}</th>`;
    });
    html += '</tr></thead>';
    
    // Datos
    html += '<tbody>';
    datos.forEach((fila, index) => {
        const clase = claseFilas[index] ? ` class="${claseFilas[index]}"` : '';
        html += `<tr${clase}>`;
        fila.forEach(celda => {
            html += `<td>${celda}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
}

// Clasificar nivel de afectación
function clasificarAfectacion(porcentaje) {
    if (porcentaje < 10) {
        return { nivel: 'BAJO', color: 'success', descripcion: 'Afectación mínima' };
    } else if (porcentaje < 25) {
        return { nivel: 'MODERADO', color: 'warning', descripcion: 'Afectación significativa' };
    } else {
        return { nivel: 'CRÍTICO', color: 'danger', descripcion: 'Afectación severa' };
    }
}

// Formatear días
function formatearTiempo(dias) {
    if (dias <= 1) return 'Hoy';
    if (dias <= 7) return `${Math.ceil(dias)} días`;
    const semanas = Math.floor(dias / 7);
    const diasRestantes = Math.ceil(dias % 7);
    if (diasRestantes === 0) {
        return `${semanas} semanas`;
    }
    return `${semanas} semanas y ${diasRestantes} días`;
}

// Inicializar tooltips (Bootstrap)
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Función para generar gráficos (reutilizable)
function crearGraficoLinea(canvasId, etiquetas, datos, titulo = '', colorLinea = '#2563eb') {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: titulo,
                data: datos,
                borderColor: colorLinea,
                backgroundColor: `${colorLinea}15`,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: colorLinea,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb',
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

function crearGraficoBarras(canvasId, etiquetas, datos, titulo = '', colorBarra = '#2563eb') {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: titulo,
                data: datos,
                backgroundColor: colorBarra,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
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
                        color: '#6b7280'
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

function crearGraficoComparativo(canvasId, etiquetas, dataset1, dataset2, titulo1 = 'Anterior', titulo2 = 'Actual') {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: titulo1,
                    data: dataset1,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    borderSkipped: false
                },
                {
                    label: titulo2,
                    data: dataset2,
                    backgroundColor: '#dc2626',
                    borderRadius: 6,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb',
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('✅ Crisis Economics - Sistema de Simulación Cargado Exitosamente');
