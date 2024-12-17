const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/events.json');

// Obtener todos los eventos
router.get('/', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer los datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }
    res.json(JSON.parse(data));
  });
});

// Agregar un nuevo evento
router.post('/', (req, res) => {
  const nuevoEvento = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer los datos:', err);
      return res.status(500).json({ error: 'Error al guardar el evento' });
    }

    const eventos = JSON.parse(data);
    nuevoEvento.id = eventos.length + 1; // Generar un ID simple
    eventos.push(nuevoEvento);

    fs.writeFile(dataPath, JSON.stringify(eventos, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar el evento:', err);
        return res.status(500).json({ error: 'Error al guardar el evento' });
      }

      res.status(201).json(nuevoEvento);
    });
  });
});

module.exports = router;
