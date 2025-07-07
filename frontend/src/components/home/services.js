import React from 'react'
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

function AboutUs() {
    const services = [
        { image: '/servicios/TratamientoCorporal.jpg', label: 'ESTÉTICA CORPORAL', href: '/servicios/TratamientosCorporales' },
        { image: '/servicios/TratamientoFaciales.jpg', label: 'ESTÉTICA FACIAL', href: '/servicios/TratamientosFaciales' },
        { image: '/servicios/Masajes.jpg', label: 'RELLENOS Y CORRECCIONES', href: '/servicios/Masajes' },
        { image: '/servicios/depilacion.jpg', label: 'DEPILACIÓN LÁSER', href: '/servicios/DepilacionLaser' },
    ];

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ServicesContainer>
            <TextContainer>
                <SubTitle>¿Qué hacemos?</SubTitle>
                <Title>MIRÁ NUESTROS SERVICIOS</Title>
                <Description>
                Descubre la diferencia que un enfoque personalizado de belleza y bienestar puede hacer. El personal experimentado de NH Estética ,se dedica a brindar un servicio excepcional y tratamientos personalizados para ayudarte a verte y sentirte lo mejor posible.
                </Description>
                <ServiceButton to="/servicios" onClick={handleClick}>Ver todos</ServiceButton>
                
            </TextContainer>

            <CardsGrid>
               {services.map((service, i) => (
    <Card
        key={i}
        image={service.image}
        className={i % 2 === 1 ? 'offset' : ''}
        as={RouterLink}
        to={service.href}
        onClick={handleClick}
    >
        <CardOverlay />
        <CardContent>
            <CardLabel>{service.label}</CardLabel>
            <CardButton>VER MÁS →</CardButton>
        </CardContent>
    </Card>
))}

            </CardsGrid>
        </ServicesContainer>
    );
}

export default AboutUs;

const ServicesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 8rem 3rem;
    max-width: 1300px;
    margin: auto;
    gap: 4rem;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        padding: 4rem 3rem;
        align-items: center;
    }
`;

const TextContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 570px;
    gap: 15px;

    @media (max-width: 768px) {
        align-items: center;
    }
`;

const SubTitle = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--terciary-color);
    margin: 0;
    font-family: var(--heading-font), sans-serif;
`;

const Title = styled.h2`
    font-size: 2.5rem;
    color: var(--tertiary-color);
    font-family: var(--heading-font), sans-serif;
    transform: skew(-10deg);
    margin-bottom: 1rem;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 2.3rem;
    }
`;

const Description = styled.p`
    font-size: 1.1rem;
    line-height: 1.6;
    color: #444;
    margin: 0;
`;

const ServiceButton = styled(RouterLink)`
    padding: 15px 30px;
    font-size: 1rem;
    background-color: var(--terciary-color);
    font-family: var(--heading-font);
    font-weight: 600;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    display: inline-block;
    margin-top: 20px;
    width: fit-content;


    &:hover {
        background-color: color-mix(in srgb, var(--terciary-color) 95%, black 5%);
        transform: scale(1.05);
    }
`;

const CardsGrid = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const Card = styled.div`
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  height: 300px;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  align-items: flex-end;
  transition: transform 0.3s;

  &.offset {
    margin-top: 2rem; // 👈 desplazás solo la 2da columna
  }

  &:hover {
    transform: scale(1.02);
  }

  &.offset {
    @media (min-width: 769px) {
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      margin-top: 0;
    }
  }
`;


const CardOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
`;

const CardContent = styled.div`
    position: relative;
    z-index: 1;
    padding: 1rem;
    color: #fff;
`;

const CardLabel = styled.h4`
    font-size: 1.3rem;
    margin: 0;
    font-family: var(--heading-font), sans-serif;
`;

const CardButton = styled.p`
    font-size: 0.9rem;
    margin-top: 0.3rem;
    text-decoration: none;
    cursor: pointer;
`;

