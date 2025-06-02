import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TreatmentsRight = ({ link, image, title, description }) => {
    return (
        <Container>
            <ContentWrapper>
                <ImageContainer>
                    <Image src={image} alt={title} />
                    <ButtonOverlay>
                        <StyledLink to={`/${link}`}>Ver más</StyledLink>
                    </ButtonOverlay>
                </ImageContainer>
                <TextContent>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                    <MobileButton to={`/${link}`}>Ver más</MobileButton>
                </TextContent>
            </ContentWrapper>
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

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Description = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-color);
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
        font-size: 0.9rem;
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
    margin-top: 1rem;

    &:hover {
        background-color: var(--primary-color-dark);
    }

    @media (max-width: 768px) {
        display: inline-block;
    }
`;