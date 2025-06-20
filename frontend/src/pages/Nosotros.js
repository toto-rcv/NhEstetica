import React from 'react'
import AboutUs from '../components/home/about-us';
import Quote from '../components/about/quote';
import Achievements from '../components/about/achievements';
import Gallery from '../components/about/gallery';
import Team from '../components/about/team';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Breadcrumb from "../components/breadcrumb";

function Nosotros() {
  return (
    <>
      <Breadcrumb image="/breadcrumbs/nosotros.jpg" title="Sobre Nosotros" titleColor="white" textShadow={true}/>
      <ContainerAbout>
        <FadeIn delay={0.2}>
          <AboutUs />
        </FadeIn>
        <FadeIn delay={0.3}>
          <Quote />
        </FadeIn>
        <FadeIn delay={0.4}>
          <Team />
        </FadeIn>
        <FadeIn delay={0.5}>
          <Achievements />
        </FadeIn>
        <FadeIn delay={0.6}>
          <Gallery />
        </FadeIn>
      </ContainerAbout>
    </>
  )
}

export default Nosotros

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

const ContainerAbout = styled.div`
    background: var(--background-color);
);
`