import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Breadcrumb from "../components/breadcrumb";
import ProductsGrid from "../components/products/productsGrid";
import { categories, brands, products as allProducts } from "../data/products";

function Productos() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchBrand && matchSearch;
  });
  return (
    <>
      <Breadcrumb image="/servicios/primerPlano.jpg" title="Productos" />
      <ProductContainer>
        <FadeIn delay={0.2}>
          <MainWrapper>
            <Sidebar>
              <SearchBox
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FilterSection>
                <FilterTitle>Categorías</FilterTitle>
                {categories
                  .filter((cat) => cat !== "Todo")
                  .map((cat, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        value={cat}
                        onChange={handleCategoryChange}
                        checked={selectedCategories.includes(cat)}
                      />
                      {cat}
                    </label>
                  ))}
              </FilterSection>

              <FilterSection>
                <FilterTitle>Marca</FilterTitle>
                {brands.map((brand, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      value={brand}
                      onChange={handleBrandChange}
                      checked={selectedBrands.includes(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </FilterSection>
            </Sidebar>

            <ContentArea>
              <ProductsGrid products={filteredProducts} />
            </ContentArea>
          </MainWrapper>
        </FadeIn>
      </ProductContainer>
    </>
  );
}

export default Productos;

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

const ProductContainer = styled.section`
  background: var(--background-color);
  overflow: hidden;
  text-align: center;
  padding: 3rem 6rem;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const MainWrapper = styled.div`
  display: flex;
  margin-top: 3rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 12%;
  flex-shrink: 0;
  text-align: left;
  padding: 2rem;

  @media (max-width: 768px) {
    width: 100%;
  }

  label {
    display: block;
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    color: var(--text-color);
    cursor: pointer;

    input {
      margin-right: 0.5rem;
    }
  }
`;

const ContentArea = styled.div`
  flex: 1;
  width: 88%;
  display: flex;
  justify-content: center;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 1rem 1.2rem;
  border: none;
  border-radius: 10px;
  background-color: var(--background-overlay);
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-family: var(--text-font);

  &:focus {
    outline: 1px solid var(--terciary-color); // Add outline with terciary color
    border: 1px solid var(--terciary-color);
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--terciary-color);
  font-family: var(--heading-font);
`;
