import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function WhatsApp() {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setShowModal(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300); // Duración igual a la animación de salida
  };

  return (
    <>
      <WhatsAppButton onClick={openModal}>
        <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#25d366" }} />
      </WhatsAppButton>
      {showModal && (
        <Backdrop onClick={closeModal}>
          <ModalContent
            onClick={e => e.stopPropagation()}
            $isClosing={isClosing}
          >
            <HeaderConteiner>
              <ConteinerTitleIcon>
                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#fff", fontSize: "35px" }} />
                <Title>WhatsApp</Title>
              </ConteinerTitleIcon>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </HeaderConteiner>
            <Text>Si tienes curiosidad acerca de mis servicios o estás listo para reservar una sesión, ¡no dudes en ponerte en contacto conmigo!</Text>
            {/* Aquí puedes poner más contenido */}
            <TextOpen href='https://wa.me/5491168520606' target="_blank">¡Abrir Chat!</TextOpen>
          </ModalContent>
        </Backdrop>
      )}
    </>
  );
}

export default WhatsApp;

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0;
  border: none;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    font-size: 60px;
    border-radius: 50%;
    display: block;
  }

  &:hover {
    transform: scale(1.1);
    transition: background-color 0.3s ease, transform 0.3s ease;
  }

  @media (max-width: 768px) {
    left: 10px;
    right: none;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(1000px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-1000px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;


const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(1000px) scale(0.95);
  }
`;

const fadeOutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-1000px) scale(0.95);
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 10%;
  position: absolute; 
  bottom: 6%;
  right: 1%;
  width: 400px;
  animation: ${({ $isClosing }) => $isClosing ? fadeOut : fadeIn} 0.3s forwards;

  @media (max-width: 768px) {
    animation: ${({ $isClosing }) => $isClosing ? fadeOutLeft : fadeInLeft} 0.3s forwards;
    right: auto; 
    left: 1%;
  }
`;

const CloseButton = styled.button`
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, .35);
    color: var(--background-overlay);
    border: none;
    font-size: 1.7rem;
    cursor: pointer;
    --size: 36px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    transition: background-color .3s ease-out;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HeaderConteiner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  background-color: #26d566;
  padding: 1rem;
  border-radius: 25px 25px 0 0;
`;
const Title = styled.h3`
  font-size: 1.5rem;
  color: var(--background-overlay);
  margin: 0;
  font-family: var(--heading-font), sans-serif;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
  `;

const Text = styled.p`
    position: relative;
    min-width: 60px;
    max-width: calc(100% - 52px);
    min-height: 56px;
    padding: 15px 20px;
    margin: 0 26px 16px;
    border-radius: 26px;
    background: #fff;
    color: #4a4a4a;
    word-break: break-word;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .3));
    transform-origin: 0 50%;
    animation: joinchat_show .25s cubic-bezier(0,0,.58,1.19) 10ms both;
`;
const ConteinerTitleIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TextOpen = styled.a`
  display: block;
  margin: 10px 28px 20px auto;
  padding: 15px 25px;
  background-color: #25d366;
  color: white;
  border-radius: 26px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  width: fit-content;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .3));
  transform-origin: 0 50%;
  animation: joinchat_show .25s cubic-bezier(0,0,.58,1.19) 10ms both;

  &:hover {
    background-color: #128C7E;
    transition: background-color 0.3s ease;
  }
`;