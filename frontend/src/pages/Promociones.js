import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import Breadcrumb from "../components/breadcrumb";
import promotions from "../data/promotions";

function Promociones() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
      <Breadcrumb image="/breadcrumbs/promociones.jpg" title="Promociones" textShadow={true} titleColor="white" />
      <ContainerPromociones>
        <TopLeftImage src="/images/massage.png" alt="Decoración izquierda" />
        <BottomRightImage src="/images/butterfly.jpg" alt="Decoración derecha" />
        <FadeIn delay={0.2}>
          <StyledSlider {...settings}>
            {promotions.map((promo, index) => (
              <PromotionWrapper key={index}>
                <PromotionImage src={promo.image} alt={`Promoción ${index + 1}`} />
              </PromotionWrapper>
            ))}
          </StyledSlider>
        </FadeIn>
      </ContainerPromociones>
    </>
  );
}

export default Promociones;

// Animación
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

// Estilos
const ContainerPromociones = styled.div`
  background: var(--background-color);
  position: relative;
  min-height: 60vh;
  padding: 40px 20px;
`;

const TopLeftImage = styled.img`
  position: absolute;
  top: 20px;
  left: 30px;
  max-width: 200px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5)); 
  @media (max-width: 768px) {
    width: 70px;
    top: -50px;
  }
`;

const BottomRightImage = styled.img`
  position: absolute;
  bottom: 30px;
  right: 30px;
  max-width: 200px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5));
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledSlider = styled(Slider)`
  max-width: 600px; /* centrado y tamaño */
  margin: 0 auto;

  .slick-dots {
    bottom: -25px;
  }

  .slick-dots li button:before {
    color: var(--terciary-color);
  }
`;

const PromotionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PromotionImage = styled.img`
  height: auto;
  width: 100%;
  border-radius: 10px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 300px;
  }
`;
