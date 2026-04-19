import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    const token = signToken({ id: user.id, username: user.username, nombre: user.nombre, rol: user.rol });
    const response = NextResponse.json({ ok: true, nombre: user.nombre });
    response.cookies.set('jans_token', token, { httpOnly: true, maxAge: 8 * 3600 });
    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
