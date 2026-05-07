const PERIODOS = [
  '2024-01','2024-02','2024-03','2024-04','2024-05','2024-06',
  '2024-07','2024-08','2024-09','2024-10','2024-11','2024-12',
];

const INGRESOS = [4200, 3800, 5100, 4600, 6200, 5800, 4900, 3200, 5500, 6800, 7200, 6100];
const GASTOS   = [1450, 1320, 1680, 1520, 2100, 1890, 1760, 1100, 1840, 2200, 2350, 1950];

export const demoKpis = PERIODOS.map((periodo, i) => {
  const ing = INGRESOS[i];
  const gas = GASTOS[i];
  const ivaR = Math.round(ing * 0.21);
  const ivaS = Math.round(gas * 0.21);
  const docsBase = 8 + Math.floor(i * 1.2);
  const incidencias = i % 5 === 0 ? 1 : 0;
  const pendientes = i === 11 ? 3 : i % 4 === 0 ? 2 : 1;
  return {
    cliente_id: 'DEMO',
    periodo,
    ingresos_brutos: String(ing),
    gastos_totales: String(gas),
    beneficio_estimado: String(ing - gas),
    iva_repercutido: String(ivaR),
    iva_soportado: String(ivaS),
    iva_previsto_pagar: String(ivaR - ivaS),
    irpf_retenido: String(Math.round(ing * 0.15)),
    docs_procesados: String(docsBase),
    docs_incidencia: String(incidencias),
    docs_pendientes: String(pendientes),
    incidencias_abiertas: String(incidencias),
  };
});

const TRIMESTRE_MAP = {
  '01':'2024-T1','02':'2024-T1','03':'2024-T1',
  '04':'2024-T2','05':'2024-T2','06':'2024-T2',
  '07':'2024-T3','08':'2024-T3','09':'2024-T3',
  '10':'2024-T4','11':'2024-T4','12':'2024-T4',
};

function sumaT(from, to) {
  let ivaR = 0, ivaS = 0, irpf = 0, docs = 0;
  for (let i = from; i <= to; i++) {
    ivaR += Math.round(INGRESOS[i] * 0.21);
    ivaS += Math.round(GASTOS[i] * 0.21);
    irpf += Math.round(INGRESOS[i] * 0.15);
    docs += 8 + Math.floor(i * 1.2);
  }
  return { ivaR, ivaS, iva_resultado: ivaR - ivaS, irpf, docs };
}

export const demoIva = [
  {
    cliente_id: 'DEMO',
    trimestre: '2024-T1',
    iva_repercutido: String(sumaT(0,2).ivaR),
    iva_soportado: String(sumaT(0,2).ivaS),
    iva_resultado: String(sumaT(0,2).iva_resultado),
    irpf_retenido_total: String(sumaT(0,2).irpf),
    docs_incluidos: String(sumaT(0,2).docs),
    estado_cierre: 'cerrado',
    fecha_cierre: '2024-04-18',
    notas_cierre: 'Mod. 303 presentado correctamente. Sin incidencias.',
  },
  {
    cliente_id: 'DEMO',
    trimestre: '2024-T2',
    iva_repercutido: String(sumaT(3,5).ivaR),
    iva_soportado: String(sumaT(3,5).ivaS),
    iva_resultado: String(sumaT(3,5).iva_resultado),
    irpf_retenido_total: String(sumaT(3,5).irpf),
    docs_incluidos: String(sumaT(3,5).docs),
    estado_cierre: 'cerrado',
    fecha_cierre: '2024-07-19',
    notas_cierre: '',
  },
  {
    cliente_id: 'DEMO',
    trimestre: '2024-T3',
    iva_repercutido: String(sumaT(6,8).ivaR),
    iva_soportado: String(sumaT(6,8).ivaS),
    iva_resultado: String(sumaT(6,8).iva_resultado),
    irpf_retenido_total: String(sumaT(6,8).irpf),
    docs_incluidos: String(sumaT(6,8).docs),
    estado_cierre: 'en_proceso',
    fecha_cierre: '',
    notas_cierre: 'Pendiente revisión de 2 facturas — contacte con su gestor',
  },
  {
    cliente_id: 'DEMO',
    trimestre: '2024-T4',
    iva_repercutido: String(sumaT(9,11).ivaR),
    iva_soportado: String(sumaT(9,11).ivaS),
    iva_resultado: String(sumaT(9,11).iva_resultado),
    irpf_retenido_total: String(sumaT(9,11).irpf),
    docs_incluidos: String(sumaT(9,11).docs),
    estado_cierre: 'pendiente',
    fecha_cierre: '',
    notas_cierre: '',
  },
];

const CLIENTES = [
  { nombre: 'Constructora Valeria S.L.',       nif: 'B12345678' },
  { nombre: 'Tech Solutions Madrid S.L.',       nif: 'B87654321' },
  { nombre: 'Gestiones Rápidas S.A.',           nif: 'A11223344' },
  { nombre: 'Grupo Industrial Norte S.L.',      nif: 'B55667788' },
  { nombre: 'Servicios Avanzados BCN S.L.',     nif: 'B99001122' },
];

const PROVEEDORES = [
  { nombre: 'Adobe Systems España S.L.',  nif: 'B78901234' },
  { nombre: 'Vodafone España S.A.U.',     nif: 'A66778899' },
  { nombre: 'WeWork España S.L.',         nif: 'B33445566' },
  { nombre: 'Renfe Operadora S.M.E.',     nif: 'A11002233' },
  { nombre: 'Mutua Madrileña S.A.',       nif: 'A22113344' },
  { nombre: 'Microsoft Ibérica S.R.L.',   nif: 'B99887766' },
];

const CONCEPTOS_ING = [
  'Consultoría estratégica',
  'Desarrollo de software',
  'Diseño y UX',
  'Marketing digital',
  'Formación corporativa',
  'Auditoría de procesos',
];

const CONCEPTOS_GAS = [
  'Alquiler oficina coworking',
  'Suscripción software profesional',
  'Telecomunicaciones y datos',
  'Transporte y dietas',
  'Seguro de responsabilidad civil',
  'Publicidad online',
];

let idx = 1;

function doc(tipo, mes, tri, base, estado, extra = {}) {
  const n = idx++;
  const ivaP = 21;
  const cuotaIva = Math.round(base * ivaP / 100);
  const irpf = tipo === 'ingreso' ? Math.round(base * 0.15) : 0;
  const total = tipo === 'ingreso' ? base + cuotaIva - irpf : base + cuotaIva;
  const ci = n % CLIENTES.length;
  const pi = n % PROVEEDORES.length;

  return {
    id_documento: `DOC-${String(n).padStart(3,'0')}`,
    cliente_id: 'DEMO',
    fecha_subida: `${mes}-${String(Math.min(28, 3 + (n % 20))).padStart(2,'0')}`,
    fecha_procesado: `${mes}-${String(Math.min(28, 4 + (n % 20))).padStart(2,'0')}`,
    nombre_archivo: `factura_${tipo === 'ingreso' ? 'emitida' : 'recibida'}_${String(n).padStart(3,'0')}.pdf`,
    enlace_archivo: '',
    tipo_documento: 'factura',
    tipo_operacion: tipo,
    emisor: tipo === 'ingreso' ? 'Demo Consulting S.L.' : PROVEEDORES[pi].nombre,
    nif_emisor: tipo === 'ingreso' ? '12345678A' : PROVEEDORES[pi].nif,
    receptor: tipo === 'ingreso' ? CLIENTES[ci].nombre : 'Demo Consulting S.L.',
    nif_receptor: tipo === 'ingreso' ? CLIENTES[ci].nif : '12345678A',
    numero_factura: `${tipo === 'ingreso' ? 'F' : 'P'}2024-${String(n).padStart(3,'0')}`,
    fecha_factura: `${mes}-${String(Math.min(28, 2 + (n % 22))).padStart(2,'0')}`,
    concepto: tipo === 'ingreso'
      ? CONCEPTOS_ING[n % CONCEPTOS_ING.length]
      : CONCEPTOS_GAS[n % CONCEPTOS_GAS.length],
    base_imponible: String(base),
    tipo_iva: String(ivaP),
    cuota_iva: String(cuotaIva),
    irpf: String(irpf),
    total: String(total),
    moneda: 'EUR',
    categoria: tipo === 'ingreso' ? 'servicios' : 'gastos_operativos',
    periodo: mes,
    trimestre: tri,
    estado_revision: estado,
    confianza_extraccion: estado === 'incidencia' ? '0.71' : '0.97',
    revisado_manual: estado === 'revisado' ? 'Sí' : 'No',
    notas_revision: estado === 'incidencia' ? 'Revisar NIF receptor — posible discrepancia' : '',
    id_incidencia: estado === 'incidencia' ? `INC-${String(n).padStart(3,'0')}` : '',
    ...extra,
  };
}

export const demoDocs = [
  // T1 — cerrado
  doc('ingreso','2024-01','2024-T1',2500,'revisado'),
  doc('ingreso','2024-01','2024-T1',1700,'revisado'),
  doc('gasto',  '2024-01','2024-T1',350, 'revisado'),
  doc('gasto',  '2024-01','2024-T1',62,  'revisado'),
  doc('ingreso','2024-02','2024-T1',1800,'revisado'),
  doc('ingreso','2024-02','2024-T1',2000,'revisado'),
  doc('gasto',  '2024-02','2024-T1',45,  'revisado'),
  doc('ingreso','2024-03','2024-T1',2800,'revisado'),
  doc('ingreso','2024-03','2024-T1',2300,'incidencia'),
  doc('gasto',  '2024-03','2024-T1',450, 'revisado'),
  // T2 — cerrado
  doc('ingreso','2024-04','2024-T2',1500,'revisado'),
  doc('ingreso','2024-04','2024-T2',3100,'revisado'),
  doc('gasto',  '2024-04','2024-T2',95,  'revisado'),
  doc('ingreso','2024-05','2024-T2',3200,'revisado'),
  doc('ingreso','2024-05','2024-T2',3000,'revisado'),
  doc('gasto',  '2024-05','2024-T2',450, 'revisado'),
  doc('gasto',  '2024-05','2024-T2',180, 'revisado'),
  doc('ingreso','2024-06','2024-T2',2800,'revisado'),
  doc('ingreso','2024-06','2024-T2',3000,'revisado'),
  doc('gasto',  '2024-06','2024-T2',380, 'revisado'),
  // T3 — en proceso
  doc('ingreso','2024-07','2024-T3',2900,'revisado'),
  doc('gasto',  '2024-07','2024-T3',350, 'revisado'),
  doc('gasto',  '2024-07','2024-T3',62,  'en_revision'),
  doc('ingreso','2024-08','2024-T3',2200,'revisado'),
  doc('ingreso','2024-09','2024-T3',3200,'en_revision'),
  doc('ingreso','2024-09','2024-T3',2300,'en_revision'),
  doc('gasto',  '2024-09','2024-T3',450, 'pendiente'),
  // T4 — pendiente
  doc('ingreso','2024-10','2024-T4',3800,'pendiente'),
  doc('ingreso','2024-10','2024-T4',3000,'pendiente'),
  doc('gasto',  '2024-10','2024-T4',200, 'pendiente'),
  doc('ingreso','2024-11','2024-T4',4200,'pendiente'),
  doc('ingreso','2024-11','2024-T4',3000,'pendiente'),
  doc('gasto',  '2024-11','2024-T4',450, 'pendiente'),
  doc('ingreso','2024-12','2024-T4',3600,'pendiente'),
  doc('ingreso','2024-12','2024-T4',2500,'pendiente'),
  doc('gasto',  '2024-12','2024-T4',62,  'pendiente'),
];
