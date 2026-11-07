"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "pendiente" | "confirmada" | "cancelada";
type Appt = {
  id: number;
  day: number;
  time: string;
  name: string;
  service: string;
  status: Status;
  reminded: boolean;
};

const DAYS = [
  { short: "Lun", long: "el lunes" },
  { short: "Mar", long: "el martes" },
  { short: "Mié", long: "el miércoles" },
  { short: "Jue", long: "el jueves" },
  { short: "Vie", long: "el viernes" },
];
const SERVICES = ["Corte", "Color", "Peinado", "Tratamiento", "Barba"];
const BIZ = "Estudio Lumen";
const KEY = "vitalsoft-demo-reservas-v1";

const SEED: Appt[] = [
  { id: 1, day: 0, time: "10:00", name: "Marta Ruiz", service: "Corte", status: "confirmada", reminded: true },
  { id: 2, day: 0, time: "11:30", name: "Carlos Vega", service: "Barba", status: "pendiente", reminded: false },
  { id: 3, day: 0, time: "16:00", name: "Lucía Santos", service: "Color", status: "pendiente", reminded: false },
  { id: 4, day: 1, time: "09:30", name: "Pablo Núñez", service: "Corte", status: "confirmada", reminded: true },
  { id: 5, day: 1, time: "12:00", name: "Elena Ortiz", service: "Tratamiento", status: "pendiente", reminded: false },
  { id: 6, day: 2, time: "10:30", name: "Javier Mora", service: "Corte", status: "cancelada", reminded: true },
  { id: 7, day: 2, time: "17:00", name: "Sara Iglesias", service: "Peinado", status: "pendiente", reminded: false },
  { id: 8, day: 3, time: "11:00", name: "Rubén Díaz", service: "Barba", status: "pendiente", reminded: false },
  { id: 9, day: 4, time: "13:00", name: "Nuria Campos", service: "Color", status: "confirmada", reminded: true },
];

const PILL: Record<Status, string> = {
  pendiente: "bg-amber-400/15 text-amber-300",
  confirmada: "bg-emerald-400/15 text-emerald-300",
  cancelada: "bg-red-400/15 text-red-300",
};

function load(): Appt[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Appt[];
    }
  } catch {}
  return SEED;
}

function save(items: Appt[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export default function DemoReservas() {
  const [items, setItems] = useState<Appt[]>(SEED);
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", service: SERVICES[0], time: "10:00" });

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save(items);
  }, [items, ready]);

  const dayItems = useMemo(
    () => items.filter((a) => a.day === day).sort((a, b) => a.time.localeCompare(b.time)),
    [items, day],
  );
  const selected = items.find((a) => a.id === sel) ?? null;

  const stats = useMemo(() => {
    const week = items.filter((a) => a.status !== "cancelada");
    return {
      total: week.length,
      confirmed: items.filter((a) => a.status === "confirmada").length,
      pending: items.filter((a) => a.status === "pendiente").length,
      noReply: items.filter((a) => a.status === "pendiente" && !a.reminded).length,
    };
  }, [items]);

  const update = (id: number, patch: Partial<Appt>) =>
    setItems((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const message = (a: Appt) =>
    `Hola ${a.name.split(" ")[0]}, te recordamos tu cita de ${a.service.toLowerCase()} ${DAYS[a.day].long} a las ${a.time} en ${BIZ}. Responde 1 para confirmar o 2 para cancelar.`;

  const remindAll = () =>
    setItems((cur) => cur.map((a) => (a.status === "pendiente" ? { ...a, reminded: true } : a)));

  const addAppt = () => {
    const name = form.name.trim();
    if (!name) return;
    const id = Math.max(0, ...items.map((a) => a.id)) + 1;
    setItems((cur) => [
      ...cur,
      { id, day, time: form.time, name, service: form.service, status: "pendiente", reminded: false },
    ]);
    setForm({ name: "", service: SERVICES[0], time: "10:00" });
    setAdding(false);
    setSel(id);
  };

  const reset = () => {
    setItems(SEED);
    setSel(null);
    setDay(0);
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Franja fija: es una demostración */}
      <div className="sticky top-0 z-20 bg-accent text-[#080808] text-xs sm:text-sm font-semibold px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <span>
          DEMOSTRACIÓN · datos ficticios, no corresponden a ningún negocio real. Lo que se cambie aquí solo se guarda en el navegador.
        </span>
        <span className="flex gap-4">
          <button onClick={reset} className="underline underline-offset-2">Reiniciar demo</button>
          <a href="/" className="underline underline-offset-2">Volver a VitalSoft</a>
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">Panel de reservas</p>
            <h1 className="font-display font-black text-2xl">{BIZ}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={remindAll}
              className="border border-white/15 hover:border-white/40 text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Enviar recordatorios a pendientes
            </button>
            <button
              onClick={() => setAdding((v) => !v)}
              className="bg-accent hover:bg-accent-2 text-[#080808] font-bold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + Nueva cita
            </button>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            ["Citas de la semana", stats.total],
            ["Confirmadas", stats.confirmed],
            ["Pendientes", stats.pending],
            ["Sin recordatorio", stats.noReply],
          ].map(([label, n]) => (
            <div key={label as string} className="glass rounded-xl p-4">
              <p className="text-white/40 text-xs">{label}</p>
              <p className="font-display font-black text-3xl mt-1">{n}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
          {/* Agenda */}
          <section className="glass rounded-2xl p-4 sm:p-5 min-w-0">
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 border-b border-white/[0.06]">
              {DAYS.map((d, i) => {
                const n = items.filter((a) => a.day === i && a.status !== "cancelada").length;
                return (
                  <button
                    key={d.short}
                    onClick={() => {
                      setDay(i);
                      setSel(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      day === i ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {d.short} <span className="text-white/40">· {n}</span>
                  </button>
                );
              })}
            </div>

            {adding && (
              <div className="rounded-xl border border-accent/30 p-4 mb-4 grid sm:grid-cols-4 gap-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="sm:col-span-2 bg-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
                />
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="bg-white/5 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  {SERVICES.map((s) => (
                    <option key={s} className="bg-[#111]">{s}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="bg-white/5 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={addAppt}
                  className="sm:col-span-4 bg-accent text-[#080808] font-bold text-sm py-2 rounded-lg"
                >
                  Añadir a {DAYS[day].short}
                </button>
              </div>
            )}

            {dayItems.length === 0 ? (
              <p className="text-white/40 text-sm py-10 text-center">No hay citas este día.</p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {dayItems.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setSel(a.id)}
                      className={`w-full text-left grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 py-3 px-2 rounded-lg transition-colors ${
                        sel === a.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="font-display font-bold">{a.time}</span>
                      <span>
                        <span className="block text-sm">{a.name}</span>
                        <span className="block text-xs text-white/40">
                          {a.service} {a.reminded ? "· recordatorio enviado" : ""}
                        </span>
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PILL[a.status]}`}>
                        {a.status}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Detalle y WhatsApp simulado */}
          <aside className="glass rounded-2xl p-5 h-fit min-w-0">
            {!selected ? (
              <p className="text-white/40 text-sm">
                Pulsa una cita para ver el recordatorio que recibiría el cliente y simular su respuesta.
              </p>
            ) : (
              <>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Cita seleccionada</p>
                <p className="font-bold">{selected.name}</p>
                <p className="text-sm text-white/50 mb-4">
                  {selected.service} · {DAYS[selected.day].short} {selected.time}
                </p>

                <div className="rounded-xl bg-[#0b141a] p-3 mb-3">
                  <p className="text-[10px] text-white/30 mb-2">WHATSAPP · SIMULADO</p>
                  {selected.reminded || selected.status !== "pendiente" ? (
                    <div className="bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 text-sm ml-6">
                      {message(selected)}
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs">Aún no se ha enviado recordatorio.</p>
                  )}
                  {selected.status === "confirmada" && selected.reminded && (
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 text-sm mt-2 mr-10">1</div>
                  )}
                  {selected.status === "cancelada" && (
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 text-sm mt-2 mr-10">2</div>
                  )}
                </div>

                <div className="grid gap-2">
                  {!selected.reminded && selected.status === "pendiente" && (
                    <button
                      onClick={() => update(selected.id, { reminded: true })}
                      className="bg-accent text-[#080808] font-bold text-sm py-2 rounded-lg"
                    >
                      Enviar recordatorio
                    </button>
                  )}
                  {selected.reminded && selected.status === "pendiente" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => update(selected.id, { status: "confirmada" })}
                        className="border border-white/15 hover:border-emerald-300 text-sm py-2 rounded-lg"
                      >
                        El cliente responde 1
                      </button>
                      <button
                        onClick={() => update(selected.id, { status: "cancelada" })}
                        className="border border-white/15 hover:border-red-300 text-sm py-2 rounded-lg"
                      >
                        El cliente responde 2
                      </button>
                    </div>
                  )}
                  {selected.status === "cancelada" && (
                    <p className="text-xs text-white/50">
                      Hueco liberado: el sistema podría ofrecerlo automáticamente a la lista de espera.
                    </p>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>

        <p className="text-white/40 text-sm mt-8 max-w-2xl">
          Esto es un ejemplo. Cada sistema se adapta a tu negocio: tus servicios, tus horarios y tu forma de avisar a los clientes. Si os interesa algo parecido, escribid a{" "}
          <a className="text-accent underline" href="mailto:info@vitalsoft.pro?subject=Demo%20de%20reservas">
            info@vitalsoft.pro
          </a>
          .
        </p>
      </div>
    </div>
  );
}
