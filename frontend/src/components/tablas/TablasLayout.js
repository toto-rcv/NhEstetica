import React from 'react';
import styled from 'styled-components';
import TablasNavBar from './TablasNavBar';

const TablasLayout = ({ children, title }) => {
  return (
    <LayoutContainer>
      <TablasNavBar />
      <MainContent>
        <PageTitle>{title}</PageTitle>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default TablasLayout; 

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  font-family: "Raleway";
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 1rem;
`;

const PageTitle = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;