let datos = [];
let contenedor = document.getElementById("contenedor");

window.addEventListener("load", async () => {
    const salida = await fetch("http://localhost:3000/api/reservas");
    const reservas = await salida.json();
    console.log(reservas);
    datos = reservas;

    for(let i = 0; i < datos.length; i++) {
        let reserva = document.createElement("div");
        reserva.classList.add("reserva");
        let h2 = document.createElement("h2");
        h2.textContent = datos[i].espacio;
        reserva.appendChild(h2);
        contenedor.appendChild(reserva);
        let p1 = document.createElement("p");
        p1.textContent = `Actividad: ${datos[i].actividad}`;
        reserva.appendChild(p1);
        let p2 = document.createElement("p");
        p2.textContent = `Usuario: ${datos[i].usuario}`;
        reserva.appendChild(p2);
        let p3 = document.createElement("p");
        p3.textContent = `Descripción: ${datos[i].descripcion}`;
        reserva.appendChild(p3);
        let p4 = document.createElement("p");
        p4.textContent = `Fecha: ${new Date(datos[i].fecha).toLocaleDateString()}`;
        reserva.appendChild(p4);
        let span1 = document.createElement("span");
        span1.textContent = `Hora de inicio: ${datos[i].hora_inicio}`;
        reserva.appendChild(span1);
    }
});

