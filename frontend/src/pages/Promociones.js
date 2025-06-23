import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Breadcrumb from "../components/breadcrumb";
import promotions from "../data/promotions";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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

  const sliderPromos = promotions.filter((p) => p.ubication === "slider");
  const gridPromos = promotions.filter((p) => p.ubication === "grid");

  const allImages = [...sliderPromos, ...gridPromos].map((p) => p.image);

  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = (src) => {
    const index = allImages.findIndex((img) => img === src);
    setPhotoIndex(index);
    setIsOpen(true);
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

        <RowLayout>
          <LeftColumn>
            <StyledSlider {...settings}>
              {sliderPromos.map((promo, index) => (
                <PromotionWrapper
                  key={index}
                  onClick={() => openModal(promo.image)}
                >
                  <PromotionImage src={promo.image} alt={promo.name} />
                </PromotionWrapper>
              ))}
            </StyledSlider>
          </LeftColumn>

          <RightColumn>
            <GridContainer>
              {gridPromos.map((promo, i) => (
                <GridItem
                  key={i}
                  $position={promo.position}
                  onClick={() => openModal(promo.image)}
                >
                  <img src={promo.image} alt={promo.name} />
                </GridItem>
              ))}
            </GridContainer>
          </RightColumn>
        </RowLayout>
      </ContainerPromociones>

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={allImages.map((src) => ({ src }))}
          index={photoIndex}
          on={{
            view: ({ index }) => setPhotoIndex(index),
          }}
        />
      )}
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
  min-height: 60vh;
  padding: 3rem 12rem;

  @media (max-width: 768px) {
    padding: 3rem 2rem;

  }
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
  max-width: 130px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5));
  @media (max-width: 768px) {
    display: none;
  }
`;

const PromotionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PromotionImage = styled.img`
  width: 100%;
  height: 115vh;
  border-radius: 10px;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 100%;
    max-height: 65vh;
  object-fit: contain;

  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
`;

const GridItem = styled.div`
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: ${({ $position }) =>
      $position === "horizontal" ? "55vh" : "80vh"};
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const RowLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  max-width: 48vw;

  .slick-dots {
    bottom: -25px;
  }

  .slick-dots li button:before {
    color: var(--terciary-color);
  }

  
  @media (max-width: 768px) {
  max-width: 100vw;
    
  }

`;
