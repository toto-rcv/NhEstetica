import styled from "styled-components";
import testimonials from "../../data/testimonials";
import Slider from "react-slick";

function Testimonials() {
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [
      ...Array(fullStars).fill("★"),
      ...(hasHalfStar ? ["☆"] : []),
      ...Array(emptyStars).fill("✩"),
    ];

    return (
      <StarsWrapper>
        {stars.map((star, index) => (
          <Star key={index}>{star}</Star>
        ))}
      </StarsWrapper>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 940,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1390,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <Wrapper>
      <MujerFrente src="images/mujer-frente.png" alt="Mujer de Frente" />
      <MujerPerfil src="images/mujer-perfil.png" alt="Mujer de Perfil" />
      <TopText>
        <Subtitle>¿Qué dicen?</Subtitle>
        <Title>TESTIMONIOS DE NUESTROS CLIENTES</Title>
        <SeeMore
          href="https://www.google.com/maps/place/NH+Estetica/@-27.3670409,-55.90326,17z/data=!4m8!3m7!1s0x9457bfb577360051:0x9876c29b4475f4d1!8m2!3d-27.3670457!4d-55.9006851!9m1!1b1!16s%2Fg%2F12qfvr_23?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
        >
          Ver todas →
        </SeeMore>
      </TopText>

      <StyledSlider {...settings}>
        {testimonials.map((t, index) => (
          <SlideWrapper key={index}>
            <Card>
              <Text>
              {t.text.split(" ").slice(0, 50).join(" ") + (t.text.split(" ").length > 50 ? "..." : "")}
            </Text>
              <StarRating rating={t.rating} />
              <UserInfo>
                <Avatar src={t.image} />
                <UserDetails>
                  <Name>{t.name}</Name>
                  <Source>{t.source}</Source>
                </UserDetails>
                <QuoteMark>❞</QuoteMark>
              </UserInfo>
            </Card>
          </SlideWrapper>
        ))}
      </StyledSlider>
    </Wrapper>
  );
}

export default Testimonials;

const Wrapper = styled.section`
  padding: 120px 20px;
  background-color: var(--background-overlay);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

      @media (max-width: 768px) {
        padding: 90px 20px;
    }

`;

const TopText = styled.div`
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;

      @media (max-width: 768px) {
        gap: 20px;
    }

  
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: var(--terciary-color);
  margin: 0 !important;
  font-family: var(--heading-font), sans-serif;

      @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--tertiary-color);
  margin: 0 !important;
  font-family: var(--heading-font), sans-serif;
  transform: skew(-10deg);

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 2px solid var(--primary-color);
  padding: 25px;
  max-width: 390px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    max-width: 270px;
  }
`;

const Text = styled.p`
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  flex: 1;
  text-align: left;
  margin-left: 10px;
`;

const Name = styled.div`
  font-weight: bold;
`;

const Source = styled.div`
  font-size: 0.8rem;
  color: gray;
  margin-top: 5px;
`;

const QuoteMark = styled.div`
  font-size: 4.5rem;
  color: var(--secondary-color);
  top: 8px;
  position: relative;
`;

const SeeMore = styled.a`
  font-size: 0.9rem;
  color: var(--terciary-color);
  margin-top: 0.3rem;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  max-width: 1588px;
  margin: 0 30px;

  .slick-track {
    display: flex !important;
    align-items: stretch;
  }

  .slick-slide {
    padding: 0 15px;
    box-sizing: border-box;
  }

  .slick-slide > div {
    height: 100%;
  }

  .slick-dots {
    bottom: -60px;
  }

  .slick-dots li button:before {
    color: var(--terciary-color);
    font-size: 12px;
  }

  @media (max-width: 768px) {
  .slick-slide {
      padding: 0 15px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
  }
}
`;

const StarsWrapper = styled.div`
  margin: 20px 0 10px;
  display: flex;
  justify-content: center;
`;

const Star = styled.span`
  font-size: 1.4rem;
  color: gold;
  margin: 0 2px;
`;

const MujerFrente = styled.img`
    width: 160px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    right: 2%;
    top: 5%;
    filter: drop-shadow(5px 5px 10px rgba(224, 117, 212, 1));

    @media (max-width: 768px) {
        width: 130px;
        top: 0;
        right: 0;
    }
`;

const MujerPerfil = styled.img`
    width: 120px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    left: 1%;
    filter: drop-shadow(5px 5px 10px rgba(224, 117, 212, 1));
    top: 70%;

      @media (max-width: 768px) {
        width: 100px;
        top: 80%;
    }
`;

const SlideWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: stretch;
`;