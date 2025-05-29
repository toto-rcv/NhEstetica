import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink } from "react-router-dom";

function SideMenu({ isOpen, toggleMenu }) {
  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleMenu} />
      <SideMenuContainer isOpen={isOpen}>
        <LogoSection>
          <img src="/logo.png" alt="Logo" width="70" />
          <h2>NH ESTÉTICA</h2>
        </LogoSection>

        <Nav>
          <StyledLink to="/" onClick={toggleMenu}>
            Inicio
          </StyledLink>
          <StyledLink to="/nosotros" onClick={toggleMenu}>
            Nosotros
          </StyledLink>
          <StyledLink to="/servicios" onClick={toggleMenu}>
            Servicios
          </StyledLink>
          <StyledLink to="/promociones" onClick={toggleMenu}>
            Promociones
          </StyledLink>
          <StyledLink to="/productos" onClick={toggleMenu}>
            Productos
          </StyledLink>
          <StyledLink to="/contacto" onClick={toggleMenu}>
            Contacto
          </StyledLink>
        </Nav>

        
        <ReserveContainer>
          <Button>Reservá tu turno</Button>
        </ReserveContainer>


        <IconsContainer isOpen={isOpen}>
          <Icons>
            <a href="https://w.app/chlxyz" target="_blank">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a
              href="https://www.instagram.com/nhesteticaposadas/"
              target="_blank"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.facebook.com/nh.estetica/?locale=es_LA"
              target="_blank"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="mailto:contacto@nhestetica.com"
              target="_blank"
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} />
            </a>
          </Icons>
        </IconsContainer>
      </SideMenuContainer>
    </>
  );
}

export default SideMenu;

const Overlay = styled.div`
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9;
  transition: opacity 0.7s ease, visibility 0.7s ease, transform 0.7s ease;
`;


const SideMenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 280px;
  background-color: rgba(224, 117, 162, 1);
  color: white;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1011;
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.7s ease;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-size: 2rem;
    margin-top: 0.5rem;
    text-align: center;
    font-family: var(--heading-font);
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  text-align: center;
`;

const StyledLink = styled(RouterLink)`
  color: white;
  text-decoration: none;
  font-size: 1.45rem;
  font-family: var(--heading-font);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 0;

  &:hover {
    color: var(--terciary-color);
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    margin-bottom: 1rem;
  }
`;

const Icons = styled.div`
  font-size: 25px;
  color: var(--background-color);
  display: flex;
  gap: 1rem;

  a > * {
    color: var(--background-color);
    padding: 30px 0;
  }
`;


const Button = styled.button`
    padding: 15px 30px;
    font-size: 1rem;
    background-color: var(--terciary-color);
    font-family: var(--heading-font);
    font-weight: 600;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    display: inline-block;
    width: fit-content;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);


    &:hover {
        background-color: color-mix(in srgb, var(--terciary-color) 95%, black 5%);
        transform: scale(1.05);
    }
`;

const ReserveContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 30px 0 0;
`