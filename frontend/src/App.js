import { useEffect, useState } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Inicio from './pages/Home';
import Servicios from './pages/Servicios';
import Nosotros from './pages/Nosotros';
import Productos from './pages/Productos';
import Promociones from './pages/Promociones';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import WhatsApp from './components/home/whatsApp-modal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import TratamientosCorporales from './pages/services/TratamientosCorporales';
import TratamientosFaciales from './pages/services/TratamientosFaciales';
import DepilacionLaser from './pages/services/DepilacionLaser';
import Masajes from './pages/services/Masajes';
import ProductDetail from './pages/products/ProductDetail';
import TreatmentDetailPage from './pages/services/TreatmentDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

// Importar páginas de admin
import InicioAdmin from './pages/admin/inicio';
import Caja from './pages/admin/caja';
import Clientes from './pages/admin/clientes';
import Ventas from './pages/admin/ventas';
import Personal from './pages/admin/personal';
import TablasRedirect from './components/tablas/TablasRedirect';

const serviciosRoutes = [
  { path: 'TratamientosCorporales', element: <TratamientosCorporales /> },
  { path: 'TratamientosFaciales', element: <TratamientosFaciales /> },
  { path: 'DepilacionLaser', element: <DepilacionLaser /> },
  { path: 'Masajes', element: <Masajes /> },
];

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <WhatsApp />}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/contacto" element={<Contacto />} />
        
        {serviciosRoutes.map(({ path, element }) => (
          <Route key={path} path={`/servicios/${path}`} element={element} />
        ))}
         <Route path="/productos/:productName" element={<ProductDetail />} />
         <Route path="/servicios/:treatmentId" element={<TreatmentDetailPage />} />

        {/* Rutas protegidas de admin */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <TablasRedirect />
          </ProtectedRoute>
        } />
        <Route path="/admin/inicio" element={
          <ProtectedRoute>
            <InicioAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/caja" element={
          <ProtectedRoute>
            <Caja />
          </ProtectedRoute>
        } />
        <Route path="/admin/clientes" element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        } />
        <Route path="/admin/ventas" element={
          <ProtectedRoute>
            <Ventas />
          </ProtectedRoute>
        } />
        <Route path="/admin/personal" element={
          <ProtectedRoute>
            <Personal />
          </ProtectedRoute>
        } />

      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;

