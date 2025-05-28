import React from 'react';
import styled from 'styled-components';

function Reserve() {
    return (
        <ServicesContainer>
            <Background />
            <Overlay>
                <Title>HACÉ UNA PAUSA, TE LO MERECÉS</Title>
                <Button>Reserva tu turno</Button>
            </Overlay>
        </ServicesContainer>
    );
}

export default Reserve;

// Container principal
const ServicesContainer = styled.div`
    width: 100%;
    height: 450px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/slider/mujerTurnos.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(1px);
    z-index: 1;
`;

const Overlay = styled.div`
    position: absolute;
    z-index: 2;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Title = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--background-color);
    font-family: var(--heading-font), sans-serif;
    transform: skew(-10deg);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
`;

const Button = styled.button`
     padding: 15px 30px;
    font-size: 1rem;
    background-color: var(--terciary-color);
    font-family: var(--heading-font);
    font-weight: 600;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    display: inline-block;
    width: fit-content;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);


    &:hover {
        background-color: color-mix(in srgb, var(--terciary-color) 95%, black 5%);
        transform: scale(1.05);
    }
`;