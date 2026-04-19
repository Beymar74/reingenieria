# JANS - Punto de Venta en Next.js

## 🚀 Instalación

### 1. Requisitos
- Node.js 18+
- PostgreSQL 14+

### 2. Configurar base de datos

```bash
# Crear la base de datos
createdb jans_pos

# Ejecutar el schema
psql -d jans_pos -f schema.sql
```

### 3. Variables de entorno

Edita `.env.local`:
```
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@localhost:5432/jans_pos
JWT_SECRET=jans-super-secret-key-2024
```

### 4. Instalar dependencias y correr

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## 🔐 Credenciales por defecto
- **Usuario:** admin
- **Contraseña:** admin123

## 📦 Módulos
- **Dashboard** — Estadísticas del día y alertas de stock
- **Productos** — CRUD completo con manejo de stock
- **Clientes/Proveedores (Terceros)** — CRUD con filtro por tipo
- **Entradas** — Registro de compras con detalle, actualiza stock automáticamente
- **Salidas/Ventas** — Registro de ventas, valida stock disponible

## 🗄️ Estructura del proyecto
```
app/
  api/           → API Routes (Next.js)
  dashboard/     → Páginas del sistema
  login/         → Página de login
components/
  Sidebar.tsx    → Navegación lateral
lib/
  db.ts          → Conexión PostgreSQL
  auth.ts        → JWT + cookies
schema.sql       → Esquema de la BD
```
