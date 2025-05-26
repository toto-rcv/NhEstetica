import React from 'react'
import styled from 'styled-components';

function AboutUs() {
    return (
        <ServicesContainer>
            <ServicesContent>
                <TextContainer>
                    <TitleContainer>
                    <SubTitle>¿Qué hacemos?</SubTitle>
                    <Title>MIRÁ NUESTROS SERVICIOS</Title>
                    </TitleContainer>
                    <Description>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut facilisis nisl. Aenean sed ipsum dictum, porta lorem a, faucibus enim. Nam scelerisque, nisi congue dignissim rhoncus, nisl sem tincidunt eros, sit amet faucibus velit augue non odio. Phasellus molestie nibh sit amet enim sollicitudin gravida. Duis eget laoreet elit, quis tempus nibh.
                    </Description>
                    <ServicesGrid>
                            <ServiceCard image="slider/pepe.webp" label="ESTÉTICA CORPORAL" />
                            <ServiceCard image="slider/estetica_dos.jpg" label="ESTÉTICA FACIAL" />
                            <ServiceCard image="slider/estetica_tres.webp" label="RELLENOS Y CORRECCIONES" />
                            <ServiceCard image="slider/fausto.png" label="DEPILACIÓN LÁSER" />
                    </ServicesGrid>
                </TextContainer>
            </ServicesContent>
        </ServicesContainer>
    )
}

export default AboutUs

const ServicesContainer = styled.div`   
    padding: 3rem;
    display: flex;
    justify-content: center;
`;
const ServicesContent = styled.div`
    display: flex;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    gap: 2rem;
`;
const Image = styled.img`
    width: 300px;
    height: auto;
    border-radius: 15px;
`;
const TextContainer = styled.div`
    flex: 1;
    color: #000;
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
`;

const SubTitle = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 1rem;
    margin: 0 !important;
    padding: 5px 0;
    color: var(--terciary-color);
    font-family: var(--heading-font), sans-serif;
`;
const Title = styled.h2`
    font-size: 2.5rem;
    margin: 0 !important;
    padding: 5px 0 !important;
    margin-bottom: 1rem;
    color: var(--tertiary-color);
    font-family: var(--heading-font), sans-serif;
    transform: skew(-10deg);
`;
const Description = styled.p`
    font-size: 1.2rem;
    line-height: 1.5;
    color: #333;
    text-align: center;
`;

const Text = styled.p`
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: #555;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columnas */
  gap: 20px;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 1 columna en pantallas chicas */
  }
`;

const ServiceCard = styled.div`
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  width: 100%;
  height: 260px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    transition: 1s ease;
  }

  &::after {
    content: '${props => props.label}';
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    color: #fff;
    font-size: 1.4rem;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    font-family: var(--heading-font), sans-serif;
    z-index: 1;
    text-align: center;
    padding: 0 10px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
`;
