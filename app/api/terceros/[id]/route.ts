import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { nombre_tercero, telefono, correo, direccion, tipo, estado } = body;
  try {
    await pool.query(
      'UPDATE terceros SET nombre_tercero=$1, telefono=$2, correo=$3, direccion=$4, tipo=$5, estado=$6 WHERE id_tercero=$7',
      [nombre_tercero, telefono, correo, direccion, tipo, estado, id]
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await params;
  try {
    await pool.query('DELETE FROM terceros WHERE id_tercero=$1', [id]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
