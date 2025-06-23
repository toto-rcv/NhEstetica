// HamburgerMenu.js
import React from "react";
import styled from "styled-components";

function HamburgerMenu({ isOpen, toggleMenu }) {
  return (
    <Hamburger onClick={toggleMenu} isOpen={isOpen}>
      <span />
      <span />
      <span />
    </Hamburger>
  );
}

export default HamburgerMenu;

const Hamburger = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 25px;
  width: 40px;
  z-index: 11;

  span {
    height: 3px;
    width: 80%;
    background: var(--background-dark);
    margin: 3px 0;
    transition: all 0.3s ease;
  }

  @media (max-width: 1024px) {
    display: flex;
  }

  ${(props) =>
    props.isOpen &&
    `
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  `}
`;
