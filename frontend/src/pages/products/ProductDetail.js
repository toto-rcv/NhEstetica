import React from "react";
import { useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { productosService } from '../../services/productosService';
import Breadcrumb from "../../components/breadcrumb";
import CircularGallery from "../../components/extensions/CircullarGallery";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

const BorderAnimStyle = createGlobalStyle`
  @keyframes borderAnim {
    0% {
      border-image-source: linear-gradient(90deg, var(--primary-color), var(--terciary-color), var(--primary-color));
    }
    50% {
      border-image-source: linear-gradient(90deg, var(--terciary-color), var(--primary-color), var(--terciary-color));
    }
    100% {
      border-image-source: linear-gradient(90deg, var(--primary-color), var(--terciary-color), var(--primary-color));
    }
  }
`;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError(null);

        console.log('🔍 ProductDetail recibió ID:', id);

        // Validar que el ID existe y es válido
        if (!id) {
          setError('ID de producto no proporcionado');
          return;
        }

        // Si es un ID temporal (product-X), mostrar mensaje apropiado
        if (id.startsWith('product-')) {
          console.log('⚠️ ID temporal detectado:', id);
          setError('Este producto no tiene detalles disponibles');
          return;
        }

        console.log('🚀 Intentando cargar producto con ID:', id);
        const productData = await productosService.getProductoById(id);
        if (productData) {
          console.log('✅ Producto cargado exitosamente:', productData);
          // Transformar los datos del backend al formato esperado por el frontend
          const transformedProduct = {
            id: productData.id,
            name: productData.nombre,
            category: productData.categoria || '',
            brand: productData.marca || '',
            image: productData.imagen || '',
            subtitle: productData.subtitle || '',
            description: productData.descripcion || '',
            price: productData.precio,
            isNatural: productData.isNatural ?? false,
            isVegan: productData.isVegan ?? false,
            benefits: productData.benefits || [],
          };
          setProduct(transformedProduct);
        } else {
          console.log('❌ Producto no encontrado para ID:', id);
          setError('Producto no encontrado');
        }
      } catch (error) {
        console.error('❌ Error loading product:', error);
        setError('Error al cargar el producto');
      }
    };
    loadProduct();
  }, [id]);

  if (error) {
    return (
      <ProductContainer>
        <DetailWrapper>
          <h2>{error}</h2>
        </DetailWrapper>
      </ProductContainer>
    );
  }

  if (!product) {
    return null; // No mostrar nada mientras se carga
  }

  return (
    <>
      <BorderAnimStyle />
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
            <BrandPriceRow>
              <Price>${product.price.toLocaleString()}</Price>
              <Brand>{product.brand} - {product.category}</Brand>
            </BrandPriceRow>
            <Description>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <span>{children}</span>,
                }}
              >
                {product.description}
              </ReactMarkdown>
            </Description>
            {product.benefits && product.benefits.length > 0 && (
              <BenefitsListWrapper>
                <BenefitsList>
                  {product.benefits.slice(0, Math.ceil(product.benefits.length / 2)).map((benefit, index) => (
                    <li key={index}><span>{benefit}</span></li>
                  ))}
                </BenefitsList>
                <BenefitsList>
                  {product.benefits.slice(Math.ceil(product.benefits.length / 2)).map((benefit, index) => (
                    <li key={index + Math.ceil(product.benefits.length / 2)}><span>{benefit}</span></li>
                  ))}
                </BenefitsList>
              </BenefitsListWrapper>
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
    </>
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
  align-items: center;

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
  height: auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 38vh;
    aspect-ratio: 4/5;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const Title = styled.h2`
  position: relative;
  font-size: 2.2rem;
  margin-bottom: 2.5rem;
  color: var(--terciary-color);
  text-align: center;
  font-family: var(--heading-font), 'Montserrat', Arial, sans-serif;
  letter-spacing: 0.5px;
  font-weight: 800;
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
      var(--terciary-color) 15%,
      var(--terciary-color) 85%,
      transparent 100%
    );
    border-radius: 2px;
    display: block;
  }
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
    &::after {
      height: 3px;
      bottom: -6px;
    }
  }
`;

const BrandPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 0.2rem;
    margin-bottom: 0.7rem;
  }
`;

const Brand = styled.p`
  font-size: 1.2rem;
  color: var(--terciary-color);
  font-weight: 600;
  margin: 0;
  text-align: right;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 6px rgba(231, 84, 128, 0.10);
  @media (max-width: 768px) {
    font-size: 1.05rem;
    text-align: left;
    width: 100%;
  }
`;

const Price = styled.p`
  font-size: 1.7rem;
  color: var(--terciary-color);
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-weight: 700;
  margin: 0;
  text-align: left;
  letter-spacing: 1px;
  @media (max-width: 768px) {
    font-size: 1.2rem;
    width: 100%;
    margin-bottom: 0.2rem;
  }
`;

const Description = styled.div`
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
  font-size: 1.15rem;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  padding: 1rem 2.8rem;
  border: none;
  border-radius: 32px;
  background: linear-gradient(100deg, var(--terciary-color), var(--primary-color), var(--secondary-color), var(--terciary-color));
  background-size: 300% 300%;
  box-shadow: 0 4px 24px 0 rgba(231, 84, 128, 0.13);
  transition: transform 0.18s, box-shadow 0.18s, background-position 0.6s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  z-index: 1;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  letter-spacing: 1px;
  margin-top: 1.2rem;

  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 32px 0 rgba(231, 84, 128, 0.22);
    background-position: 100% 0;
    color: #fff;
    text-shadow: 0 2px 8px rgba(231, 84, 128, 0.13);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
    width: 100%;
    text-align: center;
    margin-top: 0.7rem;
    border-radius: 22px;
  }
`;

const BenefitsListWrapper = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  padding: 1.1rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0;

  li {
    margin-bottom: 1rem;
    position: relative;
    padding-left: 2.5rem;
    padding-right: 1rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.2s, transform 0.2s;
    font-size: 1.15rem;
    font-weight: 500;
    border: 2.5px solid var(--secondary-color);
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    margin-top: 0.2rem;
    margin-bottom: 0.7rem;
    cursor: default;
    text-align: center;

    &:hover {
      box-shadow: 0 4px 18px rgba(0,0,0,0.13);
      transform: translateY(-2px) scale(1.03);
      background: rgba(255,255,255,0.95);
    }

    &::before {
      content: "✨";
      position: absolute;
      left: 1rem;
      font-size: 1.6rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
      font-weight: bold;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.08));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    span {
      margin-left: 2.2rem;
      display: block;
      width: 100%;
      text-align: center;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
    }
  }

  @media (max-width: 768px) {
    li {
      font-size: 1.08rem;
      padding-left: 2.2rem;
      min-height: 40px;
    }
  }
`;
