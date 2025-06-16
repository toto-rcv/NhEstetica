import { useEffect, useState } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Inicio from './pages/Home';
import Servicios from './pages/Servicios';
import Nosotros from './pages/Nosotros';
import Productos from './pages/Productos';
import Promociones from './pages/Promociones';
import Contacto from './pages/Contacto';
import WhatsApp from './components/home/whatsApp-modal';
import { Routes, Route, Link } from 'react-router-dom';
import TratamientosCorporales from './pages/services/TratamientosCorporales';
import TratamientosFaciales from './pages/services/TratamientosFaciales';
import DepilacionLaser from './pages/services/DepilacionLaser';
import Masajes from './pages/services/Masajes';
import ProductDetail from './pages/products/ProductDetail'; 

const serviciosRoutes = [
  { path: 'TratamientosCorporales', element: <TratamientosCorporales /> },
  { path: 'TratamientosFaciales', element: <TratamientosFaciales /> },
  { path: 'DepilacionLaser', element: <DepilacionLaser /> },
  { path: 'Masajes', element: <Masajes /> },
];

function App() {

  return (
    <>    
    <Header />
       <WhatsApp />
       <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/contacto" element={<Contacto />} />
        
        {serviciosRoutes.map(({ path, element }) => (
          <Route key={path} path={`/servicios/${path}`} element={element} />
        ))}
         <Route path="/productos/:productName" element={<ProductDetail />} />

      </Routes>
    <Footer />
    </>
  );
}

export default App;

