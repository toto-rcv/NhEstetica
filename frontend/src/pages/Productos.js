import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Breadcrumb from "../components/breadcrumb";
import ProductsGrid from "../components/products/productsGrid";
import { categories, brands, rawProducts as fetchRawProducts } from "../data/products";
import { FaFilter } from "react-icons/fa";

function Productos() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loaderRef = useRef(null);

  useEffect(() => {
    fetchRawProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 3);
            setIsLoadingMore(false);
          }, 600); // Simula carga
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

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

  const filteredProducts = products.filter((product) => {
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

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <>
      <Breadcrumb image="/breadcrumbs/productos.jpg" title="Productos" titleColor="white" textShadow={true} />
      <ProductContainer>
                <TopLeftImage src="/images/shape2.png" alt="Decoración izquierda" />
        <BottomRightImage src="/images/birds.png" alt="Decoración derecha" />
        <FadeIn delay={0.2}>
          <MainWrapper>
            <MobileFilterToggle onClick={() => setShowMobileFilters((prev) => !prev)}>
              <FaFilter style={{ marginRight: "0.5rem" }} />
              {showMobileFilters ? "Ocultar" : "Filtrar"}
            </MobileFilterToggle>

            <Sidebar $isVisible={showMobileFilters}>
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
              <div>
                <ProductsGrid products={visibleProducts} loading={loading} />
                {isLoadingMore && <Spinner />}
                {visibleCount < filteredProducts.length && (
                  <div ref={loaderRef} style={{ height: "40px" }} />
                )}
                {visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
                  <EndMessage></EndMessage>
                )}
                {filteredProducts.length === 0 && !loading && (
                  <EndMessage>No se encontraron productos.</EndMessage>
                )}
              </div>
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

// Spinner con framer-motion
const Spinner = () => (
  <motion.div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "2rem",
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      style={{
        width: 30,
        height: 30,
        border: "4px solid var(--terciary-color)",
        borderTop: "4px solid transparent",
        borderRadius: "50%",
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 1,
      }}
    />
  </motion.div>
);

// Styled Components
const ProductContainer = styled.section`
  background: var(--background-color);
  overflow: hidden;
  text-align: center;
  position: relative;
  padding: 3rem 6rem;

  @media (max-width: 768px) {
    padding: 2rem 2rem;
  }

  
    @media (min-width: 768px) and (max-width: 1200px) {
      padding: 2rem 1rem;
    }
`;

const MainWrapper = styled.div`
  display: flex;
  margin-top: 3rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 0;
  }
`;

const MobileFilterToggle = styled.button`
  display: none;
  padding: 0.8rem 0.4rem;
  background-color: var(--terciary-color);
  color: white;
  border: none;
  max-width: 130px;
  border-radius: 10px;
  font-size: 1rem;
  font-family: var(--text-font);
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    align-self: left;
  }
`;

const Sidebar = styled.aside`
  width: 12%;
  flex-shrink: 0;
  text-align: left;
  padding: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
    background-color: var(--background-color);
    border-radius: 10px;
    margin-top: 1rem;
    padding: 20px 0;
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

  @media (max-width: 768px) {
    width: 100%;
  }
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
    outline: 1px solid var(--terciary-color);
    border: 1px solid var(--terciary-color);
  }

  @media (max-width: 768px) {
    max-width: 275px;
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

const EndMessage = styled.p`
  margin-top: 2rem;
  font-size: 1rem;
  color: var(--text-color);
  text-align: center;
`;


const TopLeftImage = styled.img`
  position: absolute;
  bottom: 0;
  right: 30px;
  max-width: 200px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5)); 
  @media (max-width: 768px) {
    width: 70px;
    top: -50px;
  }

   @media (max-width: 916px) {
    width: 140px;
  }

    @media (max-width: 768px) {
    display: none;
  }

  
  @media (max-width: 1700px) {
    display: none;
  }
`;

const BottomRightImage = styled.img`
  position: absolute;
  top: 30px;
  right: 30px;
  max-width: 200px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5));

  @media (max-width: 1656px) {
    display: none;
  }

`;