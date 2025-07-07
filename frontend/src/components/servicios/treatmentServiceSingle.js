import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import ReservaTurnoModal from "../ReservaTurnoModal";

const TreatmentService = ({ 
    // Propiedades básicas
    image, 
    title, 
    description, 
    price, 
    link,
    
    // Configuración de layout
    imagePosition = "left", // "left" o "right"
    
    // Enlaces y botones
    promoLink,
    customButtonText = "Ver más",
    customButtonLink,
    
    // Estilos opcionales
    showLine = false,
    showPrice = true,
    showPromo = true,
    
    // Clases CSS personalizadas
    className,
    
    // Callbacks
    onImageClick,
    onButtonClick,
    
    // Datos del tratamiento para el modal
    tratamiento
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (onButtonClick) onButtonClick();
    };

    const handleImageClick = () => {
        handleClick();
        if (onImageClick) {
            onImageClick();
        } else if (customButtonText === "Reservá tu turno" && tratamiento) {
            setShowModal(true);
        } else if (customButtonLink) {
            window.location.href = customButtonLink;
        } else if (link) {
            window.location.href = `/servicios/${link}`;
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (customButtonText === "Reservá tu turno" && tratamiento) {
            setShowModal(true);
        } else if (customButtonLink) {
            window.location.href = customButtonLink;
        } else if (link) {
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

    const renderImage = () => (
        <ImageContainer>
            <Image src={image} alt={title} onClick={handleImageClick} />
            <ButtonOverlay>
                <StyledButton onClick={handleButtonClick}>
                    RESERVÁ TU TURNO
                </StyledButton>
            </ButtonOverlay>
        </ImageContainer>
    );

    const renderText = () => (
        <TextContent>
            <Title showLine={showLine}>{title}</Title>
            <Description>{description}</Description>
            {showPrice && (
                <PriceContainer>
                    <Price>{price}</Price>
                    {showPromo && promoLink && (
                        <PromoLink href={promoLink} target="_blank" rel="noopener noreferrer">
                            ¡CONSULTA LAS PROMOS!
                        </PromoLink>
                    )}
                </PriceContainer>
            )}
            <ReserveButton onClick={handleButtonClick}>
                RESERVÁ TU TURNO
            </ReserveButton>
            <MobileButton onClick={handleButtonClick}>
                RESERVÁ TU TURNO
            </MobileButton>
        </TextContent>
    );

    return (
        <Container className={className}>
            <ContentWrapper imagePosition={imagePosition}>
                {imagePosition === "left" ? (
                    <>
                        {renderImage()}
                        {renderText()}
                    </>
                ) : (
                    <>
                        {renderText()}
                        {renderImage()}
                    </>
                )}
            </ContentWrapper>

            {tratamiento && showModal && createPortal(
                <ReservaTurnoModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    tratamiento={tratamiento}
                    onSuccess={handleReservaSuccess}
                />,
                document.body
            )}

            {showSuccessModal && createPortal(
                <SuccessOverlay onClick={() => setShowSuccessModal(false)}>
                    <SuccessModal onClick={(e) => e.stopPropagation()}>
                        <h2>¡Turno reservado exitosamente!</h2>
                        <p>Te contactaremos pronto para confirmar tu cita.</p>
                        <CloseSuccessButton onClick={() => setShowSuccessModal(false)}>
                            Cerrar
                        </CloseSuccessButton>
                    </SuccessModal>
                </SuccessOverlay>,
                document.body
            )}
        </Container>
    );
};

export default TreatmentService;

// Styled Components
const Container = styled.div`
    width: 100%;
    padding: 3rem 0;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin: 2rem 0;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 20px 20px 0 0;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 0 0 20px 20px;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        padding: 2rem 0;
        margin: 1rem 0;
        border-radius: 15px;
        
        &::before {
            border-radius: 15px 15px 0 0;
        }

        &::after {
            border-radius: 0 0 15px 15px;
        }
        
        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
        }
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 3rem;
    gap: 3rem;

    @media (max-width: 768px) {
        flex-direction: ${props => props.imagePosition === "left" ? "column-reverse" : "column"};
        text-align: center;
        padding: 0 1.5rem;
        gap: 2rem;
    }

    @media (max-width: 480px) {
        padding: 0 1rem;
        gap: 1.5rem;
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
        text-align: center;
    }
`;

const Description = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-color);
    margin-bottom: 1.5rem;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        text-align: center;
    }
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
    margin: 2.5rem 0;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

const Price = styled.div`
    font-size: 1.8rem;
    color: var(--primary-color-dark);
    font-weight: 700;
    font-family: 'Saira', sans-serif;
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-block;
    position: relative;
    padding: 0.5rem 0;
    text-align: center;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--secondary-color);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    &:hover {
        transform: translateY(-2px);
        color: var(--secondary-color);

        &::after {
            transform: scaleX(1);
        }
    }

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const PromoLink = styled.a`
    font-size: 1rem;
    color: var(--terciary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0.8rem 1.8rem;
    border: 2px solid var(--terciary-color);
    border-radius: 25px;
    background: transparent;
    cursor: pointer;
    display: inline-block;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: var(--terciary-color);
        transition: left 0.3s ease;
        z-index: -1;
    }

    &:hover {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

        &::before {
            left: 0;
        }
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.6rem 1.4rem;
    }
`;

const ImageContainer = styled.div`
    flex: 0 0 400px;
    height: 400px;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    }

    @media (max-width: 768px) {
        flex: 0 0 auto;
        width: 100%;
        height: 300px;
        margin: 1rem 0;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    ${ImageContainer}:hover & {
        transform: scale(1.05);
    }
`;

const ButtonOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    ${ImageContainer}:hover & {
        opacity: 1;
    }
`;

const StyledButton = styled.button`
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 2px solid var(--primary-color);

    &:hover {
        background: var(--background-color);
        color: var(--primary-color-dark);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        padding: 0.8rem 1.6rem;
        font-size: 0.9rem;
    }
`;

const MobileButton = styled.button`
    display: none;
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 2px solid var(--primary-color);
    margin-top: 1.5rem;

    &:hover {
        background: transparent;
        color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        display: inline-block;
        padding: 0.8rem 1.6rem;
        font-size: 0.9rem;
    }
`;

const ReserveButton = styled.button`
    display: inline-block;
    font-size: 1rem;
    color: var(--terciary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0.8rem 1.8rem;
    border: 2px solid var(--terciary-color);
    border-radius: 25px;
    background: transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 1.5rem;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: var(--terciary-color);
        transition: left 0.3s ease;
        z-index: -1;
    }

    &:hover {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

        &::before {
            left: 0;
        }
    }

    @media (max-width: 768px) {
        display: none;
        font-size: 0.9rem;
        padding: 0.6rem 1.4rem;
    }
`;

const SuccessOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
`;

const SuccessModal = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    text-align: center;

    h2 {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }

    p {
        font-size: 1rem;
        color: var(--text-color);
        margin-bottom: 2rem;
    }
`;

const CloseSuccessButton = styled.button`
    background: var(--primary-color);
    color: white;
    padding: 0.8rem 1.6rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 2px solid var(--primary-color);
    cursor: pointer;

    &:hover {
        background: transparent;
        color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
`;
