import React from 'react'
import styled from 'styled-components';
import Breadcrumb from "../../components/breadcrumb";
import TreatmentsLeft from '../../components/servicios/treatmentsLeft';
import TreatmentsRight from '../../components/servicios/treatmentsRight';
import { motion } from 'framer-motion';

function TratamientosFaciales() {
    return (
        <>
            <Breadcrumb
                image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                title="Tratamientos Faciales"
                position="left"
                titleColor="#F5F5F5"
            />
            <BackgroundService>
                <FadeIn delay={0.2}>
                    <Image src="/servicios/MujerLineal.png" alt="Servicios" className="mujer-lineal" />
                    <TreatmentsLeft
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="ELECTROPORACIÓN"
                        showLine={true}
                        description="Tratamiento facial avanzado que utiliza pulsos eléctricos para abrir temporalmente los poros y permitir una mejor penetración de los principios activos. Ideal para hidratación profunda, rejuvenecimiento y tratamiento de arrugas finas."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>
                
                <FadeIn delay={0.3}>
                    <TreatmentsRight
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="DERMAPLANING"
                        showLine={true}
                        description="Tratamiento de exfoliación física que elimina el vello facial y las células muertas de la piel. Mejora la textura, reduce las líneas finas y permite una mejor penetración de los productos. Resulta en una piel más suave y radiante."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={0.4}>
                    <ImageEspalda src="/servicios/mujerLinealEspalda.png" alt="Servicios" style={{ position: 'absolute', top: '5rem', left: '5px', width: '150px', height: 'auto' }} />
                    <TreatmentsLeft
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="DERMAPEN"
                        showLine={true}
                        description="Tratamiento de microagujas que estimula la producción natural de colágeno y elastina. Ideal para reducir arrugas, cicatrices y mejorar la textura de la piel. Promueve la regeneración celular y el rejuvenecimiento facial."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={0.5}>
                    <TreatmentsRight
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="EXOSOMAS"
                        showLine={true}
                        description="Tratamiento regenerativo que utiliza vesículas extracelulares para estimular la renovación celular. Mejora la elasticidad, reduce las arrugas y promueve una piel más joven y saludable. Ideal para rejuvenecimiento facial."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={0.6}>
                    <Image src="/servicios/flor.png" alt="Servicios" className="floral-image" style={{ position: 'absolute', top: '20rem', right: '5px', width: '150px', height: 'auto' }} />
                    <TreatmentsLeft
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="RADIOFRECUENCIA"
                        showLine={true}
                        description="Tratamiento que utiliza ondas electromagnéticas para estimular la producción de colágeno y elastina. Efectivo para tensar la piel, reducir arrugas y mejorar la firmeza facial. Ideal para rejuvenecimiento no invasivo."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={0.7}>
                    <TreatmentsRight
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="HYDRAFACIAL"
                        showLine={true}
                        description="Tratamiento facial avanzado que combina limpieza profunda, exfoliación, extracción, hidratación y antioxidantes. Mejora la textura, reduce las líneas finas y proporciona una piel más radiante y saludable."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={0.8}>
                    <ImageEspalda src="/servicios/MujerSombrero.png" alt="Servicios" style={{ position: 'absolute', top: '20rem', left: '5px', width: '150px', height: 'auto' }} />
                    <TreatmentsLeft
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="LAMINADO"
                        showLine={true}
                        description="Tratamiento que combina diferentes técnicas para mejorar la apariencia de la piel. Incluye limpieza profunda, exfoliación y aplicación de productos específicos para lograr una piel más suave, luminosa y rejuvenecida."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={0.9}>
                    <TreatmentsRight
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="PERFILADO"
                        showLine={true}
                        description="Tratamiento que define y mejora los contornos faciales. Combina técnicas de masaje y productos específicos para tonificar y reafirmar la piel. Ideal para mejorar la definición del rostro y reducir la flacidez."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>

                <FadeIn delay={1.0}>
                    <Image src="/servicios/MujerConCopa.png" alt="Servicios" className="MujerConCopa" />
                    <TreatmentsLeft
                        link="TratamientosFaciales"
                        image="/servicios/Tratamiento_Facial/TratamientoFaciales.jpg"
                        title="VACUM"
                        showLine={true}
                        description="Tratamiento que utiliza succión controlada para mejorar la circulación y la oxigenación de la piel. Efectivo para reducir la hinchazón, mejorar la textura y promover la regeneración celular. Ideal para complementar otros tratamientos faciales."
                        price="$10.000"
                        promoLink="https://wa.me/5491168520606"
                        customButtonText="Saca turno"
                        customButtonLink="https://wa.me/5491168520606"
                    />
                </FadeIn>
            </BackgroundService>
        </>
    )
}

export default TratamientosFaciales

const BackgroundService = styled.div`
    background: var(--background-color);
    padding: 4rem 0;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 2rem 0;
    }
`;

const FadeIn = styled(motion.div)`
    margin-bottom: 2rem;
    position: relative;

    &::after {
        content: '';
        display: block;
        border-bottom: 1px solid #ccc;
        width: 75%;
        margin: 2rem auto 0;
    }

    @media (max-width: 768px) {
        margin-bottom: 1rem;
        
        &::after {
            width: 90%;
            margin: 1rem auto 0;
        }
    }
`;

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

    &.MujerConCopa{
     top: 20%;
        right: 22px;
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

