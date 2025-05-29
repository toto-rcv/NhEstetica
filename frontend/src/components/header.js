import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideMenu from "./sideMenu";
import HamburgerMenu from "./hamburgerMenu";
import { Link as RouterLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setHasScrolled(true);

        if (currentScrollY < lastScrollY) {
          // Scroll up
          setShowHeader(true);
        } else {
          // Scroll down
          setShowHeader(false);
        }
      } else {
        setHasScrolled(false);
        setShowHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <FixedWrapper>
      <HeaderContainer visible={showHeader} scrolled={hasScrolled}>
        <LogoContainer>
          <Logo src="logo.png" alt="Logo" />
          <TitleContainer>
            <Title>NH</Title>
            <Title>ESTÉTICA</Title>
          </TitleContainer>
        </LogoContainer>

        <NavContainer>
          <nav>
            <StyledLink to="/">Home</StyledLink>
            <StyledLink to="/nosotros">Nosotros</StyledLink>
            <StyledLink to="/servicios">Servicios</StyledLink>
            <StyledLink to="/promociones">Promociones</StyledLink>
            <StyledLink to="/productos">Productos</StyledLink>
            <StyledLink to="/contacto">Contacto</StyledLink>
          </nav>
        </NavContainer>

        <IconsContainer isOpen={isOpen}>
          <Icons>
            <a href="https://w.app/chlxyz" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} style={{ color: "var(--terciary-color)" }} />
            </a>
            <a href="https://www.instagram.com/nhesteticaposadas/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} style={{ color: "var(--terciary-color)" }} />
            </a>
            <a href="https://www.facebook.com/nh.estetica/?locale=es_LA" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} style={{ color: "var(--terciary-color)" }} />
            </a>
          </Icons>
        </IconsContainer>

        <HamburgerMenu isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
      </HeaderContainer>
        <SideMenu isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />

    </FixedWrapper>
  );
}

export default Header;

const FixedWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
`;

const HeaderContainer = styled.header`
  pointer-events: auto;
  padding: 1rem 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: 60px;
  background: linear-gradient(90deg, #F6D8F2 0%, #F6D8F2 25%, #F6D8F2 75%, #F6D8F2 100%);
  border-bottom: 1px solid #eee;

transform: ${(props) =>
  props.scrolled
    ? props.visible
      ? "translateY(0)"
      : "translateY(-100%)"
    : "translateY(0)"};
opacity: ${(props) =>
  props.scrolled
    ? props.visible
      ? 1
      : 0
      : 1};


  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const NavContainer = styled.div`
  nav {
    display: flex;
    gap: 1.5rem;
    transition: all 0.4s ease;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    margin-top: -10px;
    margin-bottom: 1rem;
  }
`;

const Logo = styled.img`
  width: 50px;
  object-fit: contain;
`;

const Title = styled.h1`
  color: var(--background-dark);
  font-size: 1.5rem;
  font-family: var(--logo-font), sans-serif;
  transform: skew(-10deg);
  margin: 0 2px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 5px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const Icons = styled.div`
  font-size: 25px;
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(RouterLink)`
  font-family: var(--heading-font);
  color: var(--background-dark);
  font-size: 19px;
  text-decoration: none;
  margin: 0 0.9rem;
  font-weight: 500;
  position: relative;

  &:hover {
    color: var(--terciary-color);
  }

  &::after {
    content: "";
    position: absolute;
    height: 2px;
    background: var(--terciary-color);
    width: 0;
    bottom: -3px;
    left: 0;
    transition: width 0.6s ease;
  }

  &:hover::after {
    width: 95%;
  }
`;
