import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const [productos, terceros, entradas, salidas, stockBajo] = await Promise.all([
    pool.query('SELECT COUNT(*) as total FROM productos WHERE estado = true'),
    pool.query('SELECT COUNT(*) as total FROM terceros WHERE estado = true'),
    pool.query('SELECT COUNT(*) as total, COALESCE(SUM(total),0) as monto FROM entradas WHERE DATE(fecha) = CURRENT_DATE'),
    pool.query('SELECT COUNT(*) as total, COALESCE(SUM(total),0) as monto FROM salidas WHERE DATE(fecha) = CURRENT_DATE'),
    pool.query('SELECT * FROM productos WHERE stock < 5 AND estado = true ORDER BY stock ASC LIMIT 5'),
  ]);

  return NextResponse.json({
    productos: parseInt(productos.rows[0].total),
    terceros: parseInt(terceros.rows[0].total),
    entradas_hoy: parseInt(entradas.rows[0].total),
    monto_entradas: parseFloat(entradas.rows[0].monto),
    salidas_hoy: parseInt(salidas.rows[0].total),
    monto_salidas: parseFloat(salidas.rows[0].monto),
    stock_bajo: stockBajo.rows,
  });
}
