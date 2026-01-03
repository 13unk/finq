// 1. SELECCIÓN DE ELEMENTOS DEL DOM
const contenedor = document.getElementById('contenedor-inmuebles');
const selTransaccion = document.getElementById('transaccion-toggle');

// 2. FUNCIÓN PARA GENERAR LAS TARJETAS EN EL CATÁLOGO
function mostrarInmuebles(lista) {
    if (!contenedor) return;
    contenedor.innerHTML = "";
    
    if (lista.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #666; font-size: 1.2rem;">No se han encontrado inmuebles con estos filtros.</p>`;
        return;
    }
    
    lista.forEach(casa => {
        const carta = document.createElement('div');
        carta.className = 'card';
        
        const fotoPortada = (casa.fotos && casa.fotos.length > 0) ? casa.fotos[0] : 'https://via.placeholder.com/400x300';

        // Iconos y datos de las specs
        const htmlMetros = casa.metros ? `<span>📐 ${casa.metros} m²</span>` : '';
        const htmlParcela = casa.parcela ? `<span>🌳 ${casa.parcela} m²</span>` : '';
        const htmlHab = casa.habitaciones ? `<span>🛏️ ${casa.habitaciones} hab.</span>` : '';
        const htmlBaños = casa.baños ? `<span>🛁 ${casa.baños} baños</span>` : '';
        const htmlGaraje = (casa.garaje === "Sí" || casa.garaje === true) ? `<span>🚗 Garaje</span>` : '';

        carta.innerHTML = `
            <div class="card-img-container">
                <img src="${fotoPortada}" alt="${casa.titulo}">
                <div class="card-tags">
                    <span class="tag-transaccion">${casa.transaccion}</span>
                    <span class="tag-poblacion">${casa.poblacion}</span>
                </div>
            </div>
            <div class="card-content">
                <p class="tipo-texto">${casa.tipo}</p>
                <h3>${casa.titulo}</h3>
                <p class="price">${casa.precio}</p>
                <div class="specs">
                    ${htmlMetros}
                    ${htmlParcela}
                    ${htmlHab}
                    ${htmlBaños}
                    ${htmlGaraje}
                </div>
                <button class="btn-detail-modern" onclick="window.location.href='detalle.html?id=${casa.id}'">
                    Ver Detalles
                </button>
            </div>
        `;
        contenedor.appendChild(carta);
    });
}

// 3. LÓGICA DE FILTRADO AUTOMÁTICO
function filtrar() {
    if (typeof inmuebles === 'undefined') return;

    // Valor del Knob-Slider (Checkbox)
    const valorTransaccion = selTransaccion.checked ? "Alquiler" : "Compra";
    
    // Valores de los Custom Selects
    const optionTipo = document.querySelector('#custom-tipo .option.selected');
    const optionPoblacion = document.querySelector('#custom-poblacion .option.selected');
    
    const valorTipo = optionTipo ? optionTipo.dataset.value : "todos";
    const valorPoblacion = optionPoblacion ? optionPoblacion.dataset.value : "todos";

    const resultados = inmuebles.filter(casa => {
        const coincideTransaccion = casa.transaccion === valorTransaccion;
        const coincideTipo = valorTipo === "todos" || casa.tipo === valorTipo;
        const coincidePoblacion = valorPoblacion === "todos" || casa.poblacion === valorPoblacion;
        return coincideTransaccion && coincideTipo && coincidePoblacion;
    });

    // --- EFECTO VISUAL DE TRANSICIÓN ---
    contenedor.style.opacity = '0';
    contenedor.style.transform = 'translateY(10px)';

    setTimeout(() => {
        mostrarInmuebles(resultados);
        contenedor.style.opacity = '1';
        contenedor.style.transform = 'translateY(0)';
    }, 250);
}

// 4. LÓGICA DE LOS CUSTOM SELECTS (DESPLEGABLES)
function inicializarCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const options = select.querySelectorAll('.option');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Cerrar otros desplegables abiertos
            document.querySelectorAll('.custom-select').forEach(s => {
                if (s !== select) s.classList.remove('open');
            });
            select.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Actualizar selección visual
                select.querySelector('.option.selected').classList.remove('selected');
                option.classList.add('selected');
                
                // Actualizar texto del botón
                trigger.querySelector('span').innerText = option.innerText;
                
                // Cerrar y filtrar
                select.classList.remove('open');
                filtrar();
            });
        });
    });

    // Cerrar si se hace clic fuera de los selectores
    window.addEventListener('click', () => {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    });
}

// 5. EVENTOS Y CARGA INICIAL
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar componentes visuales
    inicializarCustomSelects();

    // 2. Escuchar cambios en el switch de Compra/Alquiler
    if (selTransaccion) {
        selTransaccion.addEventListener('change', filtrar);
    }

    // 3. Carga inicial y filtrado por defecto
    if (typeof inmuebles !== 'undefined') {
        // Ejecutamos el filtro para que coincida con el estado inicial del formulario
        filtrar(); 
    }

    // 4. Activar animaciones de scroll
    observarScroll();
});

// FUNCIÓN PARA REVELAR ELEMENTOS AL SCROLL (Intersection Observer)
const observarScroll = () => {
    const elementos = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach(el => observer.observe(el));
};