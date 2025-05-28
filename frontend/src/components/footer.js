import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { faFacebook, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  return (
    <FooterContainer>
      <TopSection>
        <FigureLeft src='footer/caraconflor.png' alt="Logo" />
        <LogoContainer>
                <Logo src='logo.png' alt="Logo" />
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
                    <StyledLink to="/">Home</StyledLink>
                    <StyledLink to="/nosotros">Nosotros</StyledLink>
                    <StyledLink to="/servicios">Servicios</StyledLink>
                    <StyledLink to="/promociones">Promociones</StyledLink>
                    <StyledLink to="/productos">Productos</StyledLink>
                    <StyledLink to="/contacto">Contacto</StyledLink>
                </nav>
            </NavContainer>
          </Column>
          <Column>
            <h4>SERVICIOS</h4>
            <ul>
              <li>Tratamientos faciales</li>
              <li>Tratamientos corporales</li>
              <li>Tratamientos de depilación</li>
              <li>Masajes</li>
            </ul>
          </Column>
          <Column>
            <h4>PRODUCTOS</h4>
            <ul>
              <li>Serum Libra</li>
              <li>Gel Limpieza</li>
              <li>Crema Libra</li>
              <li>Crema Lidherma</li>
              <li>Crema Idraet</li>
              <li>Urucurm</li>
              <li>Exfoliantes Py</li>
              <li>Serum Brillos</li>
            </ul>
          </Column>
        </FooterNav>
        <FigureRight src='footer/rosa.png' alt="Logo" />
      </TopSection>

      <BottomSection>
        <span>Desarrollado por los pibardos</span>
        <span>2025 - © Todos los derechos reservados.</span>
            <IconsContainer>
                <Icons>
                    <a href='https://w.app/chlxyz' target="_blank"> <FontAwesomeIcon icon={faWhatsapp} style={{ color: "var(--background-dark)" }} /> </a>
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
    var(--primary-color) 25%,
    var(--secondary-color) 75%,
    rgba(224, 117, 212, 0.3) 100%
  );
  padding: 40px 12vw;
  color: #000;
  position: relative;
   overflow: hidden;
`;


const TopSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid rgba(0,0,0,0.4);
  padding-bottom: 30px;
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    margin: 1.33em 30px 0 0;
`;

const Logo = styled.img`
  width: 80px;
  object-fit: contain;

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
`;

const FooterNav = styled.div`
  display: flex;
  gap: 40px;
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
`;

const BottomSection = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
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

const FigureLeft = styled.img`
    object-fit: contain;
    position: absolute;
    left: 30px;
    top: 22vh;
    width: 170px;
    transform: rotate(25deg);
    filter: drop-shadow(5px 5px 10px rgba(224, 117, 212, 1));
`;

const FigureRight = styled.img`
  object-fit: contain;
  position: absolute;
  top: 10vh;
  right: 25px;
  width: 110px;
`;