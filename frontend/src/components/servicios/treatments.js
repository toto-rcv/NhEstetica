import React from "react";
import styled from "styled-components";

function treatments({ image, description, title }) {
    return (
        <ContentWrapper>
            <ContentImage>
                <Background image={image}>
                    <Overlay />
                </Background>
            </ContentImage>
            <ContentText>
                <Title>{title}</Title>
                <Content>{description}</Content>
            </ContentText>
        </ContentWrapper>
    );
}

export default treatments;

const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    margin: 2rem 0;
    padding: 0;
    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
    }
`;
const ContentText = styled.div`
    width: 45%;
    height: 400px;
    display: flex;
    align-items: center;
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
  
  /* Centrar horizontalmente en columna */
  @media (max-width: 768px) {
      width: 100%;
      height: 300px;
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
    font-size: 2rem;
    z-index: 1;
    font-family: var(--heading-font), sans-serif;
    align-items: center;
    @media (max-width: 768px) {
        width: 100%;
        font-size: 2rem;
        padding: 2rem 0;
    }
`;

const Title = styled.h2`
    font-size: 2.5rem;
    margin: 0 0 1.5rem;
    color: var(--terciary-color);
    font-family: var(--heading-font), sans-serif;
    @media (max-width: 768px) {
        font-size: 2rem;
        text-align: center;
    }
`

const ContentImage = styled.div`
    width: 25%;
    height: 400px;
    position: relative;
    border-radius:10%;
    @media (max-width: 768px) {
        width: 100%;
        height: 300px;
        margin-left: auto;
        margin-right: auto;
    }
`;