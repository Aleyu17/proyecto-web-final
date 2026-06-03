/* ===============================================
   SIMULADOR DE CARBURANTES - CARBURANTES.JS
   Escenario A: Abastecimiento de Combustible
   =============================================== */

// Variables globales
let simulacionActual = null;

// Casos de estudio predefinidos
const casosPredefinidos = {
    caso1: {
        nombre: 'Escasez Moderada',
        reservaInicial: 10000,
        consumoDiario: 1200,
        reabastecimiento: 300,
        nivelCritico: 2000
    },
    caso2: {
        nombre: 'Crisis Severa',
        reservaInicial: 5000,
        consumoDiario: 1500,
        reabastecimiento: 100,
        nivelCritico: 1000
    },
    caso3: {
        nombre: 'Estabilidad Relativa',
        reservaInicial: 15000,
        consumoDiario: 800,
        reabastecimiento: 700,
        nivelCritico: 3000
    }
};

// Calcular simulación
function calcularSimulacion(reservaInicial, consumoDiario, reabastecimiento, nivelCritico) {
    let reserva = reservaInicial;
    let dia = 0;
    let proyecciones = [];
    let diasCritico = -1;
    let reservaAgotada = false;
    
    // Proyectar hasta 120 días o hasta que se agote
    while (dia < 120) {
        dia++;
        
        // Modelo matemático: Reserva final = Reserva inicial + Reabastecimiento - Consumo
        reserva = reserva + reabastecimiento - consumoDiario;
        
        proyecciones.push({
            dia: dia,
            consumo: consumoDiario,
            reabastecimiento: reabastecimiento,
            saldo: consumoDiario - reabastecimiento,
            reserva: Math.max(0, reserva)
        });
        
        // Detectar nivel crítico
        if (diasCritico === -1 && reserva <= nivelCritico) {
            diasCritico = dia;
        }
        
        // Detectar agotamiento
        if (reserva <= 0) {
            reservaAgotada = true;
            break;
        }
    }
    
    return {
        reservaInicial,
        consumoDiario,
        reabastecimiento,
        nivelCritico,
        diasCritico,
        reservaAgotada,
        diasTotalesOperacion: dia,
        reservaFinal: Math.max(0, reserva),
        proyecciones: proyecciones
    };
}

// Calcular comparativa de consumos
function calcularComparativa(datos) {
    const consumoNormal = datos.consumoDiario;
    const consumoAlto = consumoNormal * 1.5; // 50% más
    
    // Simulación con consumo normal
    const simNormal = calcularSimulacion(
        datos.reservaInicial,
        consumoNormal,
        datos.reabastecimiento,
        datos.nivelCritico
    );
    
    // Simulación con consumo alto
    const simAlta = calcularSimulacion(
        datos.reservaInicial,
        consumoAlto,
        datos.reabastecimiento,
        datos.nivelCritico
    );
    
    return {
        normal: simNormal,
        alta: simAlta,
        diferencia: simNormal.diasCritico - simAlta.diasCritico
    };
}

// Mostrar resultados
function mostrarResultados(datos) {
    const resultadosContainer = document.getElementById('resultados-container');
    const tablaContainer = document.getElementById('tabla-proyeccion');
    const comparativaContainer = document.getElementById('comparativa-container');
    
    // Validar
    if (!validarFormulario(datos)) {
        resultadosContainer.innerHTML = mostrarAlerta('danger', 'Validación', 'Por favor completa todos los campos con valores válidos.');
        return;
    }
    
    // Guardar simulación actual
    simulacionActual = calcularSimulacion(
        parseFloat(datos.reservaInicial),
        parseFloat(datos.consumoDiario),
        parseFloat(datos.reabastecimiento),
        parseFloat(datos.nivelCritico)
    );
    
    // Renderizar resultados principales
    let html = '';
    
    if (simulacionActual.diasCritico > 0) {
        html += mostrarAlerta('warning', '⚠️ Alerta Crítica', 
            `La reserva alcanzará el nivel crítico en ${simulacionActual.diasCritico} días (${formatearTiempo(simulacionActual.diasCritico)})`
        );
    } else {
        html += mostrarAlerta('info', 'ℹ️ Información', 
            `La reserva se mantendrá por encima del nivel crítico durante toda la proyección.`
        );
    }
    
    html += crearTarjetaResultado('Autonomía Total Proyectada', `${simulacionActual.diasTotalesOperacion} días`, 'primary');
    html += crearTarjetaResultado('Días Hasta Nivel Crítico', 
        simulacionActual.diasCritico > 0 ? `${simulacionActual.diasCritico} días` : 'N/A', 
        simulacionActual.diasCritico > 0 ? 'danger' : 'success'
    );
    html += crearTarjetaResultado('Reserva Final Proyectada', `${formatearNumero(simulacionActual.reservaFinal)} L`, 'info');
    
    // Balance diario
    const balanceDiario = parseFloat(datos.reabastecimiento) - parseFloat(datos.consumoDiario);
    const tipo = balanceDiario > 0 ? 'success' : 'danger';
    const label = balanceDiario > 0 ? 'Superávit Diario' : 'Déficit Diario';
    
    html += crearTarjetaResultado(label, `${formatearNumero(Math.abs(balanceDiario))} L/día`, tipo);
    
    resultadosContainer.innerHTML = html;
    
    // Tabla de proyección (primeros 30 días)
    const encabezados = ['Día', 'Consumo (L)', 'Reabastecimiento (L)', 'Saldo (L)', 'Reserva (L)'];
    const datosTabla = simulacionActual.proyecciones.slice(0, 30).map(p => [
        p.dia,
        formatearNumero(p.consumo, 0),
        formatearNumero(p.reabastecimiento, 0),
        formatearNumero(p.saldo, 0),
        formatearNumero(p.reserva, 0)
    ]);
    
    // Marcar filas críticas
    const clasesFilas = datosTabla.map((fila, index) => {
        const dia = simulacionActual.proyecciones[index].dia;
        if (dia === simulacionActual.diasCritico) return 'table-danger';
        if (dia < simulacionActual.diasCritico - 2 && dia > simulacionActual.diasCritico - 5) return 'table-warning';
        return '';
    });
    
    tablaContainer.innerHTML = crearTabla(encabezados, datosTabla, clasesFilas);
    
    // Comparativa de consumos
    const comparativa = calcularComparativa(simulacionActual);
    let htmlComparativa = '<h5 class="text-primary mb-3">Análisis Comparativo</h5>';
    
    htmlComparativa += crearIndicador('Consumo Normal', `${simulacionActual.diasCritico} días`, 'success');
    htmlComparativa += crearIndicador('Consumo Alto (1.5x)', `${comparativa.alta.diasCritico} días`, 'danger');
    htmlComparativa += crearIndicador('Diferencia', `${Math.abs(comparativa.diferencia)} días`, 'warning');
    
    comparativaContainer.innerHTML = htmlComparativa;
    
    // Crear gráfico
    crearGraficoCarburantes();
}

// Crear gráfico de carburantes
function crearGraficoCarburantes() {
    if (!simulacionActual) return;
    
    const etiquetas = simulacionActual.proyecciones.slice(0, 60).map(p => `Día ${p.dia}`);
    const datosReserva = simulacionActual.proyecciones.slice(0, 60).map(p => p.reserva);
    
    crearGraficoLinea('grafico-carburantes', etiquetas, datosReserva, 'Reserva de Carburante (Litros)', '#2563eb');
}

// Cargar caso predefinido
function cargarCaso(casoPredefinido) {
    document.getElementById('reservaInicial').value = casoPredefinido.reservaInicial;
    document.getElementById('consumoDiario').value = casoPredefinido.consumoDiario;
    document.getElementById('reabastecimiento').value = casoPredefinido.reabastecimiento;
    document.getElementById('nivelCritico').value = casoPredefinido.nivelCritico;
    
    // Simular automáticamente
    document.getElementById('form-carburantes').dispatchEvent(new Event('submit'));
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Formulario principal
    const form = document.getElementById('form-carburantes');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const datos = {
                reservaInicial: document.getElementById('reservaInicial').value,
                consumoDiario: document.getElementById('consumoDiario').value,
                reabastecimiento: document.getElementById('reabastecimiento').value,
                nivelCritico: document.getElementById('nivelCritico').value
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
    
    // Cargar caso 1 automáticamente al inicio (demo)
    if (form) {
        // Comentar esta línea si no quieres que cargue automáticamente
        // cargarCaso(casosPredefinidos.caso1);
    }
});

console.log('✅ Simulador de Carburantes Cargado');
