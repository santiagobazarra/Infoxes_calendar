const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cargasDescargasRoutes = require('./routes/cargasDescargas');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/cargas-descargas', cargasDescargasRoutes);

// Servidor en marcha
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
