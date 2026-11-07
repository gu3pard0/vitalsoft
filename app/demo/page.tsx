import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demos — VitalSoft",
  description: "Demostraciones interactivas con datos ficticios de herramientas a medida de VitalSoft.",
};

const DEMOS = [
  {
    href: "/demo/documentacion",
    title: "Avisos de documentación y vencimientos",
    who: "Gestorías, asesorías y despachos",
    text: "Un panel de expedientes que detecta qué documentos faltan y avisa solo al cliente. Se puede probar: enviar avisos y simular que el cliente responde.",
  },
  {
    href: "/demo/reservas",
    title: "Reservas con recordatorios por WhatsApp",
    who: "Peluquerías, clínicas, talleres y centros de estética",
    text: "Una agenda de citas que recuerda a cada cliente y recoge su confirmación o cancelación. Se puede probar: confirmar, cancelar y añadir citas.",
  },
];

export default function DemoIndex() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="font-display font-black text-xl tracking-tight">
            <span className="text-accent">Vital</span>
            <span className="text-white">Soft</span>
          </a>
          <a href="mailto:info@vitalsoft.pro?subject=Quiero%20saber%20m%C3%A1s%20sobre%20VitalSoft" className="bg-accent hover:bg-accent-2 text-[#080808] font-display font-bold text-sm px-5 py-2.5 rounded-lg transition-colors">
            Escribirnos
          </a>
        </div>
      </header>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">Demos</h1>
        <p className="text-white/50 mt-3 max-w-xl">
          Ejemplos reales de cómo funcionan nuestras herramientas. Todos los datos son ficticios y lo que se pruebe solo se guarda en el navegador.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {DEMOS.map((d) => (
            <a key={d.href} href={d.href} className="glass rounded-2xl p-6 hover:border-accent/40 border border-transparent transition-colors block">
              <p className="text-accent text-xs font-display font-semibold mb-2">{d.who}</p>
              <h2 className="font-display font-bold text-xl">{d.title}</h2>
              <p className="text-white/50 mt-3 leading-relaxed">{d.text}</p>
              <p className="text-accent font-display font-semibold mt-5">Probar la demo →</p>
            </a>
          ))}
        </div>
        <p className="text-white/40 text-sm mt-10 max-w-xl">
          ¿No veis vuestro caso? Cada herramienta se adapta a cada negocio. Contadnos qué hacéis a mano y os decimos cómo se puede automatizar.
        </p>
      </section>
    </main>
  );
}
