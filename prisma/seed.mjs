import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: 'admin123', nombre: 'Administrador', rol: 'admin' },
  });

  const terceros = [
    { idTercero: '114654654', nombreTercero: 'JANS PROGRAMMING', telefono: '3227625256', correo: 'jansprogramming@gmail.com', direccion: 'COLOMBIA', tipo: 'CLIENTE/PROVEEDOR', estado: true },
    { idTercero: '900123456', nombreTercero: 'Distribuidora Norte', telefono: '3001234567', correo: 'dist@norte.com', direccion: 'Bogotá', tipo: 'PROVEEDOR', estado: true },
    { idTercero: '800987654', nombreTercero: 'Supermercado Central', telefono: '3109876543', correo: 'super@central.com', direccion: 'Medellín', tipo: 'CLIENTE', estado: true },
    { idTercero: '700111222', nombreTercero: 'Tienda La Esquina', telefono: '3201112222', correo: null, direccion: 'Cali', tipo: 'CLIENTE', estado: true },
  ];

  for (const t of terceros) {
    await prisma.tercero.upsert({ where: { idTercero: t.idTercero }, update: {}, create: t });
  }

  const productos = [
    { idProducto: 'P001', nombreProducto: 'Coca Cola 2L', marca: 'Coca Cola', precioCompra: 8000, precioVenta: 12000, estado: true, stock: 50 },
    { idProducto: 'P002', nombreProducto: 'Arroz Diana 5kg', marca: 'Diana', precioCompra: 15000, precioVenta: 22000, estado: true, stock: 30 },
    { idProducto: 'P003', nombreProducto: 'Aceite 3000ml', marca: 'Gourmet', precioCompra: 18000, precioVenta: 25000, estado: true, stock: 20 },
    { idProducto: 'P004', nombreProducto: 'Azúcar 5kg', marca: 'Riopaila', precioCompra: 12000, precioVenta: 17000, estado: true, stock: 40 },
    { idProducto: 'P005', nombreProducto: 'Leche Entera 1L', marca: 'Alquería', precioCompra: 3200, precioVenta: 4500, estado: true, stock: 60 },
    { idProducto: 'P006', nombreProducto: 'Pan Tajado', marca: 'Bimbo', precioCompra: 5500, precioVenta: 8000, estado: true, stock: 25 },
    { idProducto: 'P007', nombreProducto: 'Jabón Rey 500g', marca: 'Rey', precioCompra: 4000, precioVenta: 6000, estado: true, stock: 35 },
    { idProducto: 'P008', nombreProducto: 'Shampoo H&S', marca: 'P&G', precioCompra: 12000, precioVenta: 18000, estado: true, stock: 3 },
    { idProducto: 'P009', nombreProducto: 'Café Águila Roja', marca: 'Águila Roja', precioCompra: 9000, precioVenta: 14000, estado: true, stock: 2 },
    { idProducto: 'P010', nombreProducto: 'Pañales Huggies x30', marca: 'Huggies', precioCompra: 35000, precioVenta: 48000, estado: true, stock: 15 },
  ];

  for (const p of productos) {
    await prisma.producto.upsert({ where: { idProducto: p.idProducto }, update: {}, create: p });
  }

  console.log('✅ Seed completado');
}

main().catch(console.error).finally(() => prisma.$disconnect());
