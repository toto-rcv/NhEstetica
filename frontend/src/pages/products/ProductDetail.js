import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { products } from '../data/products';

function ProductDetail() {
  const { productName } = useParams();
  const decodedName = decodeURIComponent(productName);
  const product = products.find(p => p.name === decodedName);

  if (!product) {
    return <DetailWrapper><h2>Producto no encontrado</h2></DetailWrapper>;
  }

  return (
    <DetailWrapper>
      <Image src={product.image} alt={product.name} />
      <Title>{product.name}</Title>
      <Brand>{product.brand}</Brand>
      <Category>Categoría: {product.category}</Category>
      <Price>${product.price.toLocaleString()}</Price>
      <Description>{product.description}</Description>
    </DetailWrapper>
  );
}

export default ProductDetail;

const DetailWrapper = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  max-width: 600px;
  margin: 10vh auto 4rem;
`;

const Image = styled.img`
  width: 100%;
  max-width: 350px;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const Brand = styled.p`
  font-size: 1rem;
  color: var(--terciary-color);
  font-weight: bold;
`;

const Category = styled.p`
  font-size: 1rem;
  color: gray;
  margin-bottom: 1rem;
`;

const Price = styled.p`
  font-size: 1.3rem;
  color: var(--primary-color-dark, #d1478c);
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: var(--text-color);
`;
