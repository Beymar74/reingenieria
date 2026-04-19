export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

export interface Tercero {
  id_tercero: string;
  nombre_tercero: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  tipo: 'CLIENTE' | 'PROVEEDOR' | 'CLIENTE/PROVEEDOR';
  estado: boolean;
}

export interface Producto {
  id_producto: string;
  nombre_producto: string;
  marca?: string;
  precio_compra: number;
  precio_venta: number;
  estado: boolean;
  stock: number;
}

export interface Entrada {
  numero_entrada: string;
  fecha: string;
  proveedor: string;
  nombre_proveedor?: string;
  total: number;
}

export interface BaseEntrada {
  id?: number;
  numero_entrada: string;
  id_producto_entrada: string;
  nombre_producto: string;
  costo_unitario_entrada: number;
  unidades_entradas: number;
  sub_total_e?: number;
}

export interface Salida {
  numero_salida: string;
  fecha: string;
  cliente: string;
  nombre_cliente?: string;
  total: number;
}

export interface BaseSalida {
  id?: number;
  numero_salida: string;
  id_producto_salida: string;
  nombre_producto: string;
  costo_unitario_salida: number;
  unidades_salida: number;
  sub_total_s?: number;
}
