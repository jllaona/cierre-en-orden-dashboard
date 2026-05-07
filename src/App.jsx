import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { createContext, useContext } from 'react';
import Layout from './components/Layout';
import ResumenMensual from './pages/ResumenMensual';
import Documentos from './pages/Documentos';
import IVACierre from './pages/IVACierre';

export const AppContext = createContext({ sheetId: null, isDemo: true });
export const useApp = () => useContext(AppContext);

function AppInner() {
  const [params] = useSearchParams();
  const sheetId = params.get('sheetId') || null;
  const isDemo = !sheetId;
  const qs = sheetId ? `?sheetId=${sheetId}` : '';

  return (
    <AppContext.Provider value={{ sheetId, isDemo }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={`/resumen${qs}`} replace />} />
          <Route path="resumen"    element={<ResumenMensual />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="iva"        element={<IVACierre />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
