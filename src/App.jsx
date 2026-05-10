import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Repository from './pages/Repository';
import Tree from './pages/Tree';
import Query from './pages/Query';
import Suppliers from './pages/Suppliers';
import Incidents from './pages/Incidents';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index         element={<Dashboard />} />
          <Route path="fleet"      element={<Fleet />} />
          <Route path="repository" element={<Repository />} />
          <Route path="tree"       element={<Tree />} />
          <Route path="query"      element={<Query />} />
          <Route path="suppliers"  element={<Suppliers />} />
          <Route path="incidents"  element={<Incidents />} />
          <Route path="reports"    element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
