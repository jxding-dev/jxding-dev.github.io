import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Archive from './pages/Archive.jsx';
import RecordDetail from './pages/RecordDetail.jsx';
import Search from './pages/Search.jsx';
import Observer from './pages/Observer.jsx';
import Submit from './pages/Submit.jsx';
import Lost from './pages/Lost.jsx';
import HiddenRecord from './pages/HiddenRecord.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/record/:id" element={<RecordDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/observer" element={<Observer />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/hidden/:id" element={<HiddenRecord />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/lost" replace />} />
      </Route>
    </Routes>
  );
}
