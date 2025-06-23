import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import { faPhone as faPhoneBrand } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ContactSection = () => {
  return (
    <Container>
      <Subtitle>¿Necesitás ayuda?</Subtitle>
      <Title>INFORMACIÓN DE CONTACTO</Title>
      <CardWrapper>
        <Card>
          <Icon icon={faWhatsapp} />
          <Label>WHATSAPP</Label>
          <Text>3764-522111</Text>
        </Card>
        <Card>
          <Icon icon={faPhoneBrand} />
          <Label>CELULAR</Label>
          <SmallText>(+54 376) 4422700</SmallText>
        </Card>
        <Card>
          <Icon icon={faClock} />
          <Label>HORARIO</Label>
          <SmallText>Lunes a viernes</SmallText>
          <SmallText>00:00 – 23:59</SmallText>
        </Card>
        <Card>
          <Icon icon={faEnvelope} />
          <Label>EMAIL</Label>
          <SmallText>nataliahenriquez@gmail.com</SmallText>
        </Card>
      </CardWrapper>
    </Container>
  );
};

export default ContactSection;

// Styled Components
const Container = styled.section`
  background: var(--background-color);
  text-align: center;
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--terciary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.9rem;
  font-family: var(--heading-font);
  font-weight: 400;
  color: var(--text-color);
  margin-bottom: 2rem;
  margin-top: 0;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    display: inline-block;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const Card = styled.div`
  background: var(--background-overlay);
  border: 2px solid var(--primary-color);
  border-radius: 1.8rem;
  padding: 1.8rem;
  width: 200px;
  min-height: 210px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 1200px) {
    &:last-child, &:first-child {
        position: relative;
        top: -25px;
    }
  }

  &:first-child {
    svg {
    font-size: 55px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: 140px;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.5rem;
  color: var(--primary-color);
`;

const Label = styled.p`
  font-weight: 500;
  color: var(--text-color);
  font-family: var(--heading-font);
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
`;

const Text = styled.p`
  color: var(--text-color);
  font-size: 0.95rem;
  margin: 2px 0;
`;

const SmallText = styled.p`
  color: var(--text-color);
  font-size: 0.85rem;
  margin: 2px 0;
`;
