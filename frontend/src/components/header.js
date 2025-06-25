import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideMenu from "./sideMenu";
import HamburgerMenu from "./hamburgerMenu";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { IoMdArrowDropdown } from "react-icons/io";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('username');
    if (loginStatus === 'true' && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  const handleGoToAdmin= () => {
    navigate('/admin/inicio');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setHasScrolled(true);
        setShowHeader(currentScrollY < lastScrollY);
      } else {
        setHasScrolled(false);
        setShowHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <FixedWrapper>
      <HeaderContainer visible={showHeader} scrolled={hasScrolled}>
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <LogoContainer>
            <Logo src="/logo.png" alt="Logo" />
            <TitleContainer>
              <Title>NH</Title>
              <Title>ESTÉTICA</Title>
            </TitleContainer>
          </LogoContainer>
        </RouterLink>
        <NavContainer>
          <nav>
            <StyledLink to="/">Inicio</StyledLink>
            <StyledLink to="/nosotros">Nosotros</StyledLink>
            <DropdownWrapper
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <StyledLink to="/servicios">
                Servicios <IoMdArrowDropdown />
              </StyledLink>
              {showDropdown && (
                <>
                  <HoverBridge />
                  <DropdownContainer>
                    <DropdownItem to="/servicios/DepilacionLaser" onClick={() => setShowDropdown(false)}>
                      Depilación Láser
                    </DropdownItem>
                    <DropdownItem to="/servicios/TratamientosCorporales" onClick={() => setShowDropdown(false)}>
                      Corporales
                    </DropdownItem>
                    <DropdownItem to="/servicios/TratamientosFaciales" onClick={() => setShowDropdown(false)}>
                      Faciales
                    </DropdownItem>
                    <DropdownItem to="/servicios/masajes" onClick={() => setShowDropdown(false)}>
                      Masajes
                    </DropdownItem>
                  </DropdownContainer>
                </>
              )}
            </DropdownWrapper>
            <StyledLink to="/promociones">Promociones</StyledLink>
            <StyledLink to="/productos">Productos</StyledLink>
            <StyledLink to="/contacto">Contacto</StyledLink>
            {isLoggedIn && (
              <UserSection>
                <UserInfo>Hola, {username}</UserInfo>
                <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
                <AdminButton onClick={handleGoToAdmin}>Ir al admin</AdminButton>
              </UserSection>
            )}
          </nav>
        </NavContainer>

        <IconsContainer isOpen={isOpen}>
          <Icons>
            <a href="https://wa.link/56ou29" target="_blank" rel="noopener noreferrer">
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

// === STYLES ===

const FixedWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
`;

const HeaderContainer = styled.header.withConfig({
  shouldForwardProp: (prop) => prop !== "visible" && prop !== "scrolled",
})`
  pointer-events: auto;
  padding: 1rem 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: 60px;
  background: linear-gradient(90deg, #f6d8f2 0%, #f6d8f2 100%);
  border-bottom: 1px solid #eee;
  transform: ${(props) => (props.scrolled ? (props.visible ? "translateY(0)" : "translateY(-100%)") : "translateY(0)")};
  opacity: ${(props) => (props.scrolled ? (props.visible ? 1 : 0) : 1)};
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
      align-items: center;
  }

    
    @media (min-width: 1024px) and (max-width: 1200px) {
      padding: 1rem 2rem;
    }
`;

const NavContainer = styled.div`
  nav {
    display: flex;
    gap: 1.5rem;
    transition: all 0.4s ease;
      align-items: center;

  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const IconsContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;

  @media (max-width: 1024px) {
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

  @media (max-width: 1024px) {
    font-size: 28px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    flex-direction: row;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 5px;

  @media (max-width: 1024px) {
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
  display: flex;
  align-items: center;

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

    @media (min-width: 1024px) and (max-width: 1200px) {
      font-size: 17px;
      margin: 0 3px;
    }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  left: 0;
  background: var(--background-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  border-radius: 8px;
  z-index: 1000;
  min-width: 180px;
  padding: 0.5rem 0;
  transition: opacity 0.2s ease;
`;

const DropdownItem = styled(RouterLink)`
  display: block;
  padding: 0.7rem 1rem;
  text-decoration: none;
  font-family: var(--heading-font);
  font-size: 1.1rem;
  color: var(--background-dark);

  &:hover {
    background-color: var(--terciary-color);
    color: white;
  }
`;

const HoverBridge = styled.div`
  position: absolute;
  top: 100%;
  height: 15px;
  width: 100%;
  background: transparent;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
`;

const UserInfo = styled.span`
  font-family: var(--heading-font);
  color: var(--background-dark);
  font-size: 16px;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
  }
`;

const AdminButton = styled.button`
  background: var(--terciary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
  }
`;