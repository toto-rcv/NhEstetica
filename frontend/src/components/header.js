import React, { useState } from "react";
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

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src="logo.png" alt="Logo" />
        <TitleContainer>
          <Title>NH</Title>
          <Title>ESTÉTICA</Title>
        </TitleContainer>
      </LogoContainer>

      <NavContainer isOpen={isOpen}>
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
          <a href="https://w.app/chlxyz" target="_blank">
            <FontAwesomeIcon
              icon={faWhatsapp}
              style={{ color: "var(--terciary-color)" }}
            />
          </a>
          <a
            href="https://www.instagram.com/nhesteticaposadas/"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              style={{ color: "var(--terciary-color)" }}
            />
          </a>
          <a
            href="https://www.facebook.com/nh.estetica/?locale=es_LA"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              style={{ color: "var(--terciary-color)" }}
            />
          </a>
        </Icons>
      </IconsContainer>

      <HamburgerMenu isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
      <SideMenu isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
    </HeaderContainer>
  );
}

export default Header;

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

const HeaderContainer = styled.header`
   background: linear-gradient(
    90deg,
    rgba(224, 117, 212, 0.3) 0%,
    var(--primary-color) 25%,
    var(--secondary-color) 75%,
    rgba(224, 117, 212, 0.3) 100%
  );
  padding: 1rem 5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: 60px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
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
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

//

const LogoContainer = styled.div`
  display: flex;
  row-direction: row;
  gap: 5px;
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
