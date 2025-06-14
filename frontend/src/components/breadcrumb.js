import React from "react";
import styled from "styled-components";

function Breadcrumb({ image, title, position = 'right' }) {
  return (
    <Background image={image}>
      <Overlay />
      <Content position={position}>{title}</Content>
    </Background>
  );
}

export default Breadcrumb;

const Background = styled.div`
  position: relative;
  width: 100%;
  height: 550px;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 30vh;  
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1;
`;

const Content = styled.div`
  position: absolute;
  top: 45%;
  left: ${props => props.position === 'left' ? '30%' : '70%'};
  transform: translate(-50%, -50%);
  color: var(--background-dark);
  font-size: 4rem;
  text-shadow: 2px 2px 4px rgb(255 255 255 / 50%);
  z-index: 1;
  font-family: var(--heading-font), sans-serif;
  font-weight: 600;

  @media (max-width: 768px) {
    top: 65%;
    left: 50%;
    width: 100%;
    font-size: 2.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    transform: translate(-50%, -50%);
  }
`;
