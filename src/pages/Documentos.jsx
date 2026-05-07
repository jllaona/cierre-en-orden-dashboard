import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';

const toNum = (v) => {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;
  let s = String(v).trim();
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  return parseFloat(s) || 0;
};

const formatEUR = (value) => {
  const hasDecimals = value % 1 !== 0;
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(value) + ' €';
};

const ITEMS_PER_PAGE = 15;

const ESTADO_CFG = {
  revisado:    { label: 'Revisado',    bg: '#16A34A', color: '#fff' },
  en_revision: { label: 'En revisión', bg: '#F59E0B', color: '#000' },
  pendiente:   { label: 'Pendiente',   bg: '#475569', color: '#fff' },
  incidencia:  { label: 'Incidencia',  bg: '#DC2626', color: '#fff' },
};

function Badge({ estado }) {
  const cfg = ESTADO_CFG[estado] ?? ESTADO_CFG.pendiente;
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function TipoBadge({ tipo }) {
  const isIngreso = tipo === 'ingreso';
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
      style={{ background: isIngreso ? '#16A34A' : '#475569' }}
    >
      {isIngreso ? 'Ingreso' : 'Gasto'}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Documentos() {
  const { data: docs, loading, error } = useSheetData('/api/documentos');
  const [filters, setFilters] = useState({ tipo: '', estado: '', periodo: '' });
  const [page, setPage] = useState(1);

  const periodos = useMemo(() => {
    if (!docs) return [];
    return [...new Set(docs.map(d => d.periodo).filter(Boolean))].sort();
  }, [docs]);

  const filtered = useMemo(() => {
    if (!docs) return [];
    return docs.filter(d => {
      if (filters.tipo    && d.tipo_operacion !== filters.tipo)    return false;
      if (filters.estado  && d.estado_revision !== filters.estado) return false;
      if (filters.periodo && d.periodo !== filters.periodo)        return false;
      return true;
    });
  }, [docs, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function setFilter(key, val) {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  }

  const SELECT_CLS = "bg-[#0F2847] border border-[#1E3A6E] text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#16A34A]/40 transition-colors cursor-pointer";

  if (loading) return <Spinner />;
  if (error) return (
    <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl p-5">
      Error: {error}
    </div>
  );

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-100 text-xl font-semibold">Documentos</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filtered.length} documento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={filters.tipo} onChange={e => setFilter('tipo', e.target.value)} className={SELECT_CLS}>
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingresos</option>
          <option value="gasto">Gastos</option>
        </select>
        <select value={filters.estado} onChange={e => setFilter('estado', e.target.value)} className={SELECT_CLS}>
          <option value="">Todos los estados</option>
          <option value="revisado">Revisado</option>
          <option value="en_revision">En revisión</option>
          <option value="pendiente">Pendiente</option>
          <option value="incidencia">Incidencia</option>
        </select>
        <select value={filters.periodo} onChange={e => setFilter('periodo', e.target.value)} className={SELECT_CLS}>
          <option value="">Todos los periodos</option>
          {periodos.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-[#0F2847] border border-[#1E3A6E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A6E]">
                {['Fecha', 'Tipo', 'Emisor', 'Concepto', 'Base imp.', 'Cuota IVA', 'Total', 'Estado'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500 text-sm">
                    No hay documentos con los filtros seleccionados
                  </td>
                </tr>
              ) : paged.map((d, i) => (
                <tr
                  key={d.id_documento}
                  className={`border-b border-[#1A2E4A]/50 transition-colors hover:bg-white/[0.02] ${
                    i % 2 === 0 ? '' : 'bg-black/[0.08]'
                  }`}
                >
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap font-mono">
                    {d.fecha_factura || d.fecha_subida || '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <TipoBadge tipo={d.tipo_operacion} />
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs max-w-[160px] truncate" title={d.emisor}>
                    {d.emisor || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs max-w-[200px] truncate" title={d.concepto}>
                    {d.concepto || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-200 text-xs tabular-nums whitespace-nowrap text-right">
                    {d.base_imponible ? formatEUR(toNum(d.base_imponible)) : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs tabular-nums whitespace-nowrap text-right">
                    {d.cuota_iva ? formatEUR(toNum(d.cuota_iva)) : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-100 text-xs font-medium tabular-nums whitespace-nowrap text-right">
                    {d.total ? formatEUR(toNum(d.total)) : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge estado={d.estado_revision} />
                      {d.enlace_archivo && d.enlace_archivo !== '#' && d.enlace_archivo !== '' && (
                        <a
                          href={d.enlace_archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-300 transition-colors"
                          title="Ver archivo"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E3A6E]">
            <span className="text-slate-500 text-xs">
              Página {page} de {totalPages} · {filtered.length} documentos
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
