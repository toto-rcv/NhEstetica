import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { useEffect } from "react";

function Slider({ isMenuOpen }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = [
    '/slider/Imagen4.jpg',
    '/slider/Imagen2.jpg',
    '/slider/Imagen1.jpg',
    '/slider/Imagen3.jpg',
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

    React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5000ms = 5 segundos

    return () => clearInterval(interval); // limpiar intervalo al desmontar
  }, [nextSlide]);


  return (
    <SliderContainer>
      <SliderWrapper>
        <SlideContainer>
          <SlideOverlay />
          <SliderImage src={slides[currentSlide]} alt="Slider" />
          <ContactButtonWrapper>
            <Title>BIENVENIDO A NH ESTÉTICA</Title>
            <Subtitle>Tu belleza, nuestra pasión</Subtitle>
            <ContactButton to="/contacto">CONTACTANOS</ContactButton>
          </ContactButtonWrapper>
        </SlideContainer>
      </SliderWrapper>
      <ControlsWrapper>
        <NavigationButton onClick={prevSlide}>❮</NavigationButton>
        <NavigationButton onClick={nextSlide}>❯</NavigationButton>
      </ControlsWrapper>
    </SliderContainer>
  );
}
export default Slider;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 750px;
  overflow: hidden;
  margin: 0;
  padding: 0;

  
  @media (max-width: 768px) {
      height: 70vh;
  }
`;

const SliderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease-in-out;
`;

const SlideContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SliderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  position: relative;

`;

const ContactButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2; // más alto que el overlay
  display: flex;
  flex-direction: column;
  align-items: center;

    @media (max-width: 768px) {
      gap: 3px;
  }
`;

const ContactButton = styled(RouterLink)`
  padding: 15px 30px;
  font-size: 1rem;
  background-color: var(--terciary-color);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  display: inline-block;
  font-family: var(--heading-font);
  font-weight: 600;

  &:hover {
    background-color: color-mix(in srgb, var(--terciary-color) 95%, black 5%);
    transform: scale(1.05);
  }
`;

const ControlsWrapper = styled.div.attrs({
  className: "slider-controls"
})`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 20px;
  z-index: 1000;
`;


const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 15px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 40px;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    text-shadow: 2px 2px 5px black;
  }

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: var(--text-font);
  color: white;
  text-align: center;
  margin-bottom: 0px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

  
  @media (max-width: 768px) {
      font-size: 1.9em;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

  
    @media (max-width: 768px) {
      font-size: 1.2em;
    }
`;

const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;


