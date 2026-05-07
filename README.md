# Cierre en Orden — Dashboard Financiero

Dashboard privado para clientes de Cierre en Orden. Lee datos de Google Sheets via Service Account y los presenta en una interfaz profesional con tres secciones: Resumen Mensual, Documentos e IVA Trimestral.

## Arquitectura

```
cierre-en-orden-dashboard/
├── server/index.js      # Proxy Express — autentica con Google y expone /api/*
└── src/                 # Frontend React + Vite
    ├── components/      # Layout, Nav, KPICard, DemoBanner, EvolucionChart
    ├── pages/           # ResumenMensual, Documentos, IVACierre
    ├── hooks/           # useSheetData (demo o real)
    └── data/            # demoData.js (datos ficticios de ejemplo)
```

En desarrollo Vite proxea `/api` al servidor Express. En producción se puede desplegar el servidor por separado y apuntar `VITE_API_URL` a su URL.

## Instalación

```bash
cd cierre-en-orden-dashboard
npm install
```

Copia el archivo de entorno:

```bash
cp .env.example .env
```

Edita `.env` con las credenciales de tu Service Account:

```env
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
PORT=3001
VITE_API_URL=
```

## Desarrollo

```bash
npm run dev
```

Arranca el servidor proxy (puerto 3001) y el cliente Vite (puerto 3000) en paralelo.

Abre [http://localhost:3000](http://localhost:3000) — verás el dashboard en **modo demo** con datos ficticios.

Para conectar una hoja real:

```
http://localhost:3000/resumen?sheetId=TU_GOOGLE_SHEET_ID
```

El `sheetId` es el ID largo visible en la URL de Google Sheets:
`https://docs.google.com/spreadsheets/d/**ESTE_ES_EL_ID**/edit`

## Configurar Google Sheets

### 1. Crear Service Account

1. Google Cloud Console → IAM y administración → Cuentas de servicio
2. Crear cuenta → descarga el JSON de claves
3. Pega el contenido del JSON (en una sola línea) en `GOOGLE_SERVICE_ACCOUNT_JSON`

### 2. Compartir la hoja

Comparte la hoja de Google Sheets con el email de la Service Account (`...@....iam.gserviceaccount.com`) con permiso de **solo lectura**.

### 3. Estructura de la hoja

La hoja debe tener exactamente tres pestañas con estas columnas:

**`KPIs_Dashboard`**
```
cliente_id | periodo | ingresos_brutos | gastos_totales | beneficio_estimado |
iva_repercutido | iva_soportado | iva_previsto_pagar | irpf_retenido |
docs_procesados | docs_incidencia | docs_pendientes | incidencias_abiertas
```

**`IVA_Trimestral`**
```
cliente_id | trimestre | iva_repercutido | iva_soportado | iva_resultado |
irpf_retenido_total | docs_incluidos | estado_cierre | fecha_cierre | notas_cierre
```

**`Documentos`**
```
id_documento | cliente_id | fecha_subida | fecha_procesado | nombre_archivo |
enlace_archivo | tipo_documento | tipo_operacion | emisor | nif_emisor |
receptor | nif_receptor | numero_factura | fecha_factura | concepto |
base_imponible | tipo_iva | cuota_iva | irpf | total | moneda | categoria |
periodo | trimestre | estado_revision | confianza_extraccion |
revisado_manual | notas_revision | id_incidencia
```

## Producción

```bash
npm run build        # genera dist/
npm start            # arranca el servidor Express
```

Sirve los archivos de `dist/` con nginx o cualquier CDN. El servidor Express puede desplegarse en Railway, Render o similar.

Variables de entorno en producción:

```env
GOOGLE_SERVICE_ACCOUNT_JSON=...  # obligatorio
PORT=3001
VITE_API_URL=https://api.tudominio.com  # URL pública del servidor Express
```

## URL por cliente

Cada cliente recibe un enlace único con su `sheetId`:

```
https://dashboard.cierreenorden.com/resumen?sheetId=XXXXXXXXXXXX
```

No hay autenticación adicional — la seguridad recae en que el enlace sea privado y en que la Service Account solo tenga acceso a la hoja específica de cada cliente.
