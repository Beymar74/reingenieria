import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JANS - Punto de Venta",
  description: "Sistema de Punto de Venta JANS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
