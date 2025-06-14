import React from 'react'
import styled from 'styled-components';
import Breadcrumb from "../../components/breadcrumb";
import TreatmentsLeft from '../../components/servicios/treatmentsLeft';
import TreatmentsRight from '../../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';

function DepilacionLaser() {
  return (
    <>
      <Breadcrumb
        image="/servicios/Depilacion_laser/Titular.jpg"
        title="Depilación Láser"
        position="left"
      />
      <BackgroundService>
        <FadeIn delay={0.2}>
          <Image src="/servicios/MujerLineal.png" alt="Servicios" className="mujer-lineal" />
          <TreatmentsLeft
            link="DepilacionLaser"
            image="/servicios/Depilacion_laser/Titular.jpg"
            title="DEPI SOPRANO ICE"
            showLine={true}
            description="La tecnología más avanzada en depilación láser. El sistema Soprano Ice combina tres longitudes de onda para tratar todo tipo de piel y vello, con un efecto de enfriamiento que hace el tratamiento más cómodo y efectivo. Experimenta la depilación del futuro con resultados duraderos y mínimas molestias."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
          />
        </FadeIn>
        <FadeIn delay={0.3}>
          <TreatmentsRight
            link="DepilacionLaser"
            image="/servicios/Depilacion_laser/Titular.jpg"
            title="DEPILACIÓN LÁSER BRAZOS"
            showLine={true}
            description="Tratamiento completo para eliminar el vello de los brazos de forma permanente. Ideal para lograr una piel suave y sin vello en toda la zona. Nuestro tratamiento personalizado se adapta a tu tipo de piel y vello para obtener los mejores resultados."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
          />
        </FadeIn>
        <FadeIn delay={0.4}>
          <ImageEspalda src="/servicios/mujerLinealEspalda.png" alt="Servicios" style={{ position: 'absolute', top: '5rem', left: '5px', width: '150px', height: 'auto' }} />
          <TreatmentsLeft
            link="DepilacionLaser"
            image="/servicios/Depilacion_laser/Titular.jpg"
            title="DEPILACIÓN LÁSER PIERNAS"
            showLine={true}
            description="Tratamiento completo para piernas que elimina el vello de forma permanente. Incluye piernas completas o medias piernas según tus necesidades. Disfruta de piernas suaves y sin vello durante todo el año con nuestro tratamiento profesional."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
          />
        </FadeIn>
        <FadeIn delay={0.5}>
          <ImageEspalda src="/servicios/MujerSombrero.png" alt="Servicios" style={{ position: 'absolute', top: '20rem', right: '5px', width: '150px', height: 'auto' }} />
          <TreatmentsRight
            link="DepilacionLaser"
            image="/servicios/Depilacion_laser/Titular.jpg"
            title="DEPILACION TIRA DE COLA"
            showLine={true}
            description="Tratamiento específico para la zona de la tira de cola, ideal para mantener esta área libre de vello de forma permanente. Realizado con la última tecnología para garantizar resultados efectivos y seguros."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
          />
        </FadeIn>
        <FadeIn delay={0.6}>
          <Image src="/servicios/flor.png" alt="Servicios" className="floral-image" style={{ position: 'absolute', top: '20rem', left: '5px', width: '150px', height: 'auto' }} />
          <TreatmentsLeft
            link="DepilacionLaser"
            image="/servicios/Depilacion_laser/Titular.jpg"
            title="DEPILACIÓN LÁSER ESPALDA"
            showLine={true}
            description="Tratamiento efectivo para eliminar el vello de la espalda de forma permanente, ideal para hombres y mujeres que buscan una solución definitiva. Nuestro equipo profesional garantiza un tratamiento seguro y eficaz."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
          />
        </FadeIn>
        <FadeIn delay={0.7}>
          <TreatmentsRight
            link="DepilacionLaser"
            image="/servicios/Depilacion_laser/Titular.jpg"
            title="DEPILACIÓN LÁSER PECHO"
            showLine={true}
            description="Tratamiento especializado para eliminar el vello del pecho de forma permanente. Diseñado para proporcionar resultados efectivos y duraderos, adaptándose a las necesidades específicas de cada cliente."
            price="$10.000"
            promoLink="https://wa.me/5491168520606"
          />
        </FadeIn>
      </BackgroundService>
    </>
  )
}

export default DepilacionLaser

const BackgroundService = styled.div`
    background: var(--background-color);
    padding: 4rem 0;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 2rem 0;
    }
`;

const FadeIn = styled(motion.div)`
    margin-bottom: 2rem;
    position: relative;

    &::after {
        content: '';
        display: block;
        border-bottom: 1px solid #ccc;
        width: 75%;
        margin: 2rem auto 0;
    }

    @media (max-width: 768px) {
        margin-bottom: 1rem;
        
        &::after {
            width: 90%;
            margin: 1rem auto 0;
        }
    }
`;

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