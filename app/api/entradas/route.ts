import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const result = await pool.query(`
    SELECT e.*, t.nombre_tercero as nombre_proveedor 
    FROM entradas e LEFT JOIN terceros t ON e.proveedor = t.id_tercero 
    ORDER BY e.fecha DESC
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = await req.json();
  const { numero_entrada, fecha, proveedor, detalles } = body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const total = detalles.reduce((sum: number, d: any) => sum + d.costo_unitario_entrada * d.unidades_entradas, 0);
    await client.query(
      'INSERT INTO entradas (numero_entrada, fecha, proveedor, total) VALUES ($1,$2,$3,$4)',
      [numero_entrada, fecha, proveedor, total]
    );
    for (const d of detalles) {
      await client.query(
        'INSERT INTO base_entradas (numero_entrada, id_producto_entrada, nombre_producto, costo_unitario_entrada, unidades_entradas) VALUES ($1,$2,$3,$4,$5)',
        [numero_entrada, d.id_producto_entrada, d.nombre_producto, d.costo_unitario_entrada, d.unidades_entradas]
      );
      await client.query(
        'UPDATE productos SET stock = stock + $1 WHERE id_producto = $2',
        [d.unidades_entradas, d.id_producto_entrada]
      );
    }
    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: e.message }, { status: 400 });
  } finally {
    client.release();
  }
}
