import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY nombre_producto');
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = await req.json();
  const { id_producto, nombre_producto, marca, precio_compra, precio_venta, estado, stock } = body;
  try {
    await pool.query(
      'INSERT INTO productos (id_producto, nombre_producto, marca, precio_compra, precio_venta, estado, stock) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id_producto, nombre_producto, marca || null, precio_compra, precio_venta, estado ?? true, stock ?? 0]
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
