import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function WhatsApp() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <WhatsAppButton onClick={() => setShowModal(true)}>
                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#25d366" }} />
            </WhatsAppButton>
            {showModal && (
                <Backdrop onClick={() => setShowModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <HeaderConteiner>
                            <ConteinerTitleIcon>
                                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#fff", fontSize: "24px" }} />
                                <Title>WhatsApp!</Title>
                            </ConteinerTitleIcon>
                            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
                        </HeaderConteiner>
                        <Text>Si tienes curiosidad acerca de mis servicios o estás listo para reservar una sesión, ¡no dudes en ponerte en contacto conmigo!</Text>
                        {/* Aquí puedes poner más contenido */}
                    </ModalContent>
                </Backdrop>
            )}
        </>
    );
}

export default WhatsApp;

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 60px;
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
  border-radius: 10px;
  position: absolute; 
  bottom: 6%;
  right: 1%;
  width: 400px;
`;

const CloseButton = styled.button`
  top: 10px; right: 10px;
  background: rgba(0, 0, 0, .4) ;
  color: var(--background-overlay);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  --size: 34px;
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  transition: background-color .3s ease-out;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const HeaderConteiner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  background-color: #26d566;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
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