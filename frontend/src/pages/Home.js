import React from 'react';
import styled from 'styled-components';
import Slider from '../components/home/slider';
import AboutUs from '../components/home/about-us';
import Services from '../components/home/services';
import { motion } from 'framer-motion';

function Inicio() {
  return (
    <>
      <FadeIn>
        <Slider />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Container>
          <FadeIn delay={0.2}>
            <AboutUs />
          </FadeIn>
          <FadeIn delay={0.4}>
            <Services />
          </FadeIn>
        </Container>
      </FadeIn>
    </>
  );
}

export default Inicio;

const Container = styled.div`
  background: linear-gradient(
    180deg,
    rgb(246, 216, 242) 20%,
    #ffffff 86%
  );
`;

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
