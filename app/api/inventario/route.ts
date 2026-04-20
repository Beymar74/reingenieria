import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const result = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre_producto,
      p.marca,
      p.precio_compra,
      p.precio_venta,
      p.stock,
      p.estado,
      COALESCE(SUM(be.unidades_entradas), 0) as total_entradas,
      COALESCE((SELECT SUM(bs.unidades_salida) FROM base_salidas bs WHERE bs.id_producto_salida = p.id_producto), 0) as total_salidas,
      (p.precio_venta - p.precio_compra) as utilidad_unitaria,
      ROUND(((p.precio_venta - p.precio_compra) / p.precio_compra * 100)::numeric, 2) as margen_pct
    FROM productos p
    LEFT JOIN base_entradas be ON be.id_producto_entrada = p.id_producto
    GROUP BY p.id_producto
    ORDER BY p.nombre_producto
  `);

  return NextResponse.json(result.rows);
}