import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { productosService } from '../../services/productosService';
import Breadcrumb from "../../components/breadcrumb";
import CircularGallery from "../../components/extensions/CircullarGallery";
import ReactMarkdown from 'react-markdown';
import { FaLeaf } from 'react-icons/fa';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('description');
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
        setLoading(true);
        setError(null);

        if (!id) {
          setError('ID de producto no proporcionado');
          setLoading(false);
          return;
        }

        if (id.startsWith('product-')) {
          setError('Este producto no tiene detalles disponibles');
          setLoading(false);
          return;
        }

        const productData = await productosService.getProductoById(id);
        
        if (productData) {
          const transformedProduct = {
            id: productData.id,
            name: productData.nombre,
            category: productData.categoria || '',
            brand: productData.marca || '',
            image: productData.imagen || '',
            subtitle: productData.subtitle || '',
            description: productData.descripcion || '',
            price: productData.precio,
            isNatural: Boolean(productData.isNatural) && productData.isNatural !== '0' && productData.isNatural !== 0 && productData.isNatural !== false,
            isVegan: Boolean(productData.isVegan) && productData.isVegan !== '0' && productData.isVegan !== 0 && productData.isVegan !== false,
            benefits: productData.benefits || [],
            modoUso: productData.modoUso || []
          };
          setProduct(transformedProduct);
        } else {
          setError('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error cargando el producto:', error);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Cargando producto...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton to="/productos">Volver a productos</BackButton>
      </ErrorContainer>
    );
  }

  if (!product) return null;

  return (
    <GlobalStyles>
      <PageContainer>
        <Breadcrumb
          image={product.image}
          title={product.name}
          titleColor="white"
          textShadow={true}
        />

        <ProductSection>
          <ProductGallery>
            <MainImageContainer>
              <ProductBadge>{product.category}</ProductBadge>
              {product.isNatural && <NaturalBadge $hasVegan={product.isVegan}><FaLeaf /> Natural</NaturalBadge>}
              {product.isVegan && <VeganBadge $hasNatural={product.isNatural}>🌱 Vegano</VeganBadge>}
              <MainImage src={product.image} alt={product.name} />
            </MainImageContainer>
          </ProductGallery>

          <ProductInfo>
            <BrandRow>
              {/* Quitamos la marca de aquí */}
            </BrandRow>
            
            <ProductTitle>{product.name}</ProductTitle>
            
            {product.subtitle && (
              <ProductSubtitle>{product.subtitle}</ProductSubtitle>
            )}

            <PriceRow>
              <ProductPrice>${product.price.toLocaleString()}</ProductPrice>
              <Brand>{product.brand}</Brand>
            </PriceRow>

            <TabsContainer>
              <TabButton 
                $active={selectedTab === 'description'} 
                onClick={() => setSelectedTab('description')}
              >
                Descripción
              </TabButton>
              <TabButton 
                $active={selectedTab === 'benefits'} 
                onClick={() => setSelectedTab('benefits')}
              >
                Beneficios
              </TabButton>
              <TabButton 
                $active={selectedTab === 'howToUse'} 
                onClick={() => setSelectedTab('howToUse')}
              >
                Modo de uso
              </TabButton>
            </TabsContainer>

            <TabContent>
              {selectedTab === 'description' && (
                <DescriptionContent>
                  <ReactMarkdown>
                    {product.description}
                  </ReactMarkdown>
                </DescriptionContent>
              )}
              
              {selectedTab === 'benefits' && (
                <BenefitsContent>
                  {product.benefits && product.benefits.length > 0 ? (
                    <BenefitsList>
                      {product.benefits.map((benefit, index) => (
                        <BenefitItem key={index}>
                          <BenefitIcon>✨</BenefitIcon>
                          <span>{benefit}</span>
                        </BenefitItem>
                      ))}
                    </BenefitsList>
                  ) : (
                    <NoContent>No hay beneficios especificados para este producto.</NoContent>
                  )}
                </BenefitsContent>
              )}
              
              {selectedTab === 'howToUse' && (
                <HowToUseContent>
                  {product.modoUso && product.modoUso.length > 0 ? (
                    <StepList>
                      {product.modoUso.map((paso, index) => (
                        <Step key={index}>
                          <StepNumber>{index + 1}</StepNumber>
                          <StepText>{paso}</StepText>
                        </Step>
                      ))}
                    </StepList>
                  ) : (
                    <NoContent>No hay instrucciones de uso especificadas para este producto.</NoContent>
                  )}
                </HowToUseContent>
              )}
            </TabContent>

            <ActionButtons>
              <BuyNowButton href="https://wa.me/5491168520606" target="_blank" rel="noopener noreferrer">
                Comprar ahora
              </BuyNowButton>
            </ActionButtons>
          </ProductInfo>
        </ProductSection>

        <CircularGalleryContainer
          style={{
            height: isMobile ? "300px" : "600px",
            position: "relative",
          }}
        >
          <CircularGallery
            bend={isMobile ? 0 : 2}
            textColor="#E0A875"
            borderRadius={0.05}
            font="bold 40px 'Saira', sans-serif"
          />
        </CircularGalleryContainer>
      </PageContainer>
    </GlobalStyles>
  );
}

export default ProductDetail;

// Loading animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const PageContainer = styled.div`
  background: linear-gradient(180deg, #fff5f8 0%, #ffffff 100%);
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-in;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(224, 168, 117, 0.3);
  border-radius: 50%;
  border-top: 4px solid var(--terciary-color);
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: var(--terciary-color);
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  padding: 0 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.h2`
  font-size: 1.5rem;
  color: #e74c3c;
  margin-bottom: 30px;
`;

const BackButton = styled(Link)`
  background-color: var(--terciary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    padding: 2rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 350px) {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }
`;

const ProductGallery = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
  
  @media (max-width: 992px) {
    margin: 0 auto;
    max-width: 550px;
    width: 100%;
  }
  
  @media (max-width: 350px) {
    min-width: auto;
  }
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 750px;
  aspect-ratio: 3/4;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  @media (max-width: 1220px) {
    height: auto;
  }
  
  @media (max-width: 768px) {
    max-height: 550px;
    border-radius: 10px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: var(--terciary-color);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    top: 10px;
    left: 10px;
    font-size: 0.75rem;
    padding: 4px 10px;
  }
`;

const NaturalBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #7eb77f;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    font-size: 0.75rem;
    padding: 4px 10px;
  }
`;

const VeganBadge = styled.span`
  position: absolute;
  top: ${props => props.$hasNatural ? '55px' : '15px'};
  right: 15px;
  background-color: #6a994e;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    top: ${props => props.$hasNatural ? '50px' : '10px'};
    right: 10px;
    font-size: 0.75rem;
    padding: 4px 10px;
  }
`;



const ProductInfo = styled.div`
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 992px) {
    margin-top: 2rem;
  }
`;

const BrandRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Brand = styled.span`
  font-size: 1.1rem;
  color: #777;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductTitle = styled.h1`
  font-family: var(--heading-font), sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #3f394f;
  margin: 0.5rem 0 1.5rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
  position: relative;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -15px;
    width: 100%;
    height: 4px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--terciary-color) 20%,
      var(--terciary-color) 80%,
      transparent 100%
    );
    border-radius: 2px;
    display: block;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    
    &::after {
      height: 3px;
      bottom: -10px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 350px) {
    font-size: 1.5rem;
    word-break: break-word;
  }
`;

const ProductSubtitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--terciary-color);
  margin: 0 0 1.5rem;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProductPrice = styled.span`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--terciary-color);
  font-family: var(--heading-font), sans-serif;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    justify-content: space-between;
  }
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? 'var(--terciary-color)' : 'transparent'};
  color: ${props => props.$active ? '#333' : '#888'};
  font-weight: ${props => props.$active ? '600' : '400'};
  font-size: 1rem;
  font-family: var(--heading-font), sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.5px;
  
  &:hover {
    color: #333;
    border-bottom-color: ${props => props.$active ? 'var(--terciary-color)' : '#ccc'};
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 0.75rem;
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
  }
  
  @media (max-width: 350px) {
    padding: 0.5rem;
    font-size: 0.8rem;
    letter-spacing: 0;
  }
`;

const TabContent = styled.div`
  min-height: 200px;
  padding: 1rem 0 2rem;
  
  @media (max-width: 480px) {
    min-height: 150px;
    padding: 0.75rem 0 1.5rem;
  }
`;

const DescriptionContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const BenefitsContent = styled.div`
  padding: 0.5rem 0;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0;
  }
`;

const BenefitIcon = styled.span`
  margin-right: 15px;
  color: var(--terciary-color);
  font-size: 1.2rem;
`;

const NoContent = styled.p`
  color: #888;
  font-style: italic;
`;

const HowToUseContent = styled.div`
  padding: 0.5rem 0;
`;

const StepList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StepNumber = styled.span`
  background-color: var(--terciary-color);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: 600;
`;

const StepText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const BuyNowButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--terciary-color), #d47d49);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(224, 168, 117, 0.3);
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(224, 168, 117, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 25px;
  }
  
  @media (max-width: 350px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
`;

const CircularGalleryContainer = styled.div`
  padding: 3rem 0;
  max-width: 1400px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

// Agregamos un estilo global para controlar el overflow y evitar el scroll horizontal
const GlobalStyles = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

