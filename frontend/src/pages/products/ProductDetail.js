import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { products } from "../../data/products";
import Breadcrumb from "../../components/breadcrumb";
import CircularGallery from "../../components/extensions/CircullarGallery";
import {useState, useEffect} from "react"
import { Link } from "react-router-dom";

function ProductDetail() {
  const { productName } = useParams();
  const decodedName = decodeURIComponent(productName);
  const product = products.find((p) => p.name === decodedName);
 const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
   useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          {product.benefits && (
  <BenefitsList>
    {product.benefits.map((benefit, index) => (
      <li key={index}>{benefit}</li>
    ))}
  </BenefitsList>
)}

          <BuyButton to="https://wa.me/5491168520606" target="_blank" rel="noopener noreferrer">COMPRAR</BuyButton>
        </Right>
      </DetailWrapper>

 <CircularGalleryContainer
        style={{
          height: isMobile ? "300px" : "600px",
          position: "relative",
        }}
      >
        <CircularGallery
          bend={isMobile ? 0 : 2}
          textColor="var(--text-color)"
          borderRadius={0.05}
          font="var(--heading-font)"
        />
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
    padding: 2rem 0rem;
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  padding: 6rem 3rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 3rem 2rem;
    align-items: center;
  }
`;

const Left = styled.div`
  flex: 1;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 0rem;
  }
`;

const Right = styled.div`
  flex: 1;
  text-align: left;
`;

const Image = styled.img`
  max-height: 60vh;
  border-radius: 20px;
  object-fit: contain;

  
  @media (max-width: 768px) {
      max-height: 50vh;
      aspect-ratio: 4/5;
        object-fit: cover;

  }
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

    @media (max-width: 768px) {
    padding: 0rem;
  }
`;

const BuyButton = styled(Link)`
  font-size: 1rem;
  color: var(--terciary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 0.8rem 2.2rem;
  border: 2px solid var(--terciary-color);
  border-radius: 25px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  background: transparent;
  z-index: 1;
  text-align: center;
  cursor: pointer;
  display: inline-block;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--terciary-color);
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
    font-size: 1.1rem;
    padding: 0.9rem 1.8rem;
    width: auto;
    text-align: center;
    margin-top: 0.5rem;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  padding: 1.1rem 0;
  font-size: 1.2rem;
  color: var(--text-color);

  li {
    margin-bottom: 0.6rem;
    position: relative;
    padding-left: 1.8rem;

    &::before {
      content: "✓";
      position: absolute;
      font-size: 1.4rem;
      left: 0;
      bottom: -3px;
      color: var(--primary-color);
      font-weight: bold;
    }
  }
`;
