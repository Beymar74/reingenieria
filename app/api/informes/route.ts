import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const desde = searchParams.get('desde') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  const hasta = searchParams.get('hasta') || new Date().toISOString().slice(0, 10);

  const [inventario, ventas, compras, utilidad, porDia, resumenEntradas, resumenSalidas] = await Promise.all([
    // ConsultaInventario: saldo = entradas - salidas
    pool.query(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        COALESCE(SUM(be.unidades_entradas), 0) as entradas,
        COALESCE((SELECT SUM(bs.unidades_salida) FROM base_salidas bs WHERE bs.id_producto_salida = p.id_producto), 0) as salidas,
        p.stock as saldo
      FROM productos p
      LEFT JOIN base_entradas be ON be.id_producto_entrada = p.id_producto
      GROUP BY p.id_producto, p.nombre_producto, p.stock
      ORDER BY p.nombre_producto
    `),

    // ConsultaVentas: por producto
    pool.query(`
      SELECT 
        bs.id_producto_salida as id_producto,
        bs.nombre_producto,
        SUM(bs.unidades_salida) as unidades,
        SUM(bs.sub_total_s) as valor_venta
      FROM base_salidas bs
      JOIN salidas s ON s.numero_salida = bs.numero_salida
      WHERE DATE(s.fecha) BETWEEN $1 AND $2
      GROUP BY bs.id_producto_salida, bs.nombre_producto
      ORDER BY valor_venta DESC
    `, [desde, hasta]),

    // ConsultaCompras: por producto
    pool.query(`
      SELECT 
        be.id_producto_entrada as id_producto,
        be.nombre_producto,
        SUM(be.unidades_entradas) as unidades,
        SUM(be.sub_total_e) as valor_compra
      FROM base_entradas be
      JOIN entradas e ON e.numero_entrada = be.numero_entrada
      WHERE DATE(e.fecha) BETWEEN $1 AND $2
      GROUP BY be.id_producto_entrada, be.nombre_producto
      ORDER BY valor_compra DESC
    `, [desde, hasta]),

    // ConsultaUtilidad: ventas - compras por producto
    pool.query(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        COALESCE(v.ventas, 0) as ventas,
        COALESCE(c.compras, 0) as compras,
        COALESCE(v.ventas, 0) - COALESCE(c.compras, 0) as utilidad
      FROM productos p
      LEFT JOIN (
        SELECT bs.id_producto_salida, SUM(bs.sub_total_s) as ventas
        FROM base_salidas bs
        JOIN salidas s ON s.numero_salida = bs.numero_salida
        WHERE DATE(s.fecha) BETWEEN $1 AND $2
        GROUP BY bs.id_producto_salida
      ) v ON v.id_producto_salida = p.id_producto
      LEFT JOIN (
        SELECT be.id_producto_entrada, SUM(be.sub_total_e) as compras
        FROM base_entradas be
        JOIN entradas e ON e.numero_entrada = be.numero_entrada
        WHERE DATE(e.fecha) BETWEEN $1 AND $2
        GROUP BY be.id_producto_entrada
      ) c ON c.id_producto_entrada = p.id_producto
      WHERE v.ventas IS NOT NULL OR c.compras IS NOT NULL
      ORDER BY utilidad DESC
    `, [desde, hasta]),

    // Gráfico por día
    pool.query(`
      SELECT 
        dia,
        COALESCE(e.monto_entradas, 0) as monto_entradas,
        COALESCE(s.monto_salidas, 0) as monto_salidas
      FROM generate_series($1::date, $2::date, '1 day') AS dia
      LEFT JOIN (SELECT DATE(fecha) as fecha, SUM(total) as monto_entradas FROM entradas GROUP BY DATE(fecha)) e ON e.fecha = dia
      LEFT JOIN (SELECT DATE(fecha) as fecha, SUM(total) as monto_salidas FROM salidas GROUP BY DATE(fecha)) s ON s.fecha = dia
      ORDER BY dia
    `, [desde, hasta]),

    pool.query(`SELECT COUNT(*) as cantidad, COALESCE(SUM(total),0) as monto FROM entradas WHERE DATE(fecha) BETWEEN $1 AND $2`, [desde, hasta]),
    pool.query(`SELECT COUNT(*) as cantidad, COALESCE(SUM(total),0) as monto FROM salidas WHERE DATE(fecha) BETWEEN $1 AND $2`, [desde, hasta]),
  ]);

  const montoEntradas = parseFloat(resumenEntradas.rows[0].monto);
  const montoSalidas = parseFloat(resumenSalidas.rows[0].monto);

  return NextResponse.json({
    resumen: {
      desde, hasta,
      entradas: { cantidad: parseInt(resumenEntradas.rows[0].cantidad), monto: montoEntradas },
      salidas: { cantidad: parseInt(resumenSalidas.rows[0].cantidad), monto: montoSalidas },
      utilidad: montoSalidas - montoEntradas,
    },
    inventario: inventario.rows,
    ventas: ventas.rows,
    compras: compras.rows,
    utilidad: utilidad.rows,
    porDia: porDia.rows,
  });
}