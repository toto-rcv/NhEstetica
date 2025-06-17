import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { products } from "../../data/products";
import Breadcrumb from "../../components/breadcrumb";
import CircularGallery from "../../components/extensions/CircullarGallery";

function ProductDetail() {
  const { productName } = useParams();
  const decodedName = decodeURIComponent(productName);
  const product = products.find((p) => p.name === decodedName);

  if (!product) {
    return (
      <ProductContainer>
        <DetailWrapper>
          <h2>Producto no encontrado</h2>
        </DetailWrapper>
      </ProductContainer>
    );
  }

  return (
    <ProductContainer>
      <Breadcrumb
        image={product.image}
        title={product.name}
        titleColor="white"
        textShadow={true}
      />
      <DetailWrapper>
        <Left>
          <Image src={product.image} alt={product.name} />
        </Left>
        <Right>
          <Title>{product.subtitle}</Title>
          <Brand>
            {product.brand} - {product.category}
          </Brand>
          <Price>${product.price.toLocaleString()}</Price>
          <Description>{product.description}</Description>
          <BuyButton href="/">COMPRAR</BuyButton>
        </Right>
      </DetailWrapper>

      <CircularGalleryContainer
        style={{ height: "600px", position: "relative" }}
      >
        <CircularGallery bend={2} textColor="var(--text-color)" borderRadius={0.05} font="var(--heading-font)" />
      </CircularGalleryContainer>
    </ProductContainer>
  );
}

export default ProductDetail;

// Styled Components

const ProductContainer = styled.section`
  background: var(--background-color);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  padding: 6rem 3rem;
`;

const Left = styled.div`
  flex: 1;
  text-align: center;
`;

const Right = styled.div`
  flex: 1;
  text-align: left;
`;

const Image = styled.img`
  max-height: 60vh;
  border-radius: 20px;
  object-fit: contain;
`;

const Title = styled.h2`
  position: relative;
  font-size: 1.8rem;
  margin-bottom: 2.5rem;
  color: var(--text-color);

  &::after {
    content: "";
    position: absolute;
    left: 10%;
    bottom: -10px;
    width: 80%;
    height: 4px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--primary-color) 15%,
      var(--primary-color) 85%,
      transparent 100%
    );
    border-radius: 2px;
    display: block;
  }
`;
const Brand = styled.p`
  font-size: 1.5rem;
  color: var(--primary-color-dark);
  font-weight: bold;
`;

const Price = styled.p`
  font-size: 1.5rem;
  color: var(--terciary-color);
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: var(--text-color);
  line-height: 1.6;
`;

const CircularGalleryContainer = styled.div`
  padding: 3rem 0;
`;

const BuyButton = styled.button`
  font-size: 1rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 0.8rem 1.8rem;
  border: 2px solid var(--primary-color);
  border-radius: 25px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  background: transparent;
  z-index: 1;
  text-align: center;
  cursor: pointer;
  margin-top: 3px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--primary-color);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

    &::before {
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem 1.5rem;
    width: auto;
    text-align: center;
    margin-top: 0.5rem;
  }
`;
