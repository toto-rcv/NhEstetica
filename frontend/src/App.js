import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/header';
import Footer from './components/footer';
import Inicio from './pages/Home';
import Servicios from './pages/Servicios';
import Nosotros from './pages/Nosotros';
import Productos from './pages/Productos';
import Promociones from './pages/Promociones';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import WhatsApp from './components/home/whatsApp-modal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import TratamientosCorporales from './pages/services/TratamientosCorporales';
import TratamientosFaciales from './pages/services/TratamientosFaciales';
import DepilacionLaser from './pages/services/DepilacionLaser';
import Masajes from './pages/services/Masajes';
import ProductDetail from './pages/products/ProductDetail';
import TreatmentDetailPage from './pages/services/TreatmentDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteFull from './components/ProtectedRouteFull';

// Importar páginas de admin
import InicioAdmin from './pages/admin/inicio';
import Caja from './pages/admin/caja';
import Clientes from './pages/admin/clientes';
import VentasTratamientos from './pages/admin/ventasTratamientos';
import VentasProductos from './pages/admin/ventasProductos';
import Personal from './pages/admin/personal';
import TablasRedirect from './components/tablas/TablasRedirect';
import ProductosAdmin from './pages/admin/productos';
import TratamientosAdmin from './pages/admin/tratamientos';
import ComisionesAdmin from './pages/admin/comisiones';
import TurnosAdmin from './pages/admin/turnos';
import ResumenMensual from './pages/admin/resumenMensual';
import Gerentes from './pages/admin/gerentes';
import ConfiguracionEmailPage from './pages/admin/configuracionEmail';

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
        <Route path="/register" element={<Register />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/contacto" element={<Contacto />} />

        {serviciosRoutes.map(({ path, element }) => (
          <Route key={path} path={`/servicios/${path}`} element={element} />
        ))}
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/servicios/corporales/:treatmentId" element={<TreatmentDetailPage />} />
        <Route path="/servicios/faciales/:treatmentId" element={<TreatmentDetailPage />} />
        <Route path="/servicios/masajes/:treatmentId" element={<TreatmentDetailPage />} />
        <Route path="/servicios/depilacion/:treatmentId" element={<TreatmentDetailPage />} />
        <Route path="/servicios/:treatmentId" element={<TreatmentDetailPage />} />

        {/* Rutas protegidas de admin */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <TablasRedirect />
          </ProtectedRoute>
        } />
        <Route path="/admin/estadisticas" element={
          <ProtectedRoute>
            <InicioAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/resumen" element={
          <ProtectedRouteFull>
            <ResumenMensual />
          </ProtectedRouteFull>
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
        <Route path="/admin/ventas/tratamientos" element={
          <ProtectedRoute>
            <VentasTratamientos />
          </ProtectedRoute>
        } />
        <Route path="/admin/ventas/productos" element={
          <ProtectedRoute>
            <VentasProductos />
          </ProtectedRoute>
        } />
        <Route path="/admin/personal" element={
          <ProtectedRoute>
            <Personal />
          </ProtectedRoute>
        } />
        <Route path="/admin/productos" element={
          <ProtectedRoute>
            <ProductosAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/tratamientos" element={
          <ProtectedRoute>
            <TratamientosAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/comisiones" element={
          <ProtectedRoute>
            <ComisionesAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/turnos" element={
          <ProtectedRoute>
            <TurnosAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/gerentes" element={
          <ProtectedRouteFull>
            <Gerentes />
          </ProtectedRouteFull>
        } />
        <Route path="/admin/configuracion-email" element={
          <ProtectedRouteFull>
            <ConfiguracionEmailPage />
          </ProtectedRouteFull>
        } />
        <Route path="/personal" element={
          <ProtectedRoute>
            <Personal />
          </ProtectedRoute>
        } />
        <Route path="/gerentes" element={
          <ProtectedRouteFull>
            <Gerentes />
          </ProtectedRouteFull>
        } />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />


      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

