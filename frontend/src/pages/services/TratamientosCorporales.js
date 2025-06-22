import React from 'react'
import styled from 'styled-components';
import Breadcrumb from "../../components/breadcrumb";
import TreatmentsLeft from '../../components/servicios/treatmentsLeft';
import TreatmentsRight from '../../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';

function TratamientosCorporales() {
    return (
        <>
            <Breadcrumb
                image="/servicios/TratamientoCorporal.jpg"
                title="Tratamientos Corporales"
                position="left"
                titleColor="#F5F5F5"
            />
            <BackgroundService>
                <FadeIn delay={0.2}>
                    <Image src="/servicios/MujerLineal.png" alt="Servicios" className="mujer-lineal" />
                    <TreatmentsLeft
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/L_Lipo.jpg"
                        title="L LIPO"
                        showLine={true}
                        description="Tratamiento no invasivo que combina ultrasonido y radiofrecuencia para reducir la grasa localizada y modelar la figura. Ideal para tratar áreas específicas como abdomen, flancos, muslos y brazos. Ayuda a eliminar la grasa subcutánea y mejorar la apariencia de la piel."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/lLipo"
                    />
                </FadeIn>
                <FadeIn delay={0.3}>
                    <TreatmentsRight
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Mio_Up.jpg"
                        title="MIO UP"
                        showLine={true}
                        description="Tratamiento de electroestimulación muscular que tonifica y fortalece los músculos sin esfuerzo. Perfecto para mejorar la firmeza muscular, reducir la flacidez y modelar la figura. Ideal para quienes buscan resultados similares al ejercicio físico de manera pasiva."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/mioUp"
                    />
                </FadeIn>
                <FadeIn delay={0.4}>
                <ImageEspalda src="/servicios/mujerLinealEspalda.png" alt="Servicios" style={{ position: 'absolute', top: '5rem', left: '5px', width: '150px', height: 'auto' }} />
                    
                    <TreatmentsLeft
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/cavix.webp"
                        title="CAVIX"
                        showLine={true}
                        description="Tratamiento de cavitación que utiliza ultrasonidos de baja frecuencia para romper las células grasas. Efectivo para reducir la grasa localizada y mejorar la circulación. Ideal para tratar áreas específicas y complementar otros tratamientos corporales."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/cavix"
                    />
                </FadeIn>
                <FadeIn delay={0.5}>
                    <TreatmentsRight
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Mesoterapia.jpg"
                        title="MESOTERAPIA CORPORAL"
                        showLine={true}
                        description="Tratamiento que consiste en microinyecciones de sustancias activas en la capa media de la piel. Ayuda a reducir la grasa localizada, mejorar la circulación y la apariencia de la piel. Ideal para tratar celulitis y modelar la figura."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/mesoterapiaCorporal"
                    />
                </FadeIn>
                <FadeIn delay={0.6}>
                <ImageEspalda src="/servicios/MujerSombrero.png" alt="Servicios" style={{ position: 'absolute', top: '20rem', right: '5px', width: '150px', height: 'auto' }} />
                    <TreatmentsLeft
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Mesoterapia_Vit_C.jpg"
                        title="MESOTERAPIA VC"
                        showLine={true}
                        description="Tratamiento específico con microinyecciones de vitaminas y minerales para mejorar la salud de la piel y el cabello. Ayuda a fortalecer el folículo piloso, mejorar la circulación y promover el crecimiento del cabello. Ideal para tratar la caída del cabello y mejorar su calidad."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/mesoterapiaVc"
                    />
                </FadeIn>
                <FadeIn delay={0.7}>
                    <TreatmentsRight
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Vela_Velver_Max.jpg"
                        title="VELA VELVET MAX"
                        showLine={true}
                        description="Tratamiento de última generación que combina radiofrecuencia, infrarrojos y vacumterapia. Efectivo para reducir la grasa localizada, mejorar la circulación y tonificar la piel. Ideal para modelar la figura y tratar la celulitis."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/velaVelvetMax"
                    />
                </FadeIn>
                <FadeIn delay={0.8}>
                <Image src="/servicios/flor.png" alt="Servicios" className="floral-image" style={{ position: 'absolute', top: '20rem', left: '5px', width: '150px', height: 'auto' }} />
                    <TreatmentsLeft
                        link="TratamientosCorporales"
                        image="/servicios/TratamientoCorporal.jpg"
                        title="RADIOFRECUENCIA"
                        showLine={true}
                        description="Tratamiento que utiliza ondas electromagnéticas para calentar las capas profundas de la piel. Ayuda a estimular la producción de colágeno, mejorar la firmeza y reducir la flacidez. Ideal para rejuvenecer la piel y modelar la figura."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/radiofrecuenciaCorporal"
                    />
                </FadeIn>
                <FadeIn delay={0.9}>
                    <TreatmentsRight
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Vacumterapia.jpg"
                        title="VACUM"
                        showLine={true}
                        description="Tratamiento de vacumterapia que utiliza succión controlada para mejorar la circulación y reducir la grasa localizada. Efectivo para tratar la celulitis y modelar la figura. Ideal para complementar otros tratamientos corporales."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/vacumCorporal"
                    />
                </FadeIn>
                <FadeIn delay={1.0}>
                <Image src="/servicios/MujerConCopa.png" alt="Servicios" className="mujer-lineal" />
                    <TreatmentsLeft
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Presoterapia.jpg"
                        title="BOTAS DE PRESOTERAPIA"
                        showLine={true}
                        description="Tratamiento que utiliza presión de aire controlada para mejorar la circulación y reducir la retención de líquidos. Ideal para aliviar la pesadez en las piernas, reducir la hinchazón y mejorar la apariencia de la piel. Perfecto para complementar tratamientos anticelulíticos."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/botasDePresoterapia"
                    />
                </FadeIn>
                <FadeIn delay={1.1}>
                    <TreatmentsRight
                        link="TratamientosCorporales"
                        image="/servicios/Tratamientos_Corporales/Meso_Capilar.jpg"
                        title="MESO CAPILAR"
                        showLine={true}
                        description="Tratamiento específico para el cuero cabelludo que utiliza microinyecciones de nutrientes y vitaminas. Ayuda a fortalecer el folículo piloso, mejorar la circulación y promover el crecimiento del cabello. Ideal para tratar la caída del cabello y mejorar su calidad."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                        detailsLink="/servicios/mesoCapilar"
                    />
                </FadeIn>
            </BackgroundService>
        </>
    )
}

export default TratamientosCorporales

const BackgroundService = styled.div`
    background: var(--background-color);
    padding: 4rem 0;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 2rem 0;
    }
`;

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
    style={{ marginBottom: '2rem', position: 'relative' }}
  >
    {children}
    <div style={{ borderBottom: '1px solid #ccc', marginTop: '2rem', width: '75%', marginLeft: 'auto', marginRight: 'auto' }} />
  </motion.div>
);

const Image = styled.img`
    position: absolute;
    width: 140px;
    height: auto;
    z-index: 1;
    display: none;

    &.mujer-lineal {
        top: 87%;
        right: 22px;
    }

    &.floral-image {
        top: 120rem;
        right: 5px;
    }

    &.hat-image {
        top: 150rem;
        left: 5px;
    }

    @media (min-width: 1500px) {
        display: block;
    }
`;

const ImageEspalda = styled.img`
    position: absolute;
    width: 150px;
    height: auto;
    top: 91rem;
    z-index: 1;
    display: none;

    @media (min-width: 1500px) {
        display: block;
    }
`;  