import React, { useState } from "react";
import Masonry from "react-masonry-css";
import styled from "styled-components";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const images = [
  "/galeria-nosotros/antesydespues.jpg",
  "/galeria-nosotros/antesydespues2.jpg",
  "/galeria-nosotros/antesydespues3.jpg",
  "/galeria-nosotros/antesydespues4.jpg",
  "/galeria-nosotros/antesydespues5.jpg",
  "/galeria-nosotros/antesydespues6.jpg",
  "/galeria-nosotros/antesydespues7.jpg",
  "/galeria-nosotros/antesydespues8.jpg",
  "/galeria-nosotros/antesydespues9.jpg"
];

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 2,
};

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((src) => ({ src }));

  return (
    <GalleryContainer>
      <Subtitle>Nuestro trabajo</Subtitle>
      <Title>ANTES Y DESPUÉS</Title>
      <StyledMasonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((src, i) => (
          <GalleryItem key={i} onClick={() => { setOpen(true); setIndex(i); }}>
            <img src={src} alt={`Imagen ${i + 1}`} />
          </GalleryItem>
        ))}
      </StyledMasonry>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
      />
    </GalleryContainer>
  );
};

export default Gallery;

// -------- Styled Components --------

const GalleryContainer = styled.div`
  background-color: #fff7f7;
  text-align: center;
  padding: 4rem 10rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 3rem 2rem;
  }
`;

const Subtitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--terciary-color);
  margin: 0;
  font-family: var(--heading-font), sans-serif;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin: 0 0 1rem;
  font-family: var(--heading-font);
  transform: skew(-10deg);
`;

const StyledMasonry = styled(Masonry)`
  display: flex;
  margin-left: -1rem;
  width: auto;
  margin-top: 20px;
  overflow: hidden;
  border-radius: 20px;

  & .my-masonry-grid_column {
    padding-left: 1rem;
    background-clip: padding-box;
  }

  @media (max-width: 768px) {
    max-height: 200vh;
  }
`;

const GalleryItem = styled.div`
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 10px;
    object-fit: contain;

    @media (max-width: 768px) {
      max-height: 200px;
      object-fit: cover;
    }
  }
`;