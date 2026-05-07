const VARIANT = {
  default:  'text-slate-100',
  positive: 'text-emerald-400',
  negative: 'text-red-400',
  warning:  'text-amber-400',
};

export default function KPICard({ label, value, subtitle, variant = 'default', icon: Icon, iconColor }) {
  return (
    <div className="bg-[#0F2847] border border-[#1E3A6E] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-[11px] font-medium uppercase tracking-widest leading-none">
          {label}
        </span>
        {Icon && (
          <Icon
            className="w-4 h-4"
            style={{ color: iconColor ?? '#475569' }}
            strokeWidth={1.5}
          />
        )}
      </div>
      <div className={`text-2xl font-semibold tabular-nums leading-none ${VARIANT[variant]}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-slate-500 text-xs leading-none">{subtitle}</div>
      )}
    </div>
  );
}
