import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Receipt, Globe } from 'lucide-react';
import { useApp } from '../App';

const LINKS = [
  { to: '/resumen',    icon: LayoutDashboard, label: 'Resumen Mensual' },
  { to: '/documentos', icon: FileText,        label: 'Documentos' },
  { to: '/iva',        icon: Receipt,         label: 'IVA y Cierre' },
];

export default function Nav() {
  const { sheetId, isDemo } = useApp();
  const qs = sheetId ? `?sheetId=${sheetId}` : '';

  return (
    <aside className="w-56 bg-[#071529] border-r border-[#1A2E4A] flex flex-col shrink-0">
      {/* Marca */}
      <div className="px-5 py-5 border-b border-[#1A2E4A]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: '#16A34A' }}
          >
            <Globe className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-slate-100 text-sm font-semibold leading-tight truncate">
              Cierre en Orden
            </p>
            <p className="text-slate-500 text-[10px] leading-tight mt-0.5">
              Dashboard Financiero
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={`${to}${qs}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#1A2E4A]">
        {isDemo ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shrink-0" />
            <span className="text-amber-400/70 text-[10px] font-semibold uppercase tracking-widest">
              Modo Demo
            </span>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-1">
              Hoja conectada
            </p>
            <p
              className="text-slate-500 text-[10px] font-mono truncate"
              title={sheetId}
            >
              {sheetId}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
