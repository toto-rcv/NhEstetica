import React from 'react';
import styled from 'styled-components';
import Breadcrumb from "../../../components/breadcrumb";
import TreatmentService from '../../../components/servicios/treatmentservice';
import { motion } from 'framer-motion';

function DepiSopranoIce() {
  return (
    <>
      <Breadcrumb
        image="/servicios/Depilacion_laser/Depi_Ice.jpg"
        title="Depi Soprano Ice"
        position="left"
        titleColor="#F5F5F5"
      />
      <BackgroundService>
        <FadeIn delay={0.2}>
          <TreatmentService
            image="/servicios/Depilacion_laser/Depi_Ice.jpg"
            title="DEPI SOPRANO ICE"
            description="La tecnología más avanzada en depilación láser. El sistema Soprano Ice combina tres longitudes de onda para tratar todo tipo de piel y vello, con un efecto de enfriamiento que hace el tratamiento más cómodo y efectivo. Experimenta la depilación del futuro con resultados duraderos y mínimas molestias."
            price="$10.000"
            imagePosition="left"
            showLine={true}
            promoLink="https://wa.me/5491168520606"
            customButtonText="Reservá tu turno"
            customButtonLink="https://wa.me/5491168520606"
          />
        </FadeIn>

        {/* Información adicional sobre Soprano Ice */}
        <FadeIn delay={0.3}>
          <InfoSection>
            <InfoTitle>¿Por qué elegir Soprano Ice?</InfoTitle>
            <InfoGrid>
              <InfoCard>
                <InfoIcon>❄️</InfoIcon>
                <InfoCardTitle>Sistema de Enfriamiento</InfoCardTitle>
                <InfoCardText>
                  Tecnología de enfriamiento integrada que hace el tratamiento más cómodo y reduce las molestias.
                </InfoCardText>
              </InfoCard>
              <InfoCard>
                <InfoIcon>🎯</InfoIcon>
                <InfoCardTitle>Precisión Avanzada</InfoCardTitle>
                <InfoCardText>
                  Tres longitudes de onda combinadas para tratar todo tipo de piel y vello con máxima eficacia.
                </InfoCardText>
              </InfoCard>
              <InfoCard>
                <InfoIcon>⚡</InfoIcon>
                <InfoCardTitle>Resultados Rápidos</InfoCardTitle>
                <InfoCardText>
                  Ve resultados desde las primeras sesiones con tratamientos más rápidos y efectivos.
                </InfoCardText>
              </InfoCard>
              <InfoCard>
                <InfoIcon>🛡️</InfoIcon>
                <InfoCardTitle>Seguridad Garantizada</InfoCardTitle>
                <InfoCardText>
                  Tecnología aprobada por la FDA que garantiza la máxima seguridad en todos los tratamientos.
                </InfoCardText>
              </InfoCard>
            </InfoGrid>
          </InfoSection>
        </FadeIn>
      </BackgroundService>
    </>
  );
}

export default DepiSopranoIce;

// Styled Components
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
  </motion.div>
);

const InfoSection = styled.div`
    max-width: 1200px;
    margin: 4rem auto;
    padding: 0 2rem;
    text-align: center;

    @media (max-width: 768px) {
        margin: 2rem auto;
        padding: 0 1rem;
    }
`;

const InfoTitle = styled.h2`
    font-size: 2.5rem;
    color: var(--terciary-color);
    margin-bottom: 3rem;
    font-family: 'Saira', sans-serif;
    font-weight: 600;

    @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 2rem;
    }
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

const InfoCard = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const InfoIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 1rem;
`;

const InfoCardTitle = styled.h3`
    font-size: 1.3rem;
    color: var(--terciary-color);
    margin-bottom: 1rem;
    font-family: 'Saira', sans-serif;
    font-weight: 600;

    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
`;

const InfoCardText = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-color);

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const CTASection = styled.div`
    max-width: 800px;
    margin: 4rem auto;
    padding: 3rem 2rem;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 20px;
    color: white;

    @media (max-width: 768px) {
        margin: 2rem auto;
        padding: 2rem 1rem;
    }
`;

const CTATitle = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    font-family: 'Saira', sans-serif;
    font-weight: 600;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const CTAText = styled.p`
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const CTAButton = styled.a`
    display: inline-block;
    background: white;
    color: var(--primary-color);
    padding: 1rem 2.5rem;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    border: 2px solid white;

    &:hover {
        background: transparent;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        padding: 0.8rem 2rem;
        font-size: 1rem;
    }
`;
