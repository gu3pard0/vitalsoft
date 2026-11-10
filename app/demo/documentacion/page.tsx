"use client";

import { useEffect, useMemo, useState } from "react";

type Doc = { name: string; received: boolean };
type Case = {
  id: number;
  client: string;
  procedure: string;
  due: number; // días hasta el vencimiento
  docs: Doc[];
  notified: boolean;
};

const DESPACHO = "Despacho Ejemplo";
const KEY = "vitalsoft-demo-documentacion-v1";

const SEED: Case[] = [
  {
    id: 1,
    client: "Construcciones Atlántico S.L.",
    procedure: "Declaración trimestral (T2)",
    due: 6,
    notified: false,
    docs: [
      { name: "Facturas emitidas", received: true },
      { name: "Facturas recibidas", received: false },
      { name: "Extracto bancario", received: false },
    ],
  },
  {
    id: 2,
    client: "Marta Ruiz Pérez",
    procedure: "Cambio de titularidad de vehículo",
    due: 14,
    notified: true,
    docs: [
      { name: "DNI de ambas partes", received: true },
      { name: "Contrato de compraventa", received: true },
      { name: "Justificante de pago", received: false },
    ],
  },
  {
    id: 3,
    client: "Panadería La Espiga",
    procedure: "Alta de nuevo trabajador",
    due: 3,
    notified: false,
    docs: [
      { name: "DNI del trabajador", received: false },
      { name: "Nº de afiliación", received: false },
      { name: "Contrato firmado", received: true },
    ],
  },
  {
    id: 4,
    client: "Javier Mora Díaz",
    procedure: "Declaración de la renta",
    due: 30,
    notified: false,
    docs: [
      { name: "Certificado de retenciones", received: true },
      { name: "Datos fiscales", received: true },
      { name: "Gastos deducibles", received: true },
    ],
  },
  {
    id: 5,
    client: "Taller Mecánico Hermanos Vega",
    procedure: "Solicitud de subvención",
    due: 9,
    notified: false,
    docs: [
      { name: "Memoria del proyecto", received: false },
      { name: "Certificado de estar al corriente", received: true },
    ],
  },
];

const SEED_MIXTO: Case[] = [
  { id: 1, client: "Marta Ruiz Pérez", procedure: "Canje de carnet de conducir", due: 6, notified: false,
    docs: [{ name: "DNI / NIE", received: true }, { name: "Carnet original", received: false }, { name: "Informe médico", received: false }] },
  { id: 2, client: "Javier Mora Díaz", procedure: "Cambio de titularidad de vehículo", due: 14, notified: true,
    docs: [{ name: "DNI de ambas partes", received: true }, { name: "Contrato de compraventa", received: true }, { name: "Justificante de pago", received: false }] },
  { id: 3, client: "Olena K.", procedure: "Renovación de autorización de residencia", due: 3, notified: false,
    docs: [{ name: "Pasaporte", received: true }, { name: "Empadronamiento", received: false }, { name: "Justificante de tasas", received: false }] },
  { id: 4, client: "Panadería La Espiga", procedure: "Declaración trimestral", due: 9, notified: false,
    docs: [{ name: "Facturas emitidas", received: true }, { name: "Facturas recibidas", received: true }, { name: "Extracto bancario", received: true }] },
  { id: 5, client: "Carlos Vega Santana", procedure: "Expediente de segunda oportunidad", due: 30, notified: false,
    docs: [{ name: "Relación de deudas", received: true }, { name: "Declaración de bienes", received: false }] },
];

function stateOf(c: Case): "completo" | "pendiente" | "urgente" {
  const missing = c.docs.some((d) => !d.received);
  if (!missing) return "completo";
  return c.due <= 7 ? "urgente" : "pendiente";
}

const PILL = {
  completo: "bg-emerald-400/15 text-emerald-300",
  pendiente: "bg-amber-400/15 text-amber-300",
  urgente: "bg-red-400/15 text-red-300",
};
const LABEL = { completo: "Completo", pendiente: "Falta documentación", urgente: "Urgente" };

function load(): Case[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Case[];
    }
  } catch {}
  return SEED;
}

export default function DemoDocumentacion() {
  const [items, setItems] = useState<Case[]>(SEED);
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState<number | null>(1);
  const [despacho, setDespacho] = useState(DESPACHO);
  const [personal, setPersonal] = useState(false);
  const [asClient, setAsClient] = useState(false);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const n = (q.get("n") || "").replace(/[^A-Za-zÀ-ÿ0-9 &.'\-]/g, "").trim().slice(0, 40);
      if (n) {
        setDespacho(n);
        setPersonal(true);
        setItems(SEED_MIXTO);
        setReady(true);
        return;
      }
    } catch {}
    setItems(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || personal) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready, personal]);

  const selected = items.find((c) => c.id === sel) ?? null;

  const stats = useMemo(
    () => ({
      total: items.length,
      incomplete: items.filter((c) => stateOf(c) !== "completo").length,
      urgent: items.filter((c) => stateOf(c) === "urgente").length,
      toNotify: items.filter((c) => stateOf(c) !== "completo" && !c.notified).length,
    }),
    [items],
  );

  const patch = (id: number, fn: (c: Case) => Case) =>
    setItems((cur) => cur.map((c) => (c.id === id ? fn(c) : c)));

  const notifyAll = () =>
    setItems((cur) => cur.map((c) => (stateOf(c) !== "completo" ? { ...c, notified: true } : c)));

  const reset = () => {
    setItems(personal ? SEED_MIXTO : SEED);
    setSel(1);
  };

  const emailText = (c: Case) => {
    const missing = c.docs.filter((d) => !d.received).map((d) => d.name);
    return {
      subject: `Documentación pendiente: ${c.procedure}`,
      body: `Hola, para continuar con "${c.procedure}" necesitamos: ${missing.join(", ")}. El plazo vence en ${c.due} días. Puedes enviarlo respondiendo a este mensaje.`,
    };
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="sticky top-0 z-20 bg-accent text-[#080808] text-xs sm:text-sm font-semibold px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <span>
          DEMOSTRACIÓN · datos ficticios, no corresponden a ningún cliente real. Lo que se cambie aquí solo se guarda en el navegador.
        </span>
        <span className="flex gap-4">
          <button onClick={reset} className="underline underline-offset-2">Reiniciar demo</button>
          <a href="/demo" className="underline underline-offset-2">Más demos</a>
          <a href="/" className="underline underline-offset-2">VitalSoft</a>
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">Panel de expedientes</p>
            <h1 className="font-display font-black text-2xl">{despacho}</h1>
          </div>
          <button
            onClick={notifyAll}
            className="bg-accent hover:bg-accent-2 text-[#080808] font-bold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Avisar a todos los que les falta algo
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            ["Expedientes", stats.total],
            ["Con documentación pendiente", stats.incomplete],
            ["Vencen en 7 días o menos", stats.urgent],
            ["Sin aviso enviado", stats.toNotify],
          ].map(([label, n]) => (
            <div key={label as string} className="glass rounded-xl p-4">
              <p className="text-white/40 text-xs">{label}</p>
              <p className="font-display font-black text-3xl mt-1">{n}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <section className="glass rounded-2xl p-4 sm:p-5 min-w-0">
            <ul className="divide-y divide-white/[0.06]">
              {items.map((c) => {
                const st = stateOf(c);
                const got = c.docs.filter((d) => d.received).length;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSel(c.id)}
                      className={`w-full text-left grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 px-2 rounded-lg transition-colors ${
                        sel === c.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm truncate">{c.client}</span>
                        <span className="block text-xs text-white/40 truncate">
                          {c.procedure} · {got}/{c.docs.length} documentos
                          {st !== "completo" && c.notified ? " · aviso enviado" : ""}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${PILL[st]}`}>
                          {LABEL[st]}
                        </span>
                        <span className="block text-[11px] text-white/35 mt-1">vence en {c.due} d</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="glass rounded-2xl p-5 h-fit min-w-0">
            {!selected ? (
              <p className="text-white/40 text-sm">Pulsa un expediente para ver sus documentos y el aviso que recibiría el cliente.</p>
            ) : (
              <>
                <div className="flex gap-1 mb-4 text-xs">
                  {[["Vista del despacho", false], ["Vista del cliente", true]].map(([l, v]) => (
                    <button
                      key={l as string}
                      onClick={() => setAsClient(v as boolean)}
                      className={`px-3 py-1.5 rounded-full border ${asClient === v ? "bg-accent text-[#080808] border-accent font-semibold" : "border-white/15 text-white/60"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {asClient ? (
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Así lo ve {selected.client.split(" ")[0]}</p>
                    <p className="font-bold">{selected.procedure}</p>
                    <p className="text-sm text-white/50 mb-4">{despacho}</p>
                    {(() => {
                      const got = selected.docs.filter((d) => d.received).length;
                      const pct = Math.round((got / selected.docs.length) * 100);
                      const done = got === selected.docs.length;
                      return (
                        <>
                          <div className="h-2 rounded-full bg-white/10 mb-2 overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-sm mb-4">
                            {done ? "Documentación completa. Tu trámite está en gestión." : `Documentación recibida: ${got} de ${selected.docs.length}`}
                          </p>
                          <ul className="space-y-2 mb-4 text-sm">
                            {selected.docs.map((d) => (
                              <li key={d.name} className={d.received ? "text-white/80" : "text-amber-300"}>
                                {d.received ? "✓ Recibido" : "○ Pendiente"} · {d.name}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-white/40">Plazo estimado: {selected.due} días. Sin llamadas: aquí ves siempre cómo va tu trámite.</p>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                <>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Expediente</p>
                <p className="font-bold">{selected.client}</p>
                <p className="text-sm text-white/50 mb-4">{selected.procedure}</p>

                <ul className="mb-4 space-y-2">
                  {selected.docs.map((d, i) => (
                    <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
                      <span className={d.received ? "text-white/80" : "text-white/50"}>
                        {d.received ? "✓" : "○"} {d.name}
                      </span>
                      {!d.received && (
                        <button
                          onClick={() =>
                            patch(selected.id, (c) => ({
                              ...c,
                              docs: c.docs.map((x, j) => (j === i ? { ...x, received: true } : x)),
                            }))
                          }
                          className="text-xs border border-white/15 hover:border-emerald-300 rounded-md px-2 py-1 whitespace-nowrap"
                        >
                          El cliente lo envía
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {stateOf(selected) === "completo" ? (
                  <p className="text-sm text-emerald-300">Documentación completa. No se enviarán más avisos.</p>
                ) : (
                  <>
                    <div className="rounded-xl bg-white/[0.04] p-3 mb-3">
                      <p className="text-[10px] text-white/30 mb-2">CORREO AL CLIENTE · SIMULADO</p>
                      {selected.notified ? (
                        <>
                          <p className="text-xs text-white/50 mb-1">Asunto: {emailText(selected).subject}</p>
                          <p className="text-sm">{emailText(selected).body}</p>
                        </>
                      ) : (
                        <p className="text-white/40 text-xs">Aún no se ha enviado ningún aviso.</p>
                      )}
                    </div>
                    {!selected.notified && (
                      <button
                        onClick={() => patch(selected.id, (c) => ({ ...c, notified: true }))}
                        className="w-full bg-accent text-[#080808] font-bold text-sm py-2 rounded-lg"
                      >
                        Enviar aviso al cliente
                      </button>
                    )}
                  </>
                )}
                </>
                )}
              </>
            )}
          </aside>
        </div>

        <p className="text-white/40 text-sm mt-8 max-w-2xl">
          Esto es un ejemplo. En un despacho real el aviso sale solo, con vuestros plazos y vuestro texto, y el cliente puede responder o subir el documento directamente. Si os interesa algo parecido, escribid a{" "}
          <a className="text-accent underline" href="mailto:info@vitalsoft.pro?subject=Demo%20de%20documentaci%C3%B3n">
            info@vitalsoft.pro
          </a>
          .
        </p>
      </div>
    </div>
  );
}
