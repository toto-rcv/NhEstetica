import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideMenu from "./sideMenu";
import HamburgerMenu from "./hamburgerMenu";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, goToAdmin } = useAuth();

  const handleLogout = () => {
    setShowUserDropdown(false);
    logout();
  };

  const handleGoToAdmin = () => {
    setShowUserDropdown(false);
    goToAdmin();
  };

  const handleGoToLogin = () => {
    navigate('/login');
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
            <StyledLink to="/productos">Productos</StyledLink>
            <StyledLink to="/promociones">Promociones</StyledLink>
            <StyledLink to="/contacto">Contacto</StyledLink>
          </nav>
        </NavContainer>

        <RightSection>
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
              {isLoggedIn ? (
                <UserAvatarSection>
                  <UserAvatar 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
                    tabIndex={0}
                  >
                    {user?.imagen ? (
                      <AvatarImage src={`/api${user.imagen}`} alt="Avatar" />
                    ) : (
                      <AvatarInitials>
                        {user?.type === 'admin' 
                          ? user?.username?.substring(0, 2).toUpperCase()
                          : `${user?.nombre?.charAt(0)}${user?.apellido?.charAt(0)}`.toUpperCase()
                        }
                      </AvatarInitials>
                    )}
                  </UserAvatar>
                  
                  {showUserDropdown && (
                    <UserDropdownMenu>
                      <UserInfo>
                        {user?.type === 'admin' ? `Admin: ${user?.username}` : user?.fullName}
                        {user?.type === 'admin' && !user?.hasAdminPermission && (
                          <PermissionWarning>Sin permisos completos</PermissionWarning>
                        )}
                      </UserInfo>
                      <DropdownDivider />
                      {user?.type === 'admin' && (
                        <DropdownMenuItem 
                          onClick={handleGoToAdmin}
                          disabled={!user?.hasAdminPermission}
                          $hasPermission={user?.hasAdminPermission}
                        >
                          Ir a Tablas
                          {!user?.hasAdminPermission && ' (Sin permisos)'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout}>
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </UserDropdownMenu>
                  )}
                </UserAvatarSection>
              ) : (
                <LoginIconSection>
                  <LoginIcon onClick={handleGoToLogin}>
                    <FontAwesomeIcon icon={faDoorOpen} style={{ color: "var(--terciary-color)" }} />
                  </LoginIcon>
                </LoginIconSection>
              )}
            </Icons>
          </IconsContainer>

          <HamburgerMenu isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
        </RightSection>
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
  position: relative;
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1024px) {
    gap: 0.5rem;
    margin-left: auto;
  }
`;

const IconsContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  display: flex;
  align-items: center;
  justify-content: center;

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
  align-items: center;
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

const UserAvatarSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  z-index: 1001;
  margin-left: 1rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const LoginIconSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 1rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const LoginIcon = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--terciary-color);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;

  &:hover {
    background: var(--terciary-color);
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(224, 117, 162, 0.4);
    
    svg {
      color: white !important;
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(224, 117, 162, 0.3);
  }
`;

const UserAvatar = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--terciary-color);
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--terciary-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(224, 117, 162, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(224, 117, 162, 0.3);
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const AvatarInitials = styled.span`
  color: white;
  font-weight: 600;
  font-size: 14px;
  font-family: var(--heading-font);
`;

const UserDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(224, 117, 162, 0.1);
  z-index: 1000;
  min-width: 200px;
  padding: 8px 0;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 15px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }
`;

const UserInfo = styled.div`
  padding: 12px 16px;
  font-family: var(--heading-font);
  color: var(--background-dark);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(224, 117, 162, 0.2);
  margin: 4px 0;
`;

const DropdownMenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  font-family: var(--text-font);
  font-size: 14px;
  color: var(--background-dark);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background: ${props => props.disabled ? 'transparent' : 'rgba(224, 117, 162, 0.1)'};
    color: ${props => props.disabled ? 'var(--background-dark)' : 'var(--terciary-color)'};
  }

  &:last-child {
    color: #e74c3c;
    
    &:hover {
      background: rgba(231, 76, 60, 0.1);
      color: #c0392b;
    }
  }

  ${props => !props.$hasPermission && props.disabled && `
    color: #999;
    font-style: italic;
  `}
`;

const PermissionWarning = styled.div`
  font-size: 11px;
  color: #e74c3c;
  font-weight: 400;
  margin-top: 4px;
  font-style: italic;
`;