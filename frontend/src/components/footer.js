import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { faFacebook, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { rawProducts } from '../data/products';

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const [products, setProducts] = useState([]);
  useEffect(() => { rawProducts().then(setProducts); }, []);

const StyledLinkWithScroll = (props) => (
  <StyledLink {...props} onClick={() => {
    scrollToTop();
    if (props.onClick) props.onClick(); // si recibe otro onClick, lo ejecuta también
  }} />
);
  return (
    <FooterContainer>
      <TopSection>
        <ImagenMujer src='/footer/caraconflor.png' alt="Logo" />
        <LogoContainer>
                <Logo src='/logo.png' alt="Logo" />
                <TitleContainer>
                    <Title>
                        NH
                    </Title>
                    <Title>
                        ESTÉTICA
                    </Title>
                </TitleContainer>
            </LogoContainer>

        <FooterNav>
  <Column>
    <h4>MENÚ</h4>
    <NavContainer>
      <nav>
        <StyledLinkWithScroll to="/">Home</StyledLinkWithScroll>
        <StyledLinkWithScroll to="/nosotros">Nosotros</StyledLinkWithScroll>
        <StyledLinkWithScroll to="/servicios">Servicios</StyledLinkWithScroll>
        <StyledLinkWithScroll to="/promociones">Promociones</StyledLinkWithScroll>
        <StyledLinkWithScroll to="/productos">Productos</StyledLinkWithScroll>
        <StyledLinkWithScroll to="/contacto">Contacto</StyledLinkWithScroll>
      </nav>
    </NavContainer>
  </Column>

  <Column>
    <h4>SERVICIOS</h4>
    <NavContainer>
<nav>
  <StyledLinkWithScroll
    to="/servicios/tratamientosFaciales"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    Tratamientos depilación laser
  </StyledLinkWithScroll>

  <StyledLinkWithScroll
    to="/servicios/tratamientosCorporales"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    Tratamientos corporales
  </StyledLinkWithScroll>

  <StyledLinkWithScroll
    to="/servicios/tratamientosFaciales"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    Tratamientos faciales
  </StyledLinkWithScroll>

  <StyledLinkWithScroll
    to="/servicios/masajes"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    Masajes
  </StyledLinkWithScroll>
</nav>
    </NavContainer>
  </Column>

  <Column>
  <h4>PRODUCTOS</h4>
  <NavContainer>
    <nav>
      {products.slice(0, 9).map((product) => (
        <StyledLinkWithScroll
          key={product.id}
          to={product.link}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {product.name}
        </StyledLinkWithScroll>
      ))}
    </nav>
  </NavContainer>
</Column>
</FooterNav>
        <ImageRosa src='/footer/rosa.png' alt="Logo" />
      </TopSection> 

      <BottomSection>
        <span>Desarrollado por SurCode</span>
        <span>2025 - © Todos los derechos reservados.</span>
            <IconsContainer>
                <Icons>
                    <a href='https://wa.link/56ou29' target="_blank"> <FontAwesomeIcon icon={faWhatsapp} style={{ color: "var(--background-dark)" }} /> </a>
                    <a href='https://www.instagram.com/nhesteticaposadas/' target="_blank"> <FontAwesomeIcon icon={faInstagram} style={{ color: "var(--background-dark)" }} /> </a>
                    <a href='https://www.facebook.com/nh.estetica/?locale=es_LA' target="_blank"> <FontAwesomeIcon icon={faFacebook} style={{ color: "var(--background-dark)" }} /> </a>
                </Icons>
            </IconsContainer>
      </BottomSection>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.footer`
  background: linear-gradient(
    90deg,
    rgba(224, 117, 212, 0.3) 0%,
    rgba(255, 121,177, 0.3) 25%,
    var(--secondary-color) 75%,
    rgba(224, 117, 212, 0.3) 100%
  );
  padding: 40px 12vw;
  color: #000;
  position: relative;
   overflow: hidden;

   @media (min-width: 1450px) {
      padding: 40px 16vw;
   }

   @media (min-width: 1900px) {
      padding: 40px 16vw;
   }
`;


const TopSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid rgba(0,0,0,0.4);
  padding-bottom: 30px;

    @media (max-width: 768px){
        flex-direction: column;
    }


`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    margin: 1.33em 30px 0 0;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const Logo = styled.img`
  width: 80px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 70px;
  }

`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Title = styled.div`
  color: var(--background-dark);
  font-size: 2.2rem;
  font-family: var(--logo-font),sans-serif;
  transform: skew(-10deg);
  margin: 0 2px;
  font-weight: 700;
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.3));
  strong {
    display: block;
  }
  span {
    font-style: italic;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FooterNav = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  min-width: 160px;

  h4 {
    font-size: 1.4rem;
    font-family: var(--heading-font);
    margin-bottom: 10px;
    font-weight: 500;
  }

  ul {
    list-style: none;
    padding: 0;

  li {
    margin-bottom: 6px;
    font-size: 18px;
  }
  li:hover {
    color: var(--terciary-color);
  }
  }

  @media (max-width: 768px) {
    h4 {
      margin: 10px 0px;
    }
  }
`;

const BottomSection = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

    @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }

`;

const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  font-size: 1.2rem;

  svg {
    cursor: pointer;
    transition: transform 0.2s;
  }

  svg:hover {
    transform: scale(1.2);
  }
`;

const NavContainer = styled.div`
   
nav { 
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const StyledLink = styled(RouterLink)`
  font-family: var(--text-font);
  color: var(--background-dark);
  font-size: 18px;
  text-decoration: none;
  position: relative;

  &:hover {
    color: var(--terciary-color);
  }
`;

const IconsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    `;

const Icons = styled.div`
    font-size: 25px;
    display: flex;
    gap: 1rem;
`;

const ImagenMujer = styled.img`
    object-fit: contain;
    position: absolute;
    left: 30px;
    top: 22vh;
    width: 170px;
    transform: rotate(25deg);
    filter: drop-shadow(5px 5px 10px rgba(224, 117, 212, 1));

    @media (max-width: 768px) {
      top: 95vh;
      left: 79vw;
      width: 100px;
      transform: rotate(319deg) scaleX(-1);
    }

      @media (min-width:768px) and (max-width: 1200px) {
      top: 41vh;
      left: 0;
      width: 130px;
    }

     @media (min-width:1200px) and (max-width: 1400px) {
      top: 12vh;
      left: 0;
      width: 140px;
    }
    
`;

const ImageRosa = styled.img`
  object-fit: contain;
  position: absolute;
  top: 10vh;
  right: 25px;
  width: 110px;

  @media (max-width: 768px) {
    top: 27vh;
    width: 90px;
  }
`;