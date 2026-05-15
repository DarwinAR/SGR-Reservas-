let sala1 = "Sala 1";
let sala2 = "Sala 2";
let sala3 = "Sala 3";

let seleccion = document.getElementById("espacio");
let descripcion = document.getElementById("contenedor_text");
let formulario = document.getElementById("formulario-reserva");


 seleccion.addEventListener("change", () => {
    descripcion.innerHTML = "";
    switch (seleccion.value) {
        case "sala1":
            let texto1 = document.createElement("p");
            texto1.textContent = sala1;
            descripcion.appendChild(texto1);
            break;
        case "sala2":
            let texto2 = document.createElement("p");
            texto2.textContent = sala2;
            descripcion.appendChild(texto2);
            break;
        case "sala3":
            let texto3 = document.createElement("p");
            texto3.textContent = sala3;
            descripcion.appendChild(texto3);
            break;
        }
 });

 formulario.addEventListener("submit", async(e) => {
    e.preventDefault();
    let espacio = document.getElementById("espacio").value;
    let actividad = document.getElementById("actividad").value;
    let usuario = document.getElementById("usuario").value;
    let descripcion = document.getElementById("descripcion").value;
    let fecha = document.getElementById("fecha").value;
    let hora_inicio= document.getElementById("hora_inicio").value;
    let hora_fin = document.getElementById("hora_fin").value;

    const respuesta = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            espacio,
            actividad,
            usuario,
            descripcion,
            fecha,
            hora_inicio,
            hora_fin
        })
    })
    const resultado = await respuesta.json();
    if (resultado.mensaje === 'Reserva creada exitosamente') {
        alert(fecha);
    } else {
        alert(fecha);
    }
 });

