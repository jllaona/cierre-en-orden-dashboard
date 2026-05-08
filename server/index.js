import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/debug', (req, res) => {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || 'NO EXISTE';
  res.json({
    length: raw.length,
    first100: raw.substring(0, 100),
    hasLiteralBackslashN: raw.includes('\\\\n'),
    hasRealNewline: raw.includes('\\n'),
    startsWithBrace: raw.startsWith('{')
  });
});

const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

function createSheetsClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON no está definido en .env');

  const credentials = JSON.parse(raw.replace(/\\n/g, '\n'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function readSheet(sheetId, range) {
  const sheets = createSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];

  const [headers, ...dataRows] = rows;
  return dataRows.map(row =>
    Object.fromEntries(headers.map((h, i) => [h.trim(), row[i] ?? '']))
  );
}

app.get('/api/kpis', async (req, res) => {
  try {
    const { sheetId } = req.query;
    if (!sheetId) return res.status(400).json({ error: 'sheetId requerido' });
    res.json(await readSheet(sheetId, 'KPIs_Dashboard!A:Z'));
  } catch (err) {
    console.error('[kpis]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/iva', async (req, res) => {
  try {
    const { sheetId } = req.query;
    if (!sheetId) return res.status(400).json({ error: 'sheetId requerido' });
    res.json(await readSheet(sheetId, 'IVA_Trimestral!A:Z'));
  } catch (err) {
    console.error('[iva]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/documentos', async (req, res) => {
  try {
    const { sheetId } = req.query;
    if (!sheetId) return res.status(400).json({ error: 'sheetId requerido' });
    res.json(await readSheet(sheetId, 'Documentos!A:Z'));
  } catch (err) {
    console.error('[documentos]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Proxy activo → http://localhost:${PORT}`);
});
