import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumb from "../../components/breadcrumb";
import TreatmentService from '../../components/servicios/treatmentServiceSingle';
import { motion } from 'framer-motion';
import { tratamientosService } from '../../services/tratamientosService';

function TreatmentDetailPage() {
  const { treatmentId } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const data = await tratamientosService.getTratamientos();
        const foundTreatment = data.find(t => t.id == treatmentId);
        if (foundTreatment) {
          setTreatment(foundTreatment);
        } else {
          setError('Tratamiento no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el tratamiento');
      } finally {
        setLoading(false);
      }
    };
    fetchTreatment();
  }, [treatmentId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando tratamiento...</div>;
  }

  if (error || !treatment) {
    return <Navigate to="/servicios" />;
  }

  return (
    <>
      <Breadcrumb
        image={treatment.imagen}
        title={treatment.nombre}
        position="left"
        titleColor="#F5F5F5"
      />
      <BackgroundService>
        <FadeIn delay={0.2}>
          <TreatmentService
            image={treatment.imagen}
            title={treatment.nombre.toUpperCase()}
            description={treatment.descripcion}
            price={`$${treatment.precio}`}
            imagePosition="left"
            showLine={true}
            promoLink="https://wa.me/5491168520606"
            customButtonText="Reservá tu turno"
            customButtonLink="https://wa.me/5491168520606"
            tratamiento={treatment}
          />
        </FadeIn>

        {treatment.infoTitle && treatment.infoCards && (
          <FadeIn delay={0.3}>
            <InfoSection>
              <InfoTitle>{treatment.infoTitle}</InfoTitle>
              <InfoGrid>
                {treatment.infoCards.map((card, index) => (
                  <InfoCard key={index}>
                    <InfoIcon>{card.icon}</InfoIcon>
                    <InfoCardTitle>{card.title}</InfoCardTitle>
                    <InfoCardText>{card.text}</InfoCardText>
                  </InfoCard>
                ))}
              </InfoGrid>
            </InfoSection>
          </FadeIn>
        )}
      </BackgroundService>
    </>
  );
}

export default TreatmentDetailPage;

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