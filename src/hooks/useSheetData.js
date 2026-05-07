import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { demoKpis, demoIva, demoDocs } from '../data/demoData';

const DEMO_MAP = {
  '/api/kpis': demoKpis,
  '/api/iva': demoIva,
  '/api/documentos': demoDocs,
};

const API_URL = import.meta.env.VITE_API_URL || '';

export function useSheetData(endpoint) {
  const { sheetId, isDemo } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isDemo) {
      const timer = setTimeout(() => {
        setData(DEMO_MAP[endpoint] ?? []);
        setLoading(false);
      }, 250);
      return () => clearTimeout(timer);
    }

    fetch(`${API_URL}${endpoint}?sheetId=${sheetId}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${r.statusText}`);
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [endpoint, sheetId, isDemo]);

  return { data, loading, error };
}
