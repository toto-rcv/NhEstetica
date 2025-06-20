import React from 'react'
import styled from 'styled-components';
import Breadcrumb from "../../components/breadcrumb";
import TreatmentsLeft from '../../components/servicios/treatmentsLeft';
import TreatmentsRight from '../../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';

function Masajes() {
  return (
    <>
      <Breadcrumb
        image="/servicios/Masajes/Titular.jpg"
        title="Masajes"
        position="Right"
        titleColor="#F5F5F5"
      />
      <BackgroundService>
        <FadeIn delay={0.2}>
          <Image src="/servicios/MujerLineal.png" alt="Servicios" className="mujer-lineal" />
          <TreatmentsLeft
            link="Masajes"
            image="/servicios/Masajes/MaderoTerapia.jpg"
            title="MADEROTERAPIA"
            showLine={true}
            description="Tratamiento corporal que utiliza herramientas de madera para modelar y reafirmar el cuerpo. Esta técnica milenaria ayuda a reducir la celulitis, mejorar la circulación y tonificar los músculos. Ideal para quienes buscan una alternativa natural y efectiva para el moldeado corporal."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
            customButtonText="Saca turno"
            customButtonLink="https://wa.me/5491168520606"
          />
        </FadeIn>
        <FadeIn delay={0.3}>
          <TreatmentsRight
            link="Masajes"
            image="/servicios/Masajes/MasajeReductor.jpg"
            title="MASAJES REDUCTORES"
            showLine={true}
            description="Tratamiento especializado para reducir medidas y eliminar grasa localizada. Combinamos técnicas manuales con productos específicos para maximizar resultados. Perfecto para quienes buscan perder centímetros y mejorar la apariencia de su silueta de manera natural."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
            customButtonText="Saca turno"
            customButtonLink="https://wa.me/5491168520606"
          />
        </FadeIn>
      </BackgroundService>
    </>
  )
}

export default Masajes

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
