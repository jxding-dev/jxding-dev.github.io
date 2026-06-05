import { Outlet } from 'react-router-dom';
import AnomalyLayer from './AnomalyLayer.jsx';
import BootScreen from './BootScreen.jsx';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <div className="phone-stage">
      <div className="site-shell">
        <Header />
        <main className="site-main">
          <Outlet />
        </main>
        <AnomalyLayer />
        <BootScreen />
      </div>
    </div>
  );
}
