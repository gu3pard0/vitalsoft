import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "VitalSoft — Herramientas a medida para gestorías y asesorías",
  description:
    "Desarrollamos herramientas a medida para gestorías y asesorías: avisos automáticos de documentación, paneles de estado de trámites y automatización del trabajo repetitivo.",
  openGraph: {
    title: "VitalSoft — Herramientas a medida para gestorías y asesorías",
    description:
      "Avisos automáticos de documentación, paneles de estado de trámites y automatización a medida.",
    type: "website",
    url: "https://vitalsoft.pro",
  },
};

const MAIL = "info@vitalsoft.pro";
const MAILTO = `mailto:${MAIL}?subject=${encodeURIComponent("Quiero saber más sobre VitalSoft")}`;

type SP = { [key: string]: string | string[] | undefined };

// Los enlaces antiguos (referidos, retorno de pago de Stripe, planes) apuntaban a la portada
// de edición de vídeo. Se redirigen allí conservando todos los parámetros.
const LEGACY_PARAMS = ["ref", "client_ref", "pago", "videos", "clips", "plan", "session"];

export default function Home({ searchParams }: { searchParams: SP }) {
  if (LEGACY_PARAMS.some((k) => searchParams[k] !== undefined)) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (typeof v === "string") qs.set(k, v);
      else if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
    }
    redirect(`/video?${qs.toString()}`);
  }

  return (
    <main>
      {/* Cabecera */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="font-display font-black text-xl tracking-tight">
            <span className="text-accent">Vital</span>
            <span className="text-white">Soft</span>
          </a>
          <nav className="hidden sm:flex gap-8 text-sm text-white/50">
            <a href="#hacemos" className="hover:text-white transition-colors">Qué hacemos</a>
            <a href="#demo" className="hover:text-white transition-colors">Ejemplo</a>
            <a href="#proceso" className="hover:text-white transition-colors">Cómo trabajamos</a>
          </nav>
          <a
            href={MAILTO}
            className="bg-accent hover:bg-accent-2 text-[#080808] font-display font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Escribirnos
          </a>
        </div>
      </header>

      {/* Portada */}
      <section className="grid-bg">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="text-accent text-sm font-display font-semibold mb-5">
            Software a medida · Las Palmas de Gran Canaria
          </p>
          <h1 className="font-display font-bold text-[1.85rem] sm:text-5xl md:text-[3.25rem] leading-[1.12] tracking-tight max-w-3xl">
            Que vuestro equipo deje de perseguir documentos.
          </h1>
          <p className="text-white/55 text-lg md:text-xl leading-relaxed mt-6 max-w-2xl">
            Hacemos herramientas a medida para gestorías y asesorías. Avisan solas a los clientes cuando falta
            documentación o se acerca un vencimiento, y dejan el estado de cada trámite a la vista.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={MAILTO}
              className="bg-accent hover:bg-accent-2 text-[#080808] font-display font-bold px-6 py-3.5 rounded-lg transition-colors"
            >
              Contadnos vuestro caso
            </a>
            <a
              href="#demo"
              className="border border-white/15 hover:border-white/30 text-white/80 font-display font-semibold px-6 py-3.5 rounded-lg transition-colors"
            >
              Ver un ejemplo
            </a>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section id="hacemos" className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display font-bold text-3xl tracking-tight">Qué hacemos</h2>
          <p className="text-white/45 mt-3 max-w-xl">
            Proyectos pequeños y bien acotados, pensados para el trabajo repetitivo que más horas os quita.
          </p>
          <div className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {[
              ["Avisos de documentación y vencimientos", "El sistema escribe al cliente cuando falta un documento o se acerca una fecha. Nadie del equipo tiene que acordarse ni insistir."],
              ["Panel de estado de trámites", "Cada cliente puede ver en qué punto está su expediente, y vosotros veis de un vistazo qué está parado y por qué."],
              ["Automatización a medida", "Listados, recordatorios y control de plazos que hoy hacéis a mano, resueltos con una herramienta hecha para vuestra forma de trabajar."],
            ].map(([t, d]) => (
              <div key={t} className="grid md:grid-cols-[1fr_1.4fr] gap-3 md:gap-10 py-7">
                <h3 className="font-display font-semibold text-lg">{t}</h3>
                <p className="text-white/50 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ejemplo */}
      <section id="demo" className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display font-bold text-3xl tracking-tight">Un ejemplo de panel</h2>
          <p className="text-white/45 mt-3 max-w-xl">
            Una maqueta para que os hagáis una idea. Cada herramienta se adapta a cada despacho.
          </p>
          <div className="glass rounded-2xl overflow-hidden mt-10">
            <div className="px-5 py-3 text-xs border-b border-white/[0.08] text-accent/90 bg-accent/[0.06]">
              Maqueta de demostración · datos ficticios, no corresponden a ningún cliente real
            </div>
            <div className="text-sm">
              <div className="grid grid-cols-[1.4fr_1fr] md:grid-cols-[1.4fr_1fr_1.2fr] px-5 py-3 text-[11px] uppercase tracking-widest text-white/30 border-b border-white/[0.06]">
                <div>Trámite</div>
                <div>Estado</div>
                <div className="hidden md:block">Siguiente paso</div>
              </div>
              {[
                ["Cambio de titularidad de vehículo", "Falta documentación", "text-red-300 bg-red-400/10", "Aviso enviado al cliente"],
                ["Declaración trimestral", "En revisión", "text-yellow-200 bg-yellow-300/10", "Vence en 6 días"],
                ["Solicitud de subvención", "Presentada", "text-green-300 bg-green-400/10", "Pendiente de resolución"],
              ].map(([n, s, c, p]) => (
                <div key={n} className="grid grid-cols-[1.4fr_1fr] md:grid-cols-[1.4fr_1fr_1.2fr] px-5 py-4 border-b border-white/[0.06] last:border-0 items-center gap-2">
                  <div className="text-white/85">{n}</div>
                  <div><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c}`}>{s}</span></div>
                  <div className="hidden md:block text-white/45">{p}</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 text-sm text-white/55 bg-white/[0.03] border-t border-white/[0.08]">
              <span className="text-white/35">Aviso automático (ejemplo): </span>
              «Para continuar con su trámite necesitamos una copia del DNI y el justificante de pago. Puede enviarla respondiendo a este mensaje.»
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display font-bold text-3xl tracking-tight">Cómo trabajamos</h2>
          <p className="text-white/45 mt-3 max-w-xl">Por escrito y sin reuniones largas.</p>
          <ol className="mt-10 grid md:grid-cols-4 gap-8">
            {[
              ["Nos contáis", "Qué os quita más tiempo, en un par de párrafos."],
              ["Propuesta cerrada", "Alcance, plazo y precio final antes de empezar."],
              ["Desarrollo y revisión", "Lo vamos revisando con vosotros hasta que encaje."],
              ["Entrega y soporte", "Os lo dejamos funcionando y os explicamos cómo usarlo."],
            ].map(([t, d], i) => (
              <li key={t}>
                <div className="font-display font-extrabold text-accent text-sm mb-3">0{i + 1}</div>
                <h3 className="font-display font-semibold mb-1.5">{t}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contacto */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">¿Hablamos?</h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Estamos cerrando nuestros primeros proyectos de este tipo en Canarias, con precio de lanzamiento.
            Escribidnos y os contamos cómo lo haríamos en vuestro caso.
          </p>
          <a
            href={MAILTO}
            className="inline-block mt-8 bg-accent hover:bg-accent-2 text-[#080808] font-display font-bold px-7 py-4 rounded-lg transition-colors"
          >
            {MAIL}
          </a>
        </div>
      </section>

      {/* Pie */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/30">
          <span>© {new Date().getFullYear()} VitalSoft · Las Palmas de Gran Canaria</span>
          <span className="flex gap-5">
            <a href="/privacidad" className="hover:text-white/60 transition-colors">Privacidad</a>
            <a href="/terminos" className="hover:text-white/60 transition-colors">Términos</a>
          </span>
        </div>
      </footer>
    </main>
  );
}
