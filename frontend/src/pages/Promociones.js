import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Breadcrumb from "../components/breadcrumb";
import promotions from "../data/promotions";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Promociones() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1620,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Breadcrumb
        image="/breadcrumbs/promociones.jpg"
        title="Promociones"
        textShadow={true}
        titleColor="white"
      />
      <ContainerPromociones>
        <TopLeftImage src="/images/massage.png" alt="Decoración izquierda" />
        <BottomRightImage
          src="/images/butterfly.jpg"
          alt="Decoración derecha"
        />

        <Slider {...settings}>
          {promotions.map((promo, index) => (
            <Slide key={index}>
              <FadeIn>
                <PromoImage src={promo.image} alt={promo.title} />
              </FadeIn>
            </Slide>
          ))}
        </Slider>
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
    transition={{ duration: 0.6, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

// Estilos
const ContainerPromociones = styled.div`
  background: var(--background-color);
  position: relative;
  padding: 3rem 4rem;

  @media (max-width: 1024px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Slide = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
`;
const PromoImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const TopLeftImage = styled.img`
  position: absolute;
  top: 20px;
  left: 30px;
  max-width: 150px;
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
  max-width: 130px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5));
  @media (max-width: 768px) {
    display: none;
  }
`;
