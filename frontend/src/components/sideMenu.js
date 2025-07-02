import React, { useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelopeOpenText, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SideMenu({ isOpen, toggleMenu }) {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el menú esté abierto
      document.body.classList.add("menu-open");
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurar scroll del body cuando el menú se cierre
      const scrollY = document.body.style.top;
      document.body.classList.remove("menu-open");
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup en caso de que el componente se desmonte con el menú abierto
    return () => {
      if (isOpen) {
        document.body.classList.remove("menu-open");
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
      }
    };
  }, [isOpen]);

  const handleLogout = () => {
    toggleMenu();
    logout();
  };

  // Cerrar menú al hacer clic en un enlace
  const handleLinkClick = () => {
    toggleMenu();
  };

  // Manejar login/logout desde el menú móvil
  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Si está logueado, hacer logout
      toggleMenu();
      logout();
    } else {
      // Si no está logueado, ir al login
      toggleMenu();
      navigate('/login');
    }
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleMenu} />
      <SideMenuContainer isOpen={isOpen}>
        <CloseButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>

        <LogoSection>
          <img src="/logo.png" alt="Logo" width="70" />
          <h2>NH ESTÉTICA</h2>
        </LogoSection>

        <Nav>
          <StyledLink to="/" onClick={handleLinkClick}>Inicio</StyledLink>
          <StyledLink to="/nosotros" onClick={handleLinkClick}>Nosotros</StyledLink>
          <StyledLink to="/servicios" onClick={handleLinkClick}>Servicios</StyledLink>
          <StyledLink to="/promociones" onClick={handleLinkClick}>Promociones</StyledLink>
          <StyledLink to="/productos" onClick={handleLinkClick}>Productos</StyledLink>
          <StyledLink to="/contacto" onClick={handleLinkClick}>Contacto</StyledLink>
        </Nav>

        <AuthSection>
          {isLoggedIn ? (
            <AuthButton 
              onClick={handleLogout}
              $isLoggedIn={true}
            >
              Cerrar Sesión
            </AuthButton>
          ) : (
            <AuthButton 
              onClick={handleAuthAction}
              $isLoggedIn={false}
            >
              Iniciar Sesión
            </AuthButton>
          )}
        </AuthSection>

        <IconsContainer isOpen={isOpen}>
          <Icons>
            <a href="https://w.app/chlxyz" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="https://www.instagram.com/nhesteticaposadas/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.facebook.com/nh.estetica/?locale=es_LA" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="mailto:contacto@nhestetica.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEnvelopeOpenText} />
            </a>
          </Icons>
        </IconsContainer>
      </SideMenuContainer>
    </>
  );
}

export default SideMenu;

// Styled Components

const Overlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9;
  transition: opacity 0.7s ease, visibility 0.7s ease, transform 0.7s ease;
`;

const SideMenuContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
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
  transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.7s ease;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  align-self: flex-end;
  cursor: pointer;
  margin-bottom: -1rem;
  margin-top: -1rem;
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

  @media (max-width: 768px) {
  img {
      width: 50px;
    }
    h2 {
      font-size: 1.5rem;
    }
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
  font-size: 1.25rem;
  font-family: var(--heading-font);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 0;

  &:hover {
    color: var(--terciary-color);
  }
`;

const IconsContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
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



const AuthSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px 0 0;
`;

const AuthButton = styled.button`
  background: ${props => props.$isLoggedIn 
    ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' 
    : 'linear-gradient(135deg, var(--primary-color-dark) 0%, var(--terciary-color) 100%)'
  };
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--heading-font);
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: ${props => props.$isLoggedIn 
      ? 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)' 
      : 'linear-gradient(135deg, var(--terciary-color) 0%, var(--primary-color-dark) 100%)'
    };
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;
