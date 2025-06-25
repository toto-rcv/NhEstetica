import React from 'react';
import styled from 'styled-components';
import Slider from "react-slick";


const professionals = [
  {
    name: 'Natalia',
    image: '/team/Natalia.png',
  },
  {
    name: 'Rocío',
    image: '/team/rocio.png',
  },
  {
    name: 'Florencia',
    image: '/team/florencia.png',
  },
  {
    name: 'Epifanía',
    image: '/team/epifania.png',
  },
  {
    name: 'Mariana',
    image: '/team/mariana.png',
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 1 }
    }
  ]
};


function Team() {
  return (
    <Wrapper>
      <Mujer2 src="/aboutUs/image(3).png" alt="Mujer de Frente" />
      <Mujer src="/aboutUs/imagenMujer.png" alt="Mujer de Perfil" />
      <TopText>¿Quiénes somos?</TopText>
      <Heading>NUESTROS PROFESIONALES</Heading>
      <Subheading>Un equipo comprometido con la excelencia médica y el bienestar de cada paciente.</Subheading>
      <SliderContainer>
        <Slider {...settings}>
          {professionals.map((pro, index) => (
            <Card key={index}>
              <ImageCircle>
                <ProfileImage src={pro.image} alt={pro.name} />
              </ImageCircle>
              <Name>{pro.name}</Name>
            </Card>
          ))}
        </Slider>
      </SliderContainer>
    </Wrapper>
  );
}

export default Team;

// Styled-components

const Wrapper = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #fff;
  position: relative;
`;

const TopText = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--terciary-color);
    margin: 0;
    font-family: var(--heading-font),sans-serif;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
`;

const Heading = styled.h2`
    font-size: 2.5rem;
    margin: 0 0 1rem;
    font-family: var(--heading-font);
    transform: skew(-10deg);

    
    @media (max-width: 768px) {
      font-size: 2.3rem;
    }
`;

const Subheading = styled.p`
  font-style: italic;
  color: #555;
  margin-bottom: 3rem;
  
    @media (max-width: 768px) {
      margin-bottom: 1rem;
    }
`;


const Card = styled.div`
  width: 200px;
  text-align: center;
`;

const ImageCircle = styled.div`
  border: 6px solid var(--primary-color);
  border-radius: 50%;
  width: 160px;
  height: 160px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
`;

const Name = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0.5rem 0 0.25rem;
  font-family: "Saira";
`;

const Mujer = styled.img`
    width: 130px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    left: 1%;
    top: 65%;

    @media (max-width: 768px) {
        width: 100px;
        top: 80%;
    }
`;

const Mujer2 = styled.img`
    width: 120px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    right: 2%;
    top: 5%;

    @media (max-width: 768px) {
        width: 95px;
        top: 10px;
        right: 0;
    }
`;

const SliderContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;

  .slick-slide {
    display: flex;
    justify-content: center;
  }

  .slick-dots li button:before {
    color: var(--terciary-color);
  }
`;
