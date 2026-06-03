/* ===============================================
   SIMULADOR DE PÁNICO DE COMPRAS - ESCASEZ.JS
   Escenario E: Rumor de Escasez y Compras por Pánico
   =============================================== */

// Variables globales
let simulacionActual = null;
let graficoEscasezActual = null;  // Almacenar referencia del gráfico actual

// Casos de estudio predefinidos
const casosPredefinidos = {
    caso1: {
        nombre: 'Pánico Leve',
        demandaNormal: 100,
        porcentajeAumento: 20,
        stockDisponible: 150,
        numeroCompradores: 50
    },
    caso2: {
        nombre: 'Pánico Moderado',
        demandaNormal: 100,
        porcentajeAumento: 40,
        stockDisponible: 120,
        numeroCompradores: 60
    },
    caso3: {
        nombre: 'Pánico Masivo',
        demandaNormal: 100,
        porcentajeAumento: 80,
        stockDisponible: 100,
        numeroCompradores: 100
    }
};

// Calcular impacto del pánico
function calcularSimulacion(demandaNormal, porcentajeAumento, stockDisponible, numeroCompradores) {
    // Modelo: Nueva demanda = Demanda normal + (Demanda normal × % aumento)
    const aumentoAbsoluto = demandaNormal * (porcentajeAumento / 100);
    const nuevaDemanda = demandaNormal + aumentoAbsoluto;
    
    // Cálculos de impacto
    const déficit = nuevaDemanda - stockDisponible;
    const hayDesabastecimiento = déficit > 0;
    const compraPromedioPorPersona = nuevaDemanda / numeroCompradores;
    const comprasReales = Math.min(nuevaDemanda, stockDisponible);
    const personasInsatisfechas = hayDesabastecimiento ? Math.ceil((déficit / nuevaDemanda) * numeroCompradores) : 0;
    
    // Duración del stock disponible
    const diasDuracionStock = nuevaDemanda > 0 ? Math.floor(stockDisponible / nuevaDemanda) : Infinity;
    
    return {
        demandaNormal,
        porcentajeAumento,
        stockDisponible,
        numeroCompradores,
        aumentoAbsoluto: Math.round(aumentoAbsoluto),
        nuevaDemanda: Math.round(nuevaDemanda),
        déficit: Math.round(déficit),
        hayDesabastecimiento,
        compraPromedioPorPersona: compraPromedioPorPersona.toFixed(2),
        comprasReales: Math.round(comprasReales),
        personasInsatisfechas,
        diasDuracionStock,
        porcentajeAfectados: (personasInsatisfechas / numeroCompradores * 100).toFixed(1),
        excesoDemanda: nuevaDemanda > stockDisponible ? Math.round(nuevaDemanda - stockDisponible) : 0
    };
}

// Mostrar resultados
function mostrarResultados(datos) {
    const resultadosContainer = document.getElementById('resultados-container');
    const comparativaContainer = document.getElementById('comparativa-demanda');
    const distribuidorContainer = document.getElementById('distribucion-compradores');
    
    // Validar
    if (!validarFormulario(datos)) {
        resultadosContainer.innerHTML = mostrarAlerta('danger', 'Validación', 'Por favor completa todos los campos con valores válidos.');
        return;
    }
    
    // Guardar simulación actual
    simulacionActual = calcularSimulacion(
        parseInt(datos.demandaNormal),
        parseFloat(datos.porcentajeAumento),
        parseInt(datos.stockDisponible),
        parseInt(datos.numeroCompradores)
    );
    
    // Renderizar resultados principales
    let html = '';
    
    // Alerta según situación
    if (simulacionActual.hayDesabastecimiento) {
        html += mostrarAlerta('danger', '🚨 ALERTA CRÍTICA', 
            `La demanda supera el stock disponible. Déficit de ${simulacionActual.déficit} unidades. ` +
            `${simulacionActual.personasInsatisfechas} personas no podrán comprar el producto.`
        );
    } else {
        html += mostrarAlerta('success', '✅ Stock Suficiente', 
            `La demanda puede ser satisfecha completamente. Stock restante: ${simulacionActual.stockDisponible - simulacionActual.nuevaDemanda} unidades.`
        );
    }
    
    // Tarjetas de resultados
    html += crearTarjetaResultado('Demanda Normal', `${simulacionActual.demandaNormal} unidades`, 'primary');
    html += crearTarjetaResultado('Aumento por Pánico', `+${simulacionActual.aumentoAbsoluto} unidades (${simulacionActual.porcentajeAumento}%)`, 'warning');
    html += crearTarjetaResultado('Nueva Demanda Total', `${simulacionActual.nuevaDemanda} unidades`, 'primary');
    html += crearTarjetaResultado('Stock Disponible', `${simulacionActual.stockDisponible} unidades`, 'info');
    
    if (simulacionActual.hayDesabastecimiento) {
        html += crearTarjetaResultado('Déficit Total', `${simulacionActual.déficit} unidades faltantes`, 'danger');
    } else {
        html += crearTarjetaResultado('Excedente', `${simulacionActual.stockDisponible - simulacionActual.nuevaDemanda} unidades`, 'success');
    }
    
    html += crearTarjetaResultado('Stock Durará', `${simulacionActual.diasDuracionStock} día(s)`, simulacionActual.diasDuracionStock <= 1 ? 'danger' : 'info');
    
    resultadosContainer.innerHTML = html;
    
    // Comparativa de demanda
    let htmlComparativa = '<h5 class="mb-3">Impacto del Pánico en la Demanda</h5>';
    htmlComparativa += `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead class="table-light">
                    <tr>
                        <th>Métrica</th>
                        <th>Demanda Normal</th>
                        <th>Demanda con Pánico</th>
                        <th>Cambio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Unidades</strong></td>
                        <td>${simulacionActual.demandaNormal}</td>
                        <td>${simulacionActual.nuevaDemanda}</td>
                        <td><span class="badge bg-danger">+${simulacionActual.aumentoAbsoluto} (${simulacionActual.porcentajeAumento}%)</span></td>
                    </tr>
                    <tr>
                        <td><strong>Cobertura Stock</strong></td>
                        <td>${simulacionActual.stockDisponible >= simulacionActual.demandaNormal ? '✅ Suficiente' : '❌ Insuficiente'}</td>
                        <td>${!simulacionActual.hayDesabastecimiento ? '✅ Suficiente' : '❌ Insuficiente'}</td>
                        <td>${simulacionActual.hayDesabastecimiento ? '<span class="badge bg-danger">CRÍTICO</span>' : '<span class="badge bg-success">SEGURO</span>'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    comparativaContainer.innerHTML = htmlComparativa;
    
    // Distribución de compradores
    let htmlDistribucion = '<h5 class="mb-3">Distribución de Compradores</h5>';
    htmlDistribucion += `
        <div>
            <p><strong>Total de Compradores:</strong> ${simulacionActual.numeroCompradores}</p>
            <p><strong>Compra Promedio:</strong> ${simulacionActual.compraPromedioPorPersona} unidades/persona</p>
    `;
    
    if (simulacionActual.hayDesabastecimiento) {
        htmlDistribucion += `
            <div class="alert alert-danger">
                <strong>⚠️ Personas Insatisfechas:</strong> ${simulacionActual.personasInsatisfechas} (${simulacionActual.porcentajeAfectados}%)<br>
                <small>No pueden comprar la cantidad deseada</small>
            </div>
        `;
    } else {
        htmlDistribucion += `
            <div class="alert alert-success">
                <strong>✅ Todas las Personas Satisfechas</strong>
            </div>
        `;
    }
    
    htmlDistribucion += '</div>';
    distribuidorContainer.innerHTML = htmlDistribucion;
    
    // Actualizar indicadores
    actualizarIndicadores();
    
    // Crear gráfico
    crearGraficoEscasez();
}

// Actualizar indicadores
function actualizarIndicadores() {
    if (!simulacionActual) return;
    
    document.getElementById('indicator-cobertura').textContent = 
        `${simulacionActual.diasDuracionStock} día${simulacionActual.diasDuracionStock !== 1 ? 's' : ''}`;
    
    document.getElementById('indicator-deficit').textContent = 
        simulacionActual.déficit > 0 ? `${simulacionActual.déficit}` : 'Ninguno';
    
    document.getElementById('indicator-promedio').textContent = 
        `${simulacionActual.compraPromedioPorPersona}`;
    
    document.getElementById('indicator-aumento').textContent = 
        `+${simulacionActual.aumentoAbsoluto}`;
}

// Crear gráfico
function crearGraficoEscasez() {
    if (!simulacionActual) return;
    
    const canvas = document.getElementById('grafico-escasez');
    if (!canvas) return;
    
    // Destruir gráfico anterior si existe
    if (graficoEscasezActual) {
        graficoEscasezActual.destroy();
        graficoEscasezActual = null;
    }
    
    const etiquetas = ['Demanda\nNormal', 'Demanda\ncon Pánico', 'Stock\nDisponible'];
    const colores = ['#3b82f6', '#dc2626', '#10b981'];
    const valores = [
        simulacionActual.demandaNormal,
        simulacionActual.nuevaDemanda,
        simulacionActual.stockDisponible
    ];
    
    const ctx = canvas.getContext('2d');
    graficoEscasezActual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Unidades',
                data: valores,
                backgroundColor: colores,
                borderRadius: 8,
                borderSkipped: false,
                borderWidth: 2,
                borderColor: ['#1e40af', '#b91c1c', '#059669']
            }]
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
                            return context.parsed.x + ' unidades';
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
                        color: '#6b7280'
                    },
                    title: {
                        display: true,
                        text: 'Unidades',
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

// Cargar caso predefinido
function cargarCaso(casoPredefinido) {
    document.getElementById('demandaNormal').value = casoPredefinido.demandaNormal;
    document.getElementById('porcentajeAumento').value = casoPredefinido.porcentajeAumento;
    document.getElementById('stockDisponible').value = casoPredefinido.stockDisponible;
    document.getElementById('numeroCompradores').value = casoPredefinido.numeroCompradores;
    
    // Simular automáticamente con un pequeño delay para asegurar que los inputs se actualicen
    setTimeout(() => {
        document.getElementById('form-escasez').dispatchEvent(new Event('submit'));
    }, 100);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Formulario principal
    const form = document.getElementById('form-escasez');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const datos = {
                demandaNormal: document.getElementById('demandaNormal').value,
                porcentajeAumento: document.getElementById('porcentajeAumento').value,
                stockDisponible: document.getElementById('stockDisponible').value,
                numeroCompradores: document.getElementById('numeroCompradores').value
            };
            
            mostrarResultados(datos);
        });
    }
    
    // Botones de casos predefinidos
    const btnCaso1 = document.getElementById('caso1-btn');
    const btnCaso2 = document.getElementById('caso2-btn');
    const btnCaso3 = document.getElementById('caso3-btn');
    
    if (btnCaso1) btnCaso1.addEventListener('click', () => cargarCaso(casosPredefinidos.caso1));
    if (btnCaso2) btnCaso2.addEventListener('click', () => cargarCaso(casosPredefinidos.caso2));
    if (btnCaso3) btnCaso3.addEventListener('click', () => cargarCaso(casosPredefinidos.caso3));
});

console.log('✅ Simulador de Pánico de Compras Cargado');
