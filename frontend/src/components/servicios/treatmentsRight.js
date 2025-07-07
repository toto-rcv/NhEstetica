import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ReservaTurnoModal from "../ReservaTurnoModal";

const TreatmentsRight = ({
    link, image, title, description, price,
    showLine = false, customButtonText, customButtonLink,
    detailsLink, tratamiento
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageClick = () => {
        handleClick();
        if (customButtonText === "Saca turno" && tratamiento) {
            setShowModal(true);
        } else if (customButtonLink) {
            window.location.href = customButtonLink;
        } else {
            window.location.href = `/servicios/${link}`;
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (customButtonText === "Saca turno" && tratamiento) {
            setShowModal(true);
        } else if (customButtonLink) {
            window.location.href = customButtonLink;
        } else {
            window.location.href = `/servicios/${link}`;
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleReservaSuccess = () => {
        setShowSuccessModal(true);
        setShowModal(false);
    };

    return (
        <Container>
            <ContentWrapper>
                <ImageContainer>
                    <Image src={image} alt={title} onClick={handleImageClick} />
                </ImageContainer>
                <TextContent>
                    <Title showLine={showLine}>{title}</Title>
                    <Description>{description}</Description>
                    <ActionsContainer>
                        <Price>{price}</Price>
                        <ButtonRow>
                            {detailsLink && (
                                <DetailsButton to={detailsLink} onClick={handleClick}>
                                    VER DETALLES
                                </DetailsButton>
                            )}
                            {customButtonText === "Saca turno" && tratamiento && (
                                <SacaTurnoButton onClick={handleButtonClick}>
                                    SACA TURNO
                                </SacaTurnoButton>
                            )}
                            {customButtonText && customButtonText !== "Saca turno" && (
                                <DetailsButton to={`/servicios/${link}`} onClick={handleClick}>
                                    {customButtonText.toUpperCase()}
                                </DetailsButton>
                            )}
                        </ButtonRow>
                    </ActionsContainer>
                </TextContent>
            </ContentWrapper>

            {tratamiento && (
                <ReservaTurnoModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    tratamiento={tratamiento}
                    onSuccess={handleReservaSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessOverlay onClick={() => setShowSuccessModal(false)}>
                    <SuccessModal onClick={(e) => e.stopPropagation()}>
                        <h2>¡Turno reservado exitosamente!</h2>
                        <p>Te contactaremos pronto para confirmar tu cita.</p>
                        <CloseSuccessButton onClick={() => setShowSuccessModal(false)}>Cerrar</CloseSuccessButton>
                    </SuccessModal>
                </SuccessOverlay>
            )}
        </Container>
    );
};

export default TreatmentsRight;

const Container = styled.div`
    width: 100%;
    padding: 2rem 0;
`;

const ContentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    gap: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        padding: 0 1rem;
    }
`;

const TextContent = styled.div`
    flex: 1;
    max-width: 600px;
    text-align: center;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const Title = styled.h2`
    font-size: 2rem;
    color: var(--terciary-color);
    margin-bottom: 1rem;
    font-weight: 600;
    font-family: 'Saira', sans-serif;
    position: relative;
    padding-bottom: 1rem;

    ${props => props.showLine && `
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 4px;
            background: linear-gradient(
                to right,
                transparent 0%,
                var(--primary-color) 15%,
                var(--primary-color) 85%,
                transparent 100%
            );
            border-radius: 2px;
        }
    `}

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Description = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-color);
    margin-bottom: 1.5rem;
    text-align: left;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        text-align: center;
    }
`;

const ActionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin: 2.5rem 0;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
`;

const Price = styled.div`
    font-size: 2.2rem;
    color: var(--primary-color-dark);
    font-weight: 700;
    font-family: 'Saira', sans-serif;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;
const DetailsButton = styled(Link)`
    font-size: 1rem;
    color: var(--terciary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0.8rem 1.8rem;
    border: 2px solid var(--terciary-color);
    border-radius: 25px;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    background: transparent;
    z-index: 1;
    text-align: center;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--terciary-color);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: -1;
    }

    &:hover {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

        &::before {
            transform: translateX(0);
        }
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.7rem 1.5rem;
    }
`;

const ImageContainer = styled.div`
    flex: 1;
    max-width: 500px;
    height: 300px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.2); /* <- el overlay sutil */
        pointer-events: none;
        z-index: 1;
        transition: background 0.3s ease;
    }

    @media (max-width: 768px) {
        max-width: 100%;
        height: 250px;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    cursor: pointer;
    position: relative;
    z-index: 0;

    &:hover {
        transform: scale(1.05);
    }
`;



const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SuccessModal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.3s ease;

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  h2 {
    color: var(--primary-color-dark);
    margin-bottom: 1rem;
  }

  p {
    color: #333;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const CloseSuccessButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--primary-color-dark);
  }
`;

const SacaTurnoButton = styled.button`
  font-size: 1rem;
  color: var(--terciary-color);
  font-family: var(--text-font);
  font-weight: 600;
  padding: 0.8rem 1.8rem;
  border: 2px solid var(--terciary-color);
  border-radius: 25px;
  background: transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--terciary-color);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

    &::before {
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem 1.5rem;
  }
`;