import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo: sistema de reservas con recordatorios — VitalSoft",
  description:
    "Demostración interactiva con datos ficticios de un sistema de reservas con recordatorios por WhatsApp.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
