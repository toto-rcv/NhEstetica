import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Breadcrumb from "../../components/breadcrumb";
import TreatmentsLeft from '../../components/servicios/treatmentsLeft';
import TreatmentsRight from '../../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';
import { tratamientosService } from '../../services/tratamientosService';

function Masajes() {
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTratamientos = async () => {
      try {
        const data = await tratamientosService.getTratamientos();
        setTratamientos(data.filter(t => t.categoria && t.categoria.toLowerCase() === 'masajes'));
      } catch (err) {
        setError('Error al cargar tratamientos');
      } finally {
        setLoading(false);
      }
    };
    fetchTratamientos();
  }, []);

  return (
    <>
      <Breadcrumb
        image="/servicios/Masajes/Titular.jpg"
        title="Masajes"
        position="Right"
        titleColor="#F5F5F5"
      />
      <BackgroundService>
        {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando tratamientos...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>}
        {!loading && !error && tratamientos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>No hay tratamientos de masajes disponibles.</div>
        )}
        {!loading && !error && tratamientos.map((tratamiento, idx) => (
          <FadeIn delay={0.2 + idx * 0.1} key={tratamiento.id}>
            {idx % 2 === 0 ? (
              <TreatmentsLeft
                link="Masajes"
                image={tratamiento.imagen}
                title={tratamiento.nombre}
                showLine={true}
                description={tratamiento.descripcion}
                price={`$${tratamiento.precio}`}
                promoLink="https://wa.me/5491168520606"
                customButtonText="Saca turno"
                customButtonLink="https://wa.me/5491168520606"
                detailsLink={"/servicios/masajes/" + tratamiento.id}
              />
            ) : (
              <TreatmentsRight
                link="Masajes"
                image={tratamiento.imagen}
                title={tratamiento.nombre}
                showLine={true}
                description={tratamiento.descripcion}
                price={`$${tratamiento.precio}`}
                promoLink="https://wa.me/5491168520606"
                customButtonText="Saca turno"
                customButtonLink="https://wa.me/5491168520606"
                detailsLink={"/servicios/masajes/" + tratamiento.id}
              />
            )}
          </FadeIn>
        ))}
      </BackgroundService>
    </>
  );
}

export default Masajes;

const BackgroundService = styled.div`
    background: var(--background-color);
    padding: 4rem 0;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 2rem 0;
    }
`;

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
    style={{ marginBottom: '2rem', position: 'relative' }}
  >
    {children}
    <div style={{ borderBottom: '1px solid #ccc', marginTop: '2rem', width: '75%', marginLeft: 'auto', marginRight: 'auto' }} />
  </motion.div>
);

const Image = styled.img`
    position: absolute;
    width: 140px;
    height: auto;
    z-index: 1;
    display: none;

    &.mujer-lineal {
        top: 87%;
        right: 22px;
    }

    &.floral-image {
        top: 120rem;
        right: 5px;
    }

    &.hat-image {
        top: 150rem;
        left: 5px;
    }

    @media (min-width: 1500px) {
        display: block;
    }
`;

const ImageEspalda = styled.img`
    position: absolute;
    width: 150px;
    height: auto;
    top: 91rem;
    z-index: 1;
    display: none;

    @media (min-width: 1500px) {
        display: block;
    }
`;
