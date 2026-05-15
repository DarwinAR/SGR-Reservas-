const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();


// Connect to MongoDB
mongoose.connect('mongodb://localhost/reservas');

const reserva = mongoose.model('Reserva', {
    espacio: String,
    actividad: String,
    usuario: String,
    descripcion: String,
    fecha: Date,
    hora_inicio: String,
    hora_fin: String
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/reservas', async (req, res) => {
    try {
        const nuevaReserva = new reserva(req.body);
        await nuevaReserva.save();
        res.status(201).json({ mensaje: 'Reserva creada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la reserva', error });
    }
});

app.get('/api/reservas', async (req, res) => {
    try {
        const reservas = await reserva.find();
        res.status(200).json(reservas);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las reservas', error });
    }
});


app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

