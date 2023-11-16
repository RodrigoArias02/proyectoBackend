import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function obtenerRutaArchivo() {
  return join(dirname(import.meta.url));
}

const rutaProductos = obtenerRutaArchivo();
console.log(rutaProductos);
