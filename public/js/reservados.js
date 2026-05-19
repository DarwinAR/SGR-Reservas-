(function () {
    'use strict';

    const POR_PAGINA = 10;
    let datosOriginales = [];
    let datosFiltrados = [];
    let paginaActual = 1;

    const contenedor = document.getElementById('contenedor');
    const estadoVacio = document.getElementById('estado-vacio');
    const headerCount = document.getElementById('header-count');
    const paginacionNav = document.getElementById('paginacion');
    const pagNumeros = document.getElementById('pag-numeros');
    const btnPrev = document.getElementById('pag-prev');
    const btnNext = document.getElementById('pag-next');
    const filtroBusqueda = document.getElementById('filtro-busqueda');
    const filtroSala = document.getElementById('filtro-sala');
    const filtroLimpiar = document.getElementById('filtro-limpiar');

    const ESPACIOS = { 'sala1': 'Sala 1', 'sala2': 'Sala 2', 'sala3': 'Sala 3' };

    async function cargarReservas() {
        try {
            const resp = await fetch('/api/reservas');
            datosOriginales = await resp.json();
            aplicarFiltros();
        } catch (error) {
            contenedor.innerHTML = '<p style="text-align:center;padding:2rem;">Error al cargar las reservas.</p>';
        }
    }

    // Filtros
    function aplicarFiltros() {
        const texto = filtroBusqueda.value.toLowerCase().trim();
        const sala = filtroSala.value;

        datosFiltrados = datosOriginales.filter(r => {
            if (sala && r.espacio !== sala) return false;
            if (texto) {
                const nombre = ESPACIOS[r.espacio] || r.espacio || '';
                const buscarEn = `${r.actividad} ${r.usuario} ${nombre}`.toLowerCase();
                if (!buscarEn.includes(texto)) return false;
            }
            return true;
        });

        filtroLimpiar.hidden = !texto && !sala;
        paginaActual = 1;
        renderizar();
    }

    filtroBusqueda.addEventListener('input', aplicarFiltros);
    filtroSala.addEventListener('change', aplicarFiltros);
    filtroLimpiar.addEventListener('click', () => {
        filtroBusqueda.value = '';
        filtroSala.value = '';
        aplicarFiltros();
    });

    // Renderizar pagina
    function renderizar() {
        if (datosFiltrados.length === 0) {
            contenedor.innerHTML = '';
            estadoVacio.hidden = false;
            paginacionNav.hidden = true;
            headerCount.textContent = datosOriginales.length
                ? `${datosOriginales.length} total — 0 con filtros`
                : '';
            return;
        }

        estadoVacio.hidden = true;
        headerCount.textContent = datosFiltrados.length === datosOriginales.length
            ? `${datosFiltrados.length} reserva${datosFiltrados.length !== 1 ? 's' : ''}`
            : `${datosFiltrados.length} de ${datosOriginales.length}`;

        const totalPaginas = Math.ceil(datosFiltrados.length / POR_PAGINA);
        const inicio = (paginaActual - 1) * POR_PAGINA;
        const pagina = datosFiltrados.slice(inicio, inicio + POR_PAGINA);

        contenedor.innerHTML = '';
        pagina.forEach(r => contenedor.appendChild(crearTarjeta(r)));
        renderizarPaginacion(totalPaginas);
    }

    function crearTarjeta(reserva) {
        const card = document.createElement('div');
        card.className = 'reserva-card';
        const nombreSala = ESPACIOS[reserva.espacio] || reserva.espacio || 'Sin espacio';
        const iniciales = nombreSala.replace(/[^A-Z0-9]/gi, '').substring(0, 2).toUpperCase();

        card.innerHTML = `
            <div class="reserva-badge">${iniciales}</div>
            <div class="reserva-info">
                <h3>${nombreSala}</h3>
                <p class="reserva-actividad">${reserva.actividad || 'Sin actividad'}</p>
                <div class="reserva-meta">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${formatearFecha(reserva.fecha)}
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${reserva.hora_inicio || '--:--'} - ${reserva.hora_fin || '--:--'}
                    </span>
                </div>
                <p class="reserva-usuario">Solicitante: ${reserva.usuario || 'No especificado'}</p>
            </div>`;
        return card;
    }

    function formatearFecha(fecha) {
        if (!fecha) return 'Sin fecha';
        try {
            const f = new Date(fecha.includes('T') ? fecha : fecha + 'T12:00:00');
            return f.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) { return fecha; }
    }

    // Paginacion
    function renderizarPaginacion(totalPaginas) {
        if (totalPaginas <= 1) { paginacionNav.hidden = true; return; }
        paginacionNav.hidden = false;
        pagNumeros.innerHTML = '';
        btnPrev.disabled = paginaActual === 1;
        btnNext.disabled = paginaActual === totalPaginas;
        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement('button');
            btn.className = 'pag-num' + (i === paginaActual ? ' active' : '');
            btn.textContent = i;
            btn.addEventListener('click', () => irAPagina(i));
            pagNumeros.appendChild(btn);
        }
    }

    function irAPagina(p) {
        paginaActual = p;
        renderizar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnPrev.addEventListener('click', () => { if (paginaActual > 1) irAPagina(paginaActual - 1); });
    btnNext.addEventListener('click', () => {
        const tp = Math.ceil(datosFiltrados.length / POR_PAGINA);
        if (paginaActual < tp) irAPagina(paginaActual + 1);
    });

    cargarReservas();
})();
