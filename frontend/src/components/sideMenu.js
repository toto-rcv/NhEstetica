import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink } from "react-router-dom";

function SideMenu({ isOpen, toggleMenu }) {
  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleMenu} />
      <SideMenuContainer isOpen={isOpen}>
        <LogoSection>
          <img src="/logo.png" alt="Logo" width="50" />
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

              <IconsContainer isOpen={isOpen}>
                <Icons>
                  <a href="https://w.app/chlxyz" target="_blank">
                    <FontAwesomeIcon
                      icon={faWhatsapp}                 
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/nhesteticaposadas/"
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}                   
                    />
                  </a>
                  <a
                    href="https://www.facebook.com/nh.estetica/?locale=es_LA"
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      icon={faFacebook}              
                    />
                  </a>
                </Icons>
              </IconsContainer>

        <ContactSection>
          <ContactItem>
            <FontAwesomeIcon icon={faEnvelope} /> contacto@nhestetica.com
          </ContactItem>
          <ContactItem>
            <FontAwesomeIcon icon={faPhone} /> +54 376 4123456
          </ContactItem>
        </ContactSection>
      </SideMenuContainer>
    </>
  );
}

export default SideMenu;

// Styled Components

const Overlay = styled.div`
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9;
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const SideMenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 280px;
  background-color: rgba(224, 117, 162, 0.9);
  color: white;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-size: 1.5rem;
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
  font-size: 1.4rem;
  font-family: var(--heading-font);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 0;

  &:hover {
    color: var(--terciary-color);
  }
`;

const ContactSection = styled.div`
  padding-top: 0.5rem;
`;

const ContactItem = styled.div`
  font-size: 1.2rem;
  margin: 0.6rem 0;
  padding: 0.6rem 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > * {
    font-size: 25px;
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
