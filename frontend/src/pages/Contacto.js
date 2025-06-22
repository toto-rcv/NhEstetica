import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Breadcrumb from "../components/breadcrumb";
import ContactInformation from "../components/contact/ContactInformation";
import ContactForm from "../components/contact/ContactForm";
import ContactMap from "../components/contact/ContactMap";

function Contacto() {
  return (
    <>
    <Breadcrumb image="/breadcrumbs/contacto.jpg" title="Contacto" textShadow={true} titleColor="white"/>
      <ContainerContact>
          <FadeIn delay={0.2}>
            <ContactInformation />
          </FadeIn>
          <FadeIn delay={0.3}>
            <ContactForm />
          </FadeIn>
          <FadeIn delay={0.4}>
            <ContactMap />
          </FadeIn>
      </ContainerContact>
    </>
  );
}

export default Contacto;

// Reutilizamos FadeIn para animaciones suaves
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
);

// Contenedor estilizado
const ContainerContact = styled.div`
  background: var(--background-color);
`;
