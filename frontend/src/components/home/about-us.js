import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

function AboutUs() {
    const location = useLocation();
    const navigate = useNavigate();
    const isNosotrosPage = location.pathname === '/nosotros';

    const handleClick = () => {
        navigate('/nosotros');
        window.scrollTo(0, 0);
    };

    return (
        <Container>
            <ImageBox>               
                <StyledImage src="/aboutUs/about.png" alt="Especialista en estética" />
            </ImageBox>

            <TextContent>
                <SmallHeading>Tu especialista de estética</SmallHeading>
                <MainHeading>¿Quiénes somos?</MainHeading>

                <SectionTitle>Por eso te encantará trabajar con nosotros:</SectionTitle>
                <ul>
                    <li><strong>En NH Estética, entendemos la belleza como un reflejo del bienestar integral. </strong> Por eso, nuestro equipo de profesionales se dedica a ofrecer una atención personalizada y tratamientos de última generación, pensados para que te veas y te sientas increíble, desde adentro hacia afuera.</li>
                    <li><strong>Descubrí el poder transformador</strong> de nuestros tratamientos y sentí la diferencia que hace un enfoque verdaderamente personalizado de la belleza y el bienestar.</li>
                    <li><strong>Liberá tu belleza natural.</strong> y embarcate en un viaje de autocuidado con nuestra exclusiva selección de tratamientos. Desde masajes relajantes hasta cuidados faciales de última generación, todo pensado para vos.</li>
                </ul>

                {!isNosotrosPage && <Button onClick={handleClick}>Ver más</Button>}
            </TextContent>
        </Container>
    );
}

export default AboutUs;

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 8rem;
    padding: 6rem 2rem;
    max-width: 1200px;
    margin: auto;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        text-align: center;
        padding: 4rem 2rem;
        gap: 3rem;
    }
`;

const ImageBox = styled.div`
    position: relative;
    flex: 1;
    max-width: 400px;
    border-radius: 30px;
    overflow: hidden;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const StyledImage = styled.img`
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    border-radius: 70px;

    @media (max-width: 768px) {
       max-height: 380px;
       aspect-ratio: 16/20;
    }
`;


const TextContent = styled.div`
    flex: 2;

    ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin: 1rem 0;
        color: #444;

        li {
            margin-bottom: 1rem;
            line-height: 1.6;

            a {
                color: var(--primary-color);
                text-decoration: underline;
            }
        }
    }

      @media (max-width: 768px) {
        ul {
            list-style-type: none;
            padding: 0;
            text-align: -webkit-center;
        }  
      }
`;

const SmallHeading = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--terciary-color);
    margin: 0;
    font-family: var(--heading-font),sans-serif;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
`;

const MainHeading = styled.h2`
    font-size: 2.5rem;
    margin: 0 0 2rem;
    font-family: var(--heading-font);
    transform: skew(-10deg);

      @media (max-width: 768px) {
       font-size: 2.3rem;
     }
`;

const SectionTitle = styled.h3`
    color: var(--terciary-color);
    font-size: 1.1rem;
    margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 1rem;
  background-color: var(--terciary-color);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  display: inline-block;
  font-family: var(--heading-font);
  font-weight: 600;
  margin-top: 1rem;

  &:hover {
    background-color: color-mix(in srgb, var(--terciary-color) 95%, black 5%);
    transform: scale(1.05);
  }
`;