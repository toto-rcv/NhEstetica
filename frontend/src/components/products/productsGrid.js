import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ProductsGrid = ({ products, loading = false }) => {
  if (loading) {
    return (
      <GridContainer>
        <LoadingMessage>Cargando productos...</LoadingMessage>
      </GridContainer>
    );
  }

  console.log('🎯 ProductsGrid recibió productos:', products);

  return (
    <GridContainer>
      {products.length === 0 ? (
        <NoResults>No se encontraron productos.</NoResults>
      ) : (
        products.map((product, index) => {
          // Validar que el producto tenga un ID válido y no sea temporal
          const isValidProduct = product && 
                                product.id && 
                                product.id !== 'undefined' && 
                                !String(product.id).startsWith('product-');
          
          console.log(`🎯 Producto ${index + 1} (${product.name}):`, {
            id: product.id,
            isValid: isValidProduct,
            link: isValidProduct ? `/productos/${product.id}` : 'No link'
          });
          
          return (
            <Card key={index}>
              {isValidProduct ? (
                <LinkStyled to={`/productos/${product.id}`}>
                  <ProductImage 
                    src={product.image && product.image.trim() !== '' ? product.image : null} 
                    alt={product.name} 
                  />
                </LinkStyled>
              ) : (
                <ProductImage 
                  src={product.image && product.image.trim() !== '' ? product.image : null} 
                  alt={product.name} 
                />
              )}
              <ProductName>{product.name}</ProductName>
              <ProductBrand>{product.brand}</ProductBrand>
              {isValidProduct ? (
                <LinkStyled to={`/productos/${product.id}`}>
                  Ver más →
                </LinkStyled>
              ) : (
                <span style={{ color: '#999', fontSize: '1.1rem' }}>
                  Sin detalles disponibles
                </span>
              )}
            </Card>
          );
        })
      )}
    </GridContainer>
  );
};

export default ProductsGrid;


// 🌟 Styled Components
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 1rem;
  padding: 2rem;
  justify-items: center;
  max-width: 1000px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

`;



const Card = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 440px;
  background-color: var(--background-overlay-white);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;
const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  aspect-ratio: 4/5;

  &:hover {
  transition: all 0.6s ease;
  cursor: pointer;
  }
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ProductBrand = styled.p`
  font-size: 1.1rem;
  color: var(--primary-color-dark);
  margin: 7px 0 10px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LinkStyled = styled(Link)`
  font-size: 1.1rem;
  color: var(--terciary-color);
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }

      @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;



const NoResults = styled.p`
  grid-column: 1 / -1;
  font-size: 1.2rem;
  color: var(--text-color);
  text-align: center;
  margin-top: 2rem;
`;

const LoadingMessage = styled.p`
  grid-column: 1 / -1;
  font-size: 1.2rem;
  color: var(--text-color);
  text-align: center;
  margin-top: 2rem;
`;