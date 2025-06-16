import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TreatmentsLeft = ({ link, image, title, description, price, promoLink, showLine = false, customButtonText, customButtonLink }) => {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageClick = () => {
        handleClick();
        if (customButtonLink) {
            window.location.href = customButtonLink;
        } else {
            window.location.href = `/servicios/${link}`;
        }
    };

    return (
        <Container>
            <ContentWrapper>
                <TextContent>
                    <Title showLine={showLine}>{title}</Title>
                    <Description>{description}</Description>
                    <PriceContainer>
                        <Price>{price}</Price>
                        {promoLink && (
                            <PromoLink href={promoLink} target="_blank" rel="noopener noreferrer">¡CONSULTA LAS PROMOS!</PromoLink>
                        )}
                    </PriceContainer>
                    <MobileButton 
                        to={customButtonLink || `/servicios/${link}`} 
                        onClick={handleClick}
                        as={customButtonLink ? 'a' : Link}
                        href={customButtonLink}
                        target={customButtonLink ? "_blank" : undefined}
                        rel={customButtonLink ? "noopener noreferrer" : undefined}
                    >
                        {customButtonText || "Ver más"}
                    </MobileButton>
                </TextContent>
                <ImageContainer>
                    <Image src={image} alt={title} onClick={handleImageClick} />
                    <ButtonOverlay>
                        <StyledLink 
                            to={customButtonLink || `/servicios/${link}`} 
                            onClick={handleClick}
                            as={customButtonLink ? 'a' : Link}
                            href={customButtonLink}
                            target={customButtonLink ? "_blank" : undefined}
                            rel={customButtonLink ? "noopener noreferrer" : undefined}
                        >
                            {customButtonText || "Ver más"}
                        </StyledLink>
                    </ButtonOverlay>
                </ImageContainer>
            </ContentWrapper>
        </Container>
    );
};

export default TreatmentsLeft;

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
        flex-direction: column-reverse;
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
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        padding: 0 1rem;
    }
`;

const Price = styled.div`
    font-size: 1.8rem;
    color: var(--terciary-color);
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
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0.8rem 1.8rem;
    border: 2px solid var(--primary-color);
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
        background: var(--primary-color);
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
        width: auto;
        text-align: center;
        margin-top: 0.5rem;
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

    &:hover {
        transform: scale(1.05);
    }
`;

const ButtonOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    opacity: 1;
    transition: opacity 0.3s ease;

    @media (max-width: 768px) {
        display: none;
    }
`;

const StyledLink = styled(Link)`
    display: inline-block;
    padding: 0.8rem 2rem;
    background-color: transparent;
    color: white;
    text-decoration: none;
    border: 2px solid white;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
        display: inline-block;
        padding: 0.8rem 2rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        margin-top: 1rem;
    }
`;

const MobileButton = styled(Link)`
    display: none;
    padding: 0.8rem 2rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin: 1rem auto;
    text-align: center;

    &:hover {
        background-color: var(--primary-color-dark);
    }

    @media (max-width: 768px) {
        display: inline-block;
    }
`;