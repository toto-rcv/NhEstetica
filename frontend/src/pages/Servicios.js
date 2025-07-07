import React from 'react'
import styled from 'styled-components';
import Breadcrumb from "../components/breadcrumb";
import TreatmentsLeft from '../components/servicios/treatmentsLeft';
import TreatmentsRight from '../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';

function Servicios() {
  return (
    <>
      <Breadcrumb image="/servicios/primerPlano.jpg" title="Servicios" titleColor="white" textShadow={true} />
      <BackgroundService>
        <FadeIn delay={0.2}>
          <Image src="/servicios/MujerLineal.png" alt="Servicios" />
          <TreatmentsLeft 
            link="DepilacionLaser" 
            image="/servicios/depilacion.jpg" 
            title="TRATAMIENTOS DE DEPILACIÓN LÁSER" 
            description="En nuestro centro de estética corporal, trabajamos con tecnología Soprano Ice para una depilación láser eficaz, segura y casi indolora. Tratamos zonas como brazos, piernas, axilas y tira de cola, siempre con atención personalizada y foco en tu comodidad.  Tu piel suave, tu confianza renovada. Agendá tu turno y descubrí la diferencia."
            customButtonText="Ver más"
          />
        </FadeIn>
        <FadeIn delay={0.3}>
          <TreatmentsRight 
            link="TratamientosCorporales" 
            image="/servicios/TratamientoCorporal.jpg" 
            title="TRATAMIENTOS CORPORALES" 
            description="En nuestro centro te ofrecemos una variedad de tratamientos corporales como L lipo, Cavix, Mesoteriapia Corporal, Radiofrecuencia y más, diseñados para ayudarte a moldear tu figura, mejorar la textura de tu piel y potenciar tu bienestar general. Combinamos tecnología de vanguardia con un enfoque personalizado para lograr resultados visibles y duraderos"
            customButtonText="Ver más"
          />
        </FadeIn>
        <FadeIn delay={0.4}>
          <ImageEspalda src="/servicios/mujerLinealEspalda.png" alt="Servicios" />
          <TreatmentsLeft  
            link="TratamientosFaciales" 
            image="/servicios/TratamientoFaciales.jpg" 
            title="TRATAMIENTOS FACIALES" 
            description="En nuestro centro te ofrecemos una amplia gama de tratamientos faciales como Electroporación, Dermaplaning, Dermapen, Exosomas, Radiofrecuencia, HydraFacial, Vacum, además de faciales personalizados, perfilado, laminado de cejas y más. Todos están pensados para mejorar la salud y apariencia de tu piel, brindarte un rostro más luminoso, uniforme y revitalizado. Utilizamos tecnología avanzada y un enfoque profesional para que cada sesión se adapte a tus necesidades y logres resultados visibles desde la primera aplicación."
            customButtonText="Ver más"
          />
        </FadeIn>
        <FadeIn delay={0.5}>
          <ImageFloral src="/servicios/flor.png" alt="Servicios" />
          <TreatmentsRight 
            link="Masajes" 
            image="/servicios/Masajes.jpg" 
            title="MASAJES" 
            description="En nuestro centro también podés disfrutar de masajes relajantes y terapéuticos, como masajes tradicionales y sesiones de maderoterapia. Estas técnicas están pensadas para aliviar tensiones, mejorar la circulación, reducir el estrés y ayudarte a reconectar con tu bienestar físico y emocional. Combinamos manos expertas con un ambiente cálido y profesional para que cada experiencia sea única y renovadora."
            customButtonText="Ver más"
          />
        </FadeIn>
      </BackgroundService>
    </>
  )
}

export default Servicios

const BackgroundService = styled.div`
    background: var(--background-color);
    padding: 4rem 0;
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
    style={{ marginBottom: '2rem' }}
  >
    {children}
    
    <div style={{ borderBottom: '1px solid #ccc', marginTop: '2rem', width: '75%', marginLeft: 'auto', marginRight: 'auto' }} />
  </motion.div>
);

const Image = styled.img`
    position: absolute;
    width: 140px;
    height: auto;
    top: 87%;
    right: 22px;

    @media (max-width: 1480px) {
        display: none;
    }
`;

const ImageEspalda = styled.img`
    position: absolute;
    width: 150px;
    height: auto;
    top: 91rem;

    @media (max-width: 1024px) {
        display: none;
    }
`;

const ImageFloral = styled.img`
    position: absolute;
    width: 150px;
    height: auto;
    top: 120rem;
    right: 5px;

    @media (max-width: 1024px) {
        display: none;
    }
`;
