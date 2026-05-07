import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign,
  Receipt, FileCheck, Clock, AlertTriangle,
} from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import KPICard from '../components/KPICard';
import EvolucionChart from '../components/EvolucionChart';

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

const MESES = {
  '01':'Enero','02':'Febrero','03':'Marzo','04':'Abril',
  '05':'Mayo','06':'Junio','07':'Julio','08':'Agosto',
  '09':'Septiembre','10':'Octubre','11':'Noviembre','12':'Diciembre',
};

function formatPeriod(p) {
  const [y, m] = p.split('-');
  return `${MESES[m] ?? m} ${y}`;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ResumenMensual() {
  const { data: kpis, loading, error } = useSheetData('/api/kpis');
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const periods = useMemo(() => kpis?.map(k => k.periodo).filter(Boolean) ?? [], [kpis]);
  const activePeriod = selectedPeriod ?? periods[periods.length - 1] ?? '';
  const kpi = useMemo(() => kpis?.find(k => k.periodo === activePeriod), [kpis, activePeriod]);

  if (loading) return <Spinner />;
  if (error) return (
    <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl p-5">
      Error al cargar datos: {error}
    </div>
  );

  const beneficio = toNum(kpi?.beneficio_estimado);
  const incidencias = toNum(kpi?.incidencias_abiertas);
  const pendientes = toNum(kpi?.docs_pendientes);

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-slate-100 text-xl font-semibold">Resumen Mensual</h1>
          <p className="text-slate-500 text-sm mt-1">
            Rendimiento económico del periodo seleccionado
          </p>
        </div>
        <select
          value={activePeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
          className="bg-[#0F2847] border border-[#1E3A6E] text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#16A34A]/50 transition-colors cursor-pointer"
        >
          {periods.map(p => (
            <option key={p} value={p}>{formatPeriod(p)}</option>
          ))}
        </select>
      </div>

      {/* KPIs fila 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KPICard
          label="Ingresos del mes"
          value={formatEUR(toNum(kpi?.ingresos_brutos))}
          icon={TrendingUp}
          iconColor="#16A34A"
        />
        <KPICard
          label="Gastos del mes"
          value={formatEUR(toNum(kpi?.gastos_totales))}
          icon={TrendingDown}
          iconColor="#94A3B8"
        />
        <KPICard
          label="Beneficio estimado"
          value={formatEUR(beneficio)}
          variant={beneficio >= 0 ? 'positive' : 'negative'}
          subtitle={beneficio >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
          icon={DollarSign}
          iconColor={beneficio >= 0 ? '#16A34A' : '#DC2626'}
        />
        <KPICard
          label="IVA previsto a pagar"
          value={formatEUR(toNum(kpi?.iva_previsto_pagar))}
          subtitle="Estimación trimestral"
          icon={Receipt}
          iconColor="#F59E0B"
        />
      </div>

      {/* KPIs fila 2 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KPICard
          label="Documentos procesados"
          value={kpi?.docs_procesados ?? '—'}
          icon={FileCheck}
          iconColor="#94A3B8"
        />
        <KPICard
          label="Documentos pendientes"
          value={kpi?.docs_pendientes ?? '—'}
          variant={pendientes > 0 ? 'warning' : 'default'}
          icon={Clock}
          iconColor={pendientes > 0 ? '#F59E0B' : '#94A3B8'}
        />
        <KPICard
          label="Incidencias abiertas"
          value={kpi?.incidencias_abiertas ?? '—'}
          variant={incidencias > 0 ? 'negative' : 'default'}
          subtitle={incidencias > 0 ? 'Requiere atención' : undefined}
          icon={AlertTriangle}
          iconColor={incidencias > 0 ? '#DC2626' : '#16A34A'}
        />
      </div>

      {/* Gráfico evolución */}
      {kpis && kpis.length > 0 && <EvolucionChart data={kpis} />}
    </div>
  );
}
