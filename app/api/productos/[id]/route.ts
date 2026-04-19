import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await params;
  const { nombre_producto, marca, precio_compra, precio_venta, estado } = await req.json();
  await pool.query(
    'UPDATE productos SET nombre_producto=$1, marca=$2, precio_compra=$3, precio_venta=$4, estado=$5 WHERE id_producto=$6',
    [nombre_producto, marca, precio_compra, precio_venta, estado, id]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await params;
  await pool.query('DELETE FROM productos WHERE id_producto=$1', [id]);
  return NextResponse.json({ ok: true });
}
