import React from "react";
import styled from "styled-components";

function Breadcrumb({ image, title, position = 'right', titleColor, textShadow = true }) {
  return (
    <Background $image={image}>
      <Overlay />
      <Content
        $position={position}
        $titleColor={titleColor}
        $textShadow={textShadow}
      >
        {title}
      </Content>
    </Background>
  );
}

export default Breadcrumb;

const Background = styled.div`
  position: relative;
  width: 100%;
  height: 550px;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

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
  left: ${props => props.$position === 'left' ? '30%' : '70%'};
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  color: ${props => props.$titleColor || 'var(--background-dark)'};
  font-size: 4rem;
  font-family: var(--heading-font), sans-serif;
  font-weight: 600;
  z-index: 1;
  ${({ $textShadow }) =>
    $textShadow
      ? 'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);'
      : 'text-shadow: none;'
  }

  @media (min-width: 770px) and (max-width: 1200px) {
    left: 50px;
    transform: translateY(-50%);
    font-size: 3.5rem;
  }

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