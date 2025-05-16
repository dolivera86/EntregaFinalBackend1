import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/product.router.js';
import cartRoutes from './routes/cart.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config(); // Cargar las variables de entorno

const app = express();
connectDB(); // Conectar con la base de datos

app.use(express.json()); // Para parsear cuerpos JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
