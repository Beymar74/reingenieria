import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const result = await pool.query(`
    SELECT s.*, t.nombre_tercero as nombre_cliente
    FROM salidas s LEFT JOIN terceros t ON s.cliente = t.id_tercero
    ORDER BY s.fecha DESC
  `);
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = await req.json();
  const { numero_salida, fecha, cliente, detalles } = body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const total = detalles.reduce((sum: number, d: any) => sum + d.costo_unitario_salida * d.unidades_salida, 0);
    await client.query(
      'INSERT INTO salidas (numero_salida, fecha, cliente, total) VALUES ($1,$2,$3,$4)',
      [numero_salida, fecha, cliente, total]
    );
    for (const d of detalles) {
      const stockCheck = await client.query('SELECT stock FROM productos WHERE id_producto=$1', [d.id_producto_salida]);
      if (stockCheck.rows[0].stock < d.unidades_salida) throw new Error(`Stock insuficiente para ${d.nombre_producto}`);
      await client.query(
        'INSERT INTO base_salidas (numero_salida, id_producto_salida, nombre_producto, costo_unitario_salida, unidades_salida) VALUES ($1,$2,$3,$4,$5)',
        [numero_salida, d.id_producto_salida, d.nombre_producto, d.costo_unitario_salida, d.unidades_salida]
      );
      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
        [d.unidades_salida, d.id_producto_salida]
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
