import React from 'react';
import styled from 'styled-components';

function ExperienceQuote() {
  return (
    <QuoteContainer>
      <QuoteText>
        “During my 6 years of experience in the beauty industry, I’ve worked with many types of
        skin concerns, ranging from severe acne and congestion, ultra sensitive skin, rosacea, and
        melasma just to name a few. By treating these various types of skin conditions on a daily
        basis.”
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
`;
