import React from 'react';
import styled from 'styled-components';

function ExperienceQuote() {
  return (
    <QuoteContainer>
      <QuoteText>
        “Durante mis 6 años de experiencia en la industria de la belleza, he trabajado con diversos problemas de la piel,
         desde acné severo y congestión, piel ultrasensible, rosácea y melasma, por nombrar solo algunos.
          Tratando estos diversos tipos de afecciones cutáneas a diario.”
      </QuoteText>
    </QuoteContainer>
  );
}

export default ExperienceQuote;

// Styled Components
const QuoteContainer = styled.div`
  background: linear-gradient(
    90deg,
    rgba(224, 117, 212, 0.3) 0%,
    rgba(255, 121,177, 0.3) 25%,
    var(--secondary-color) 75%,
    rgba(224, 117, 212, 0.3) 100%
  );
  padding: 6rem 2rem;
  text-align: center;

    @media (max-width: 768px) {
      padding: 4rem 2rem;
    }  
`;

const QuoteText = styled.p`
  font-style: italic;
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.7;
  color: var(--background-dark);
  margin: auto;

  @media (min-width: 990px) {
    max-width: 65vw;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.4;
  }
`;
