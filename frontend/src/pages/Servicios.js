import React from 'react'
import styled from 'styled-components';
import Breadcrumb from "../components/breadcrumb";
import TreatmentsLeft from '../components/servicios/treatmentsLeft';
import TreatmentsRight from '../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';

function Servicios() {
  return (
    <>
      <Breadcrumb image="/servicios/primerPlano.jpg" title="Servicios" />
      <BackgroundService>
      <FadeIn delay={0.2}>
        <TreatmentsLeft image="/servicios/depilacion.jpg" title="TRATAMIENTO DEPILACIÓN LÁSER" description="En nuestro centro de estética corporal, trabajamos con tecnología Soprano Ice para una depilación láser eficaz, segura y casi indolora. Tratamos zonas como brazos, piernas, axilas y tira de cola, siempre con atención personalizada y foco en tu comodidad.  Tu piel suave, tu confianza renovada. Agendá tu turno y descubrí la diferencia." />
        </FadeIn>
           <FadeIn delay={0.3}>
        <TreatmentsRight image="/servicios/comienzoUno.jpeg" title="TRATAMIENTO CORPORAL" description="En nuestro centro te ofrecemos una variedad de tratamientos corporales diseñados para ayudarte a moldear tu figura, mejorar la textura de tu piel y potenciar tu bienestar general, como . Combinamos tecnología de vanguardia con un enfoque personalizado para lograr resultados visibles y duraderos" />
         </FadeIn>
            <FadeIn delay={0.4}>
        <TreatmentsLeft image="/servicios/comienzoUno.jpeg" title="TRATAMIENTO PEPE" description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias corporis obcaecati totam earum eum porro nemo magni? Iste molestias minus expedita nam." />
         </FadeIn>
            <FadeIn delay={0.5}>
        <TreatmentsRight image="/servicios/comienzoUno.jpeg" title="TRATAMIENTO FAUSTO" description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias corporis obcaecati totam earum eum porro nemo magni? Iste molestias minus expedita nam." />
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
  >
    {children}
  </motion.div>
);
