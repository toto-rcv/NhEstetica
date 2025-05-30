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
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    <Footer />
    </>
  );
}

export default App;

