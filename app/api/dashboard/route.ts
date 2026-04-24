import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const [productos, terceros, entradas, salidas, stockBajo, ingresosMes, ultimasVentas] = await Promise.all([
    pool.query('SELECT COUNT(*) as total FROM productos WHERE estado = true'),
    pool.query('SELECT COUNT(*) as total FROM terceros WHERE estado = true'),
    pool.query('SELECT COUNT(*) as total, COALESCE(SUM(total),0) as monto FROM entradas WHERE DATE(fecha) = CURRENT_DATE'),
    pool.query('SELECT COUNT(*) as total, COALESCE(SUM(total),0) as monto FROM salidas WHERE DATE(fecha) = CURRENT_DATE'),
    pool.query('SELECT * FROM productos WHERE stock < 5 AND estado = true ORDER BY stock ASC LIMIT 5'),
    pool.query('SELECT COALESCE(SUM(total),0) as monto FROM salidas WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)'),
    pool.query('SELECT s.numero_salida, s.fecha, s.total, t.nombre_tercero as cliente FROM salidas s LEFT JOIN terceros t ON s.cliente = t.id_tercero ORDER BY s.fecha DESC LIMIT 5'),
  ]);

  return NextResponse.json({
    productos: parseInt(productos.rows[0].total),
    terceros: parseInt(terceros.rows[0].total),
    entradas_hoy: parseInt(entradas.rows[0].total),
    monto_entradas: parseFloat(entradas.rows[0].monto),
    salidas_hoy: parseInt(salidas.rows[0].total),
    monto_salidas: parseFloat(salidas.rows[0].monto),
    ingresos_mes: parseFloat(ingresosMes.rows[0].monto),
    stock_bajo: stockBajo.rows,
    ultimas_ventas: ultimasVentas.rows,
  });
}
