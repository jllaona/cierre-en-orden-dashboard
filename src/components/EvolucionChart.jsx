import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

const MONTH_SHORT = {
  '01':'Ene','02':'Feb','03':'Mar','04':'Abr','05':'May','06':'Jun',
  '07':'Jul','08':'Ago','09':'Sep','10':'Oct','11':'Nov','12':'Dic',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#071529] border border-[#1E3A6E] rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-300 font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="text-slate-200 font-medium tabular-nums">{formatEUR(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function EvolucionChart({ data }) {
  const year = data[0]?.periodo?.slice(0, 4) ?? '2024';

  const chartData = data.map(d => ({
    mes: MONTH_SHORT[d.periodo.slice(5)] ?? d.periodo.slice(5),
    Ingresos: toNum(d.ingresos_brutos),
    Gastos: toNum(d.gastos_totales),
    Beneficio: toNum(d.beneficio_estimado),
  }));

  return (
    <div className="bg-[#0F2847] border border-[#1E3A6E] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-200 text-sm font-semibold">Evolución mensual</h3>
          <p className="text-slate-500 text-xs mt-0.5">Ingresos, gastos y beneficio — {year}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E3A6E" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: '11px', paddingTop: '14px' }}
            formatter={v => <span style={{ color: '#94A3B8' }}>{v}</span>}
          />
          <Bar dataKey="Ingresos" fill="#1D4ED8" radius={[3,3,0,0]} maxBarSize={28} opacity={0.85} />
          <Bar dataKey="Gastos"   fill="#9F3B3B" radius={[3,3,0,0]} maxBarSize={28} opacity={0.85} />
          <Line
            type="monotone"
            dataKey="Beneficio"
            stroke="#16A34A"
            strokeWidth={2}
            dot={{ r: 3, fill: '#16A34A', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
