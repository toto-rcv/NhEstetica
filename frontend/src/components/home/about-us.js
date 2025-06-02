import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function AboutUs() {
    const location = useLocation();
    const isNosotrosPage = location.pathname === '/nosotros';

    return (
        <Container>
            <ImageBox>               
                <StyledImage src="/aboutUs/about.png" alt="Especialista en estética" />
            </ImageBox>

            <TextContent>
                <SmallHeading>Tu especialista de estética</SmallHeading>
                <MainHeading>¿Quiénes somos?</MainHeading>

                <SectionTitle>Here’s why you’ll love working with us:</SectionTitle>
                <ul>
                    <li><strong>Expert and compassionate care.</strong> Sabrina, your skincare specialist, has over 6 years of experience and is well versed in many treatments for all skin types. Learn more about her journey</li>
                    <li><strong>Luxurious and advanced treatments.</strong> We offer a relaxing spa-like experience with advanced clinical treatment technology.</li>
                    <li><strong>Facial customization.</strong> Unique services and add-ons based on your skin goals.</li>
                </ul>

                {!isNosotrosPage && <Button to="/nosotros">Ver más</Button>}
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

const Button = styled(RouterLink)`
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