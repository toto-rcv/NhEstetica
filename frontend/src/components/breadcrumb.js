import React from "react";
import styled from "styled-components";

function Breadcrumb({ image, title }) {
  return (
    <Background image={image}>
      <Overlay />
      <Content>{title}</Content>
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
    left: 70%;
    transform: translate(-50%, -50%);
    color: var(--background-dark);
    font-size: 4rem;
    text-shadow: 2px 2px 4px rgb(255 255 255 / 50%);
    z-index: 1;
    font-family: var(--heading-font), sans-serif;
    font-weight: 600;
    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;
