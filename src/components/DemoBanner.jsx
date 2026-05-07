export default function DemoBanner() {
  return (
    <div className="bg-amber-400/10 border-b border-amber-400/20 px-6 py-2.5 flex items-center gap-3 shrink-0">
      <span className="flex items-center gap-1.5 bg-amber-400/15 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-400/30">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block" />
        DEMO
      </span>
      <span className="text-amber-300/70 text-xs">
        Datos ficticios de ejemplo.{' '}
        <span className="text-amber-300/50">
          Conecte su hoja real añadiendo{' '}
          <code className="bg-amber-400/10 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px]">
            ?sheetId=XXXX
          </code>{' '}
          a la URL.
        </span>
      </span>
    </div>
  );
}
