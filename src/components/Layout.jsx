import { Outlet } from 'react-router-dom';
import { useApp } from '../App';
import Nav from './Nav';
import DemoBanner from './DemoBanner';

export default function Layout() {
  const { isDemo } = useApp();

  return (
    <div className="flex h-screen bg-[#0B1F3B] overflow-hidden">
      <Nav />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isDemo && <DemoBanner />}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
