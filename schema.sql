-- JANS Punto de Venta - PostgreSQL Schema

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terceros (
  id_tercero VARCHAR(50) PRIMARY KEY,
  nombre_tercero VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  correo VARCHAR(255),
  direccion VARCHAR(255),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('CLIENTE', 'PROVEEDOR', 'CLIENTE/PROVEEDOR')),
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
  id_producto VARCHAR(50) PRIMARY KEY,
  nombre_producto VARCHAR(255) NOT NULL,
  marca VARCHAR(100),
  precio_compra DECIMAL(12,2) NOT NULL,
  precio_venta DECIMAL(12,2) NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entradas (
  numero_entrada VARCHAR(50) PRIMARY KEY,
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  proveedor VARCHAR(50) REFERENCES terceros(id_tercero),
  total DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS base_entradas (
  id SERIAL PRIMARY KEY,
  numero_entrada VARCHAR(50) REFERENCES entradas(numero_entrada) ON DELETE CASCADE,
  id_producto_entrada VARCHAR(50) REFERENCES productos(id_producto),
  nombre_producto VARCHAR(255) NOT NULL,
  costo_unitario_entrada DECIMAL(12,2) NOT NULL,
  unidades_entradas INTEGER NOT NULL,
  sub_total_e DECIMAL(12,2) GENERATED ALWAYS AS (costo_unitario_entrada * unidades_entradas) STORED
);

CREATE TABLE IF NOT EXISTS salidas (
  numero_salida VARCHAR(50) PRIMARY KEY,
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  cliente VARCHAR(50) REFERENCES terceros(id_tercero),
  total DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS base_salidas (
  id SERIAL PRIMARY KEY,
  numero_salida VARCHAR(50) REFERENCES salidas(numero_salida) ON DELETE CASCADE,
  id_producto_salida VARCHAR(50) REFERENCES productos(id_producto),
  nombre_producto VARCHAR(255) NOT NULL,
  costo_unitario_salida DECIMAL(12,2) NOT NULL,
  unidades_salida INTEGER NOT NULL,
  sub_total_s DECIMAL(12,2) GENERATED ALWAYS AS (costo_unitario_salida * unidades_salida) STORED
);

INSERT INTO usuarios (username, password, nombre, rol)
VALUES ('admin', '$2b$10$rOGz/1AHuCHJ0gFn8Tg8.OXaBFqT0fE/2p3aQVQqK9FVBMiB.B5Wy', 'Administrador', 'admin')
ON CONFLICT DO NOTHING;
