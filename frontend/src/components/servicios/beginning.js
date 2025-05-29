import React from 'react'
import styled from 'styled-components';


function Beginning() {
    return (
        <ConteinerBenning>
            <Image src="comienzoUno.jpeg" alt="Inicio" />
        </ConteinerBenning>   
    )
}

export default Beginning


const ConteinerBenning = styled.div`
  position: relative;
  width: 100%;
  height: 700px;
  overflow: hidden;
  margin: 0;
  padding: 0;
  `;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    `;