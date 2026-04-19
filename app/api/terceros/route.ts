import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const result = await pool.query('SELECT * FROM terceros ORDER BY nombre_tercero');
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const body = await req.json();
  const { id_tercero, nombre_tercero, telefono, correo, direccion, tipo, estado } = body;
  try {
    await pool.query(
      'INSERT INTO terceros (id_tercero, nombre_tercero, telefono, correo, direccion, tipo, estado) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id_tercero, nombre_tercero, telefono || null, correo || null, direccion || null, tipo, estado ?? true]
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
