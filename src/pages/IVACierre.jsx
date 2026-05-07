import { Info } from 'lucide-react';
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

const ESTADO_CFG = {
  cerrado:    { label: 'Cerrado',    cls: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/30' },
  en_proceso: { label: 'En proceso', cls: 'bg-amber-900/30  text-amber-400  border-amber-800/30' },
  pendiente:  { label: 'Pendiente',  cls: 'bg-slate-800/50   text-slate-400  border-slate-700/30' },
};

function EstadoBadge({ estado }) {
  const cfg = ESTADO_CFG[estado] ?? ESTADO_CFG.pendiente;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.cls}`}>
      {cfg.label}
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

const COLS = [
  { key: 'trimestre',           label: 'Trimestre',         align: 'left' },
  { key: 'iva_repercutido',     label: 'IVA repercutido',   align: 'right', fmt: true },
  { key: 'iva_soportado',       label: 'IVA soportado',     align: 'right', fmt: true },
  { key: 'iva_resultado',       label: 'Resultado IVA',     align: 'right', fmt: true, highlight: true },
  { key: 'irpf_retenido_total', label: 'IRPF retenido',     align: 'right', fmt: true },
  { key: 'docs_incluidos',      label: 'Docs.',             align: 'right' },
  { key: 'estado_cierre',       label: 'Estado',            align: 'left',  badge: true },
  { key: 'fecha_cierre',        label: 'Fecha cierre',      align: 'left' },
];

export default function IVACierre() {
  const { data: iva, loading, error } = useSheetData('/api/iva');

  if (loading) return <Spinner />;
  if (error) return (
    <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl p-5">
      Error: {error}
    </div>
  );

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-8">
        <h1 className="text-slate-100 text-xl font-semibold">IVA y Cierre Trimestral</h1>
        <p className="text-slate-500 text-sm mt-1">
          Resumen de liquidaciones trimestrales de IVA e IRPF
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-[#0F2847] border border-[#1E3A6E] rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A6E]">
                {COLS.map(col => (
                  <th
                    key={col.key}
                    className={`px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {(!iva || iva.length === 0) ? (
                <tr>
                  <td colSpan={COLS.length + 1} className="px-5 py-10 text-center text-slate-500 text-sm">
                    Sin datos trimestrales disponibles
                  </td>
                </tr>
              ) : iva.map((row, i) => {
                const resultado = toNum(row.iva_resultado);
                return (
                  <tr
                    key={row.trimestre ?? i}
                    className={`border-b border-[#1A2E4A]/50 transition-colors hover:bg-white/[0.02] ${
                      i % 2 === 0 ? '' : 'bg-black/[0.08]'
                    }`}
                  >
                    {COLS.map(col => {
                      const val = row[col.key] ?? '';
                      if (col.badge) {
                        return (
                          <td key={col.key} className="px-5 py-4 whitespace-nowrap">
                            <EstadoBadge estado={val} />
                          </td>
                        );
                      }
                      if (col.fmt && val !== '') {
                        const num = toNum(val);
                        const isResultado = col.highlight;
                        const colorCls = isResultado
                          ? num < 0 ? 'text-[#16A34A]' : 'text-slate-200'
                          : 'text-slate-200';
                        return (
                          <td key={col.key} className={`px-5 py-4 text-right tabular-nums whitespace-nowrap font-medium ${colorCls}`}>
                            {formatEUR(num)}
                          </td>
                        );
                      }
                      if (col.key === 'trimestre') {
                        return (
                          <td key={col.key} className="px-5 py-4 whitespace-nowrap">
                            <span className="text-slate-100 font-semibold">{val}</span>
                          </td>
                        );
                      }
                      return (
                        <td key={col.key} className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                          {val || '—'}
                        </td>
                      );
                    })}
                    <td className="px-5 py-4 text-slate-500 text-xs max-w-[200px]">
                      {row.notas_cierre || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota legal */}
      <div className="flex items-start gap-3 bg-[#0F2847] border border-[#1E3A6E] rounded-xl px-5 py-4">
        <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" strokeWidth={1.5} />
        <p className="text-slate-500 text-xs leading-relaxed">
          <strong className="text-slate-400 font-medium">Datos orientativos.</strong>{' '}
          Los importes mostrados son estimaciones basadas en los documentos procesados.
          La presentación oficial de impuestos (mod. 303, mod. 130, mod. 190) debe realizarla
          un asesor fiscal o gestoría habilitada. Cierre en Orden no asume responsabilidad
          sobre las declaraciones tributarias del contribuyente.
        </p>
      </div>
    </div>
  );
}
