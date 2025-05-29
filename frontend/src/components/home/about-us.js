import React from 'react'
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

function AboutUs() {
    return (
        <AboutUsContainer>
            <AboutUsContent>
                <Image src='aboutUs/mujerflor.png' alt="mujerFlor" />
                <ImageFlor src='aboutUs/flor.png' alt="Flor" />
                <TextContainer>
                    <TitleContainer>
                    <SubTitle>¿Quiénes somos?</SubTitle>
                    <Title>SOBRE NOSOTROS</Title>
                    </TitleContainer>
                    <Description>
                        <Text>Algunos consideran que la apariencia física es algo superficial, y que la medicina estética responde al egocentrismo. En NH, pensamos lo contrario: creemos que la apariencia influye profundamente en la autoestima, la calidad de vida y el desempeño social. Cuando se aplica con seriedad y responsabilidad, la medicina estética puede lograr cambios significativos y positivos.</Text>
                        <Text>Sabemos que no todos los tratamientos son para todas las personas, y por eso ofrecemos un asesoramiento personalizado y profesional. Aquí encontrarás información clara y confiable sobre cada tratamiento, con sus ventajas y desventajas, para que tomes decisiones informadas y seguras.</Text>
                        <Text>Te esperamos en nuestro consultorio, equipado con tecnología de última generación y un equipo altamente calificado, listo para ayudarte a sentirte mejor, siempre priorizando tu salud y bienestar.</Text>
                    </Description>
                   <ButtonTitle to="/about">Conoce más</ButtonTitle>
                </TextContainer>
            </AboutUsContent>
        </AboutUsContainer>
    )
}

export default AboutUs

const AboutUsContainer = styled.div` 
    padding: 4rem;
    display: flex;
    justify-content: center;

      @media (max-width: 768px) {
            padding: 2.5rem;
        }
`;
const AboutUsContent = styled.div`
    display: flex;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    gap: 2rem;
    
    @media (max-width: 768px) {
      text-align: center;
  }
`;
const Image = styled.img`
    width: 140px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    margin-top: 15rem;
    right: 2%;
    filter: drop-shadow(5px 5px 10px rgba(224, 117, 212, 1));
`;

const ImageFlor = styled.img`
    width: 100px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    margin-bottom: 10rem;
    left: 3%;
    filter: drop-shadow(5px 5px 10px rgba(224, 117, 212, 1));
`;

const TextContainer = styled.div`
    flex: 1;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    color: var(--terciary-color);
    margin: 0 !important;
    font-family: var(--heading-font), sans-serif;
`;

const Title = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--tertiary-color);
    margin: 0 !important;
    font-family: var(--heading-font), sans-serif;
    transform: skew(-10deg);

    @media (max-width: 768px) {
      font-size: 2.3em;
    margin-bottom: 0rem;

    }
`;
const Description = styled.div`
    font-size: 1.2rem;
    line-height: 1.5;
    color: #333;
    text-align: center;
`;

const Text = styled.p`
    margin: 2rem 0;
    font-size: 1.1rem;
    color: #555;
`;

const ButtonTitle = styled(RouterLink)`
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

    &:hover {
        background-color: color-mix(in srgb, var(--terciary-color) 95%, black 5%);
        transform: scale(1.05);
    }
`;
