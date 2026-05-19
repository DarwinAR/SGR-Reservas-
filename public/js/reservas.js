(function () {
    'use strict';

    // Referencias DOM
    const btnConfirmar = document.getElementById('btn-confirmar');
    const vistaFormulario = document.getElementById('vista-formulario');
    const vistaExito = document.getElementById('vista-exito');
    const exitoDetalles = document.getElementById('exito-detalles');
    const horaInicioSelect = document.getElementById('hora_inicio');
    const horaFinSelect = document.getElementById('hora_fin');
    const campoHoraFin = document.getElementById('campo-hora-fin');
    const fechaInput = document.getElementById('fecha');
    const espacioSelect = document.getElementById('espacio');
    const salaDetalle = document.getElementById('sala-detalle');
    const salaToggle = document.getElementById('sala-toggle');
    const salaToggleTitulo = document.getElementById('sala-toggle-titulo');
    const salaContenido = document.getElementById('sala-contenido');
    const modalConflicto = document.getElementById('modal-conflicto');
    const conflictoMensaje = document.getElementById('conflicto-mensaje');
    const conflictoDisponibles = document.getElementById('conflicto-disponibles');

    // Datos de salas
    const SALAS = {
        sala1: {
            nombre: 'Sala 1',
            descripcion: 'Capacidad: 20 personas. Equipamiento: Proyector, pantalla, 1 televisor 55", 20 sillas, 4 mesas modulares, aire acondicionado, conexión Wi-Fi.'
        },
        sala2: {
            nombre: 'Sala 2',
            descripcion: 'Capacidad: 12 personas. Equipamiento: Televisor 50", pizarra acrílica, 12 sillas, 1 mesa de conferencias, aire acondicionado, conexión Wi-Fi.'
        },
        sala3: {
            nombre: 'Sala 3',
            descripcion: 'Capacidad: 8 personas. Equipamiento: Proyector portátil, 8 sillas, 2 mesas, pizarra acrílica, conexión Wi-Fi.'
        }
    };

    // Generar horas (6 AM - 9 PM)
    function etiquetaHora(h) {
        if (h === 12) return '12:00 PM';
        return h < 12 ? h + ':00 AM' : (h - 12) + ':00 PM';
    }

    // Custom Hour Picker
    function crearHoraPicker(selectEl) {
        const wrapper = document.createElement('div');
        wrapper.className = 'hora-picker-wrapper';

        const trigger = document.createElement('div');
        trigger.className = 'hora-picker-trigger placeholder';
        trigger.innerHTML = `<span>Selecciona</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;

        const dropdown = document.createElement('div');
        dropdown.className = 'hora-picker-dropdown';

        selectEl.style.display = 'none';
        selectEl.parentNode.insertBefore(wrapper, selectEl);
        wrapper.appendChild(selectEl);
        wrapper.appendChild(trigger);
        wrapper.appendChild(dropdown);

        function renderOpciones() {
            dropdown.innerHTML = '';
            const opciones = selectEl.querySelectorAll('option');
            opciones.forEach(opt => {
                if (!opt.value) return;
                const div = document.createElement('div');
                div.className = 'hora-picker-option';
                if (opt.value === selectEl.value) div.classList.add('selected');
                div.textContent = opt.textContent;
                div.dataset.value = opt.value;
                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectEl.value = opt.value;
                    selectEl.dispatchEvent(new Event('change'));
                    trigger.querySelector('span').textContent = opt.textContent;
                    trigger.classList.remove('placeholder');
                    cerrar();
                });
                dropdown.appendChild(div);
            });
        }

        function abrir() {
            renderOpciones();
            trigger.classList.add('open');
            dropdown.classList.add('open');
        }

        function cerrar() {
            trigger.classList.remove('open');
            dropdown.classList.remove('open');
        }

        function toggle(e) {
            e.stopPropagation();
            if (dropdown.classList.contains('open')) {
                cerrar();
            } else {
                document.querySelectorAll('.hora-picker-dropdown.open').forEach(d => {
                    d.classList.remove('open');
                    d.previousElementSibling.classList.remove('open');
                });
                abrir();
            }
        }

        trigger.addEventListener('click', toggle);

        return {
            reset: function () {
                selectEl.value = '';
                trigger.querySelector('span').textContent = 'Selecciona';
                trigger.classList.add('placeholder');
                cerrar();
            },
            refresh: function () {
                if (selectEl.value) {
                    const opt = selectEl.querySelector('option[value="' + selectEl.value + '"]');
                    trigger.querySelector('span').textContent = opt ? opt.textContent : 'Selecciona';
                    trigger.classList.remove('placeholder');
                } else {
                    trigger.querySelector('span').textContent = 'Selecciona';
                    trigger.classList.add('placeholder');
                }
            }
        };
    }

    // Cerrar pickers al hacer clic fuera
    document.addEventListener('click', () => {
        document.querySelectorAll('.hora-picker-dropdown.open').forEach(d => {
            d.classList.remove('open');
        });
        document.querySelectorAll('.hora-picker-trigger.open').forEach(t => {
            t.classList.remove('open');
        });
    });

    function llenarHorasInicio() {
        for (let h = 6; h <= 21; h++) {
            const opt = document.createElement('option');
            opt.value = String(h).padStart(2, '0') + ':00';
            opt.textContent = etiquetaHora(h);
            horaInicioSelect.appendChild(opt);
        }
    }

    function llenarHorasFin(despuesDeHora) {
        horaFinSelect.innerHTML = '<option value="">Selecciona</option>';
        const min = parseInt(despuesDeHora.split(':')[0]) + 1;
        for (let h = min; h <= 21; h++) {
            const opt = document.createElement('option');
            opt.value = String(h).padStart(2, '0') + ':00';
            opt.textContent = etiquetaHora(h);
            horaFinSelect.appendChild(opt);
        }
    }

    llenarHorasInicio();

    // Crear custom pickers
    const pickerInicio = crearHoraPicker(horaInicioSelect);
    const pickerFin = crearHoraPicker(horaFinSelect);

    // Mostrar hora_fin solo cuando hora_inicio tenga valor
    horaInicioSelect.addEventListener('change', () => {
        if (horaInicioSelect.value) {
            llenarHorasFin(horaInicioSelect.value);
            campoHoraFin.hidden = false;
            pickerFin.reset();
        } else {
            campoHoraFin.hidden = true;
            horaFinSelect.value = '';
            pickerFin.reset();
        }
    });

    // Fecha minima: hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', hoy);

    // Abrir calendario al clic (solo en el input, no en el div)
    fechaInput.addEventListener('click', function (e) {
        e.stopPropagation();
        if (this.showPicker) this.showPicker();
    });

    // Evitar propagacion de clic desde inputs
    document.querySelectorAll('.campo input, .campo select, .campo textarea').forEach(el => {
        el.addEventListener('click', e => e.stopPropagation());
    });

    // Acordeon de sala
    espacioSelect.addEventListener('change', () => {
        const sala = SALAS[espacioSelect.value];
        if (sala) {
            salaDetalle.hidden = false;
            salaToggleTitulo.textContent = sala.nombre + ' — Ver detalles';
            salaContenido.textContent = sala.descripcion;
            salaToggle.classList.remove('open');
            salaContenido.classList.remove('open');
        } else {
            salaDetalle.hidden = true;
        }
    });

    salaToggle.addEventListener('click', () => {
        salaToggle.classList.toggle('open');
        salaContenido.classList.toggle('open');
    });

    // Validacion
    const camposRequeridos = [
        { id: 'espacio', mensaje: 'Selecciona un espacio' },
        { id: 'actividad', mensaje: 'Ingresa la actividad' },
        { id: 'usuario', mensaje: 'Ingresa el nombre del solicitante' },
        { id: 'fecha', mensaje: 'Selecciona una fecha' },
        { id: 'hora_inicio', mensaje: 'Selecciona la hora de inicio' },
        { id: 'hora_fin', mensaje: 'Selecciona la hora de fin' }
    ];

    function validarCampo(campo) {
        const input = document.getElementById(campo.id);
        const errorSpan = document.getElementById('error-' + campo.id);
        const contenedor = input.closest('.campo');
        if (!input.value.trim()) {
            contenedor.classList.add('invalido');
            errorSpan.textContent = campo.mensaje;
            errorSpan.classList.add('visible');
            return false;
        }
        contenedor.classList.remove('invalido');
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
        return true;
    }

    function validarFormulario() {
        let valido = true;
        camposRequeridos.forEach(c => { if (!validarCampo(c)) valido = false; });
        const hi = horaInicioSelect.value;
        const hf = horaFinSelect.value;
        if (hi && hf && hf <= hi) {
            const cont = horaFinSelect.closest('.campo');
            const err = document.getElementById('error-hora_fin');
            cont.classList.add('invalido');
            err.textContent = 'Debe ser posterior a la hora de inicio';
            err.classList.add('visible');
            valido = false;
        }
        return valido;
    }

    camposRequeridos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const ev = input.tagName === 'SELECT' ? 'change' : 'input';
        input.addEventListener(ev, () => validarCampo(campo));
    });

    // Verificar disponibilidad
    async function verificarDisponibilidad(espacio, fecha, horaInicio, horaFin) {
        try {
            const resp = await fetch('/api/reservas');
            const reservas = await resp.json();
            const conflictos = reservas.filter(r => {
                if (r.espacio !== espacio) return false;
                const fr = r.fecha.split('T')[0];
                if (fr !== fecha) return false;
                return (horaInicio < r.hora_fin && horaFin > r.hora_inicio);
            });
            return conflictos;
        } catch (error) {
            return [];
        }
    }

    async function obtenerHorasOcupadas(espacio, fecha) {
        try {
            const resp = await fetch('/api/reservas');
            const reservas = await resp.json();
            return reservas
                .filter(r => r.espacio === espacio && r.fecha.split('T')[0] === fecha)
                .map(r => ({ inicio: r.hora_inicio, fin: r.hora_fin }));
        } catch (e) { return []; }
    }

    function calcularDisponibles(ocupadas) {
        const todas = [];
        for (let h = 6; h <= 21; h++) todas.push(String(h).padStart(2, '0') + ':00');
        const disponibles = [];
        for (let i = 0; i < todas.length - 1; i++) {
            const h = todas[i];
            const hSig = todas[i + 1];
            const ocupado = ocupadas.some(o => h >= o.inicio && h < o.fin);
            if (!ocupado) disponibles.push(h + ' - ' + hSig);
        }
        return disponibles;
    }

    // Modal de conflicto
    function mostrarModalConflicto(nombreSala, fecha, conflictos, disponibles) {
        conflictoMensaje.textContent = `${nombreSala} ya está reservada el ${fecha} en los horarios: ${conflictos.map(c => c.hora_inicio + ' - ' + c.hora_fin).join(', ')}.`;
        if (disponibles.length > 0) {
            conflictoDisponibles.innerHTML = '<strong>Horarios disponibles:</strong><br>' + disponibles.join('<br>');
        } else {
            conflictoDisponibles.innerHTML = '<strong>No hay horarios disponibles para esta sala en esta fecha.</strong>';
        }
        modalConflicto.hidden = false;
    }

    function cerrarModalConflicto() { modalConflicto.hidden = true; }

    document.getElementById('modal-cerrar-conflicto').addEventListener('click', cerrarModalConflicto);
    document.getElementById('conflicto-aceptar').addEventListener('click', cerrarModalConflicto);
    modalConflicto.addEventListener('click', (e) => { if (e.target === modalConflicto) cerrarModalConflicto(); });

    // Enviar reserva
    async function enviarReserva() {
        const datos = {
            espacio: espacioSelect.value,
            actividad: document.getElementById('actividad').value,
            usuario: document.getElementById('usuario').value,
            descripcion: document.getElementById('descripcion').value,
            fecha: fechaInput.value,
            hora_inicio: horaInicioSelect.value,
            hora_fin: horaFinSelect.value
        };
        const respuesta = await fetch('/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();
        return { ok: respuesta.ok, resultado, datos };
    }

    // Exito
    function mostrarExito(datos) {
        const sala = SALAS[datos.espacio];
        const nombreSala = sala ? sala.nombre : datos.espacio;
        const fechaF = new Date(datos.fecha + 'T12:00:00').toLocaleDateString('es-CO', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        let html = `
            <p><strong>Espacio:</strong> ${nombreSala}</p>
            <p><strong>Solicitante:</strong> ${datos.usuario}</p>
            <p><strong>Actividad:</strong> ${datos.actividad}</p>
            <p><strong>Fecha:</strong> ${fechaF}</p>
            <p><strong>Horario:</strong> ${datos.hora_inicio} - ${datos.hora_fin}</p>`;
        if (sala) html += `<p><strong>Equipamiento:</strong> ${sala.descripcion}</p>`;
        exitoDetalles.innerHTML = html;
        vistaFormulario.hidden = true;
        vistaExito.hidden = false;
    }

    // Boton confirmar
    btnConfirmar.addEventListener('click', async () => {
        if (!validarFormulario()) return;

        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Verificando...';

        const espacio = espacioSelect.value;
        const fecha = fechaInput.value;
        const hi = horaInicioSelect.value;
        const hf = horaFinSelect.value;

        const conflictos = await verificarDisponibilidad(espacio, fecha, hi, hf);

        if (conflictos.length > 0) {
            const sala = SALAS[espacio];
            const nombreSala = sala ? sala.nombre : espacio;
            const ocupadas = await obtenerHorasOcupadas(espacio, fecha);
            const disponibles = calcularDisponibles(ocupadas);
            mostrarModalConflicto(nombreSala, fecha, conflictos, disponibles);
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar Reserva';
            return;
        }

        try {
            const { ok, resultado, datos } = await enviarReserva();
            if (ok && resultado.mensaje === 'Reserva creada exitosamente') {
                mostrarExito(datos);
            } else {
                mostrarModalConflicto('Error', '', [{ hora_inicio: '', hora_fin: '' }], []);
                conflictoMensaje.textContent = 'Ocurrió un error al crear la reserva. Inténtalo de nuevo.';
                conflictoDisponibles.innerHTML = '';
            }
        } catch (error) {
            mostrarModalConflicto('Error', '', [], []);
            conflictoMensaje.textContent = 'Error de conexión. Verifica que el servidor esté activo.';
            conflictoDisponibles.innerHTML = '';
        }

        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Confirmar Reserva';
    });

})();
