import React from "react";
import Masonry from "react-masonry-css";
import styled from "styled-components";

    const images = Array.from({ length: 9 }, (_, i) => {
    const randomHeight = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
    return `https://picsum.photos/300/${randomHeight}?random=${i + 1}`;
});

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 2,
};

const Gallery = () => {
  return (
    <GalleryContainer>
      <Subtitle>Nuestro trabajo</Subtitle>
      <Title>GALERÍA DE IMÁGENES</Title>
      <StyledMasonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((src, index) => (
          <GalleryItem key={index}>
            <img src={src} alt={`Imagen ${index + 1}`} />
          </GalleryItem>
        ))}
      </StyledMasonry>
    </GalleryContainer>
  );
};

export default Gallery;

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
    font-family: var(--heading-font),sans-serif;
`;

const Title = styled.h2`
    font-size: 2.5rem;
    margin: 0 0 1rem;
    font-family: var(--heading-font);
    transform: skew(-10deg);
`;

const StyledMasonry = styled(Masonry)`
  display: flex;
  margin-left: -1rem; /* gutter size offset */
  width: auto;
  margin-top: 20px;
  overflow: hidden;
  border-radius: 20px;
  max-height: 130vh;

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

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 10px;
    object-fit: contain;

    
    @media (max-width: 768px) {
      max-height:200px;
    object-fit: cover;

    }
  }
`;
