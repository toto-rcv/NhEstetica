import React from "react";
import styled from "styled-components";

function treatmentsLeft({ image, description, title }) {
    return (
        <ContentWrapper>
            <ContentImage>
                <Background image={image}>
                    <Overlay />
                    <ButtonWrapper>
                        <Button>VER MÁS</Button>
                    </ButtonWrapper>
                </Background>
            </ContentImage>
            <ContentText>
                <Title>{title}</Title>
                <Content>{description}</Content>
            </ContentText>
        </ContentWrapper>
    );
}

export default treatmentsLeft;

const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
    padding: 5rem 0 1rem 0;
    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
    }
`;
const ContentText = styled.div`
    width: 40.5%; 
    height: 360px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: relative;
    flex-direction: column;
    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        margin-left: auto;
        margin-right: auto;
    }
 `

const Background = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10%;
  
  @media (max-width: 768px) {
      width: 100%;
      height: 270px; 
      margin-left: auto;
      margin-right: auto;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1;
  border-radius: 10%;
`;

const Content = styled.div`
    color: var(--background-dark);
    font-size: 1.35rem; 
    z-index: 1;
    font-family: var(--text-font), sans-serif;
    align-items: center;
    @media (max-width: 768px) {
        width: 100%;
        font-size: 1.8rem; 
        padding: 2rem 0;
    }
`;

const Title = styled.h2`
    font-size: 1.98rem;
    margin: 0 0 1.5rem;
    color: var(--terciary-color);
    font-family: var(--heading-font), sans-serif;
    @media (max-width: 768px) {
        font-size: 1.8rem; 
        text-align: center;
    }
`

const ContentImage = styled.div`
    width: 27%;
    height: 360px;
    position: relative;
    border-radius:10%;
    @media (max-width: 768px) {
        width: 100%;
        height: 270px;
        margin-left: auto;
        margin-right: auto;
    }
    transition: transform 0.3s ease-in-out;
    &:hover {
        transform: scale(1.05);
    }
`;

const ButtonWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    pointer-events: none;
    @media (max-width: 768px) {
        top: 80%;
    }
`;

const Button = styled.button`
  pointer-events: auto;
  padding: 15px 30px;
  font-size: 1.3rem;
  background-color: transparent;
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
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
  &:hover {
    transform: scale(1.05);
  }
`;