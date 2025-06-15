import React from 'react';
import styled from 'styled-components';

const MapSection = () => {
  return (
    <MapContainer>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10021.980266881754!2d-55.90716112995228!3d-27.366185345746477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9457be30cc1feca5%3A0x229eea19bea98e88!2sEdificio%20G%C3%A9minis!5e0!3m2!1ses!2sar!4v1749938469511!5m2!1ses!2sar" // ← tu link generado
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </MapContainer>
  );
};

export default MapSection;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 3rem;
  position: relative;
  box-shadow: 3px 3px rgba(0,0,0,0.1);

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    filter: saturate(0.4) brightness(0.9) contrast(0.95);
  }
`;
