import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const result = await pool.query('SELECT * FROM productos ORDER BY nombre_producto');
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id_producto, nombre_producto, marca, precio_compra, precio_venta, estado } = await req.json();
  try {
    await pool.query(
      'INSERT INTO productos (id_producto, nombre_producto, marca, precio_compra, precio_venta, estado) VALUES ($1,$2,$3,$4,$5,$6)',
      [id_producto, nombre_producto, marca, precio_compra, precio_venta, estado ?? true]
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
