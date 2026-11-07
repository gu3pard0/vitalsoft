import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo: avisos de documentación y vencimientos — VitalSoft",
  description:
    "Demostración interactiva con datos ficticios de un panel de expedientes que avisa solo a los clientes cuando falta documentación.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
