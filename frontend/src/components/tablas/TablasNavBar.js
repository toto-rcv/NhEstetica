import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const TablasNavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/inicio', label: 'Inicio' },
    { path: '/admin/caja', label: 'Caja' },
    { path: '/admin/clientes', label: 'Clientes' },
    { path: '/admin/ventas', label: 'Ventas' },
    { path: '/admin/personal', label: 'Personal' }
  ];

  return (
    <NavContainer>
      <NavList>
        <FrontLink to="/">Ver Web</FrontLink>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink 
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default TablasNavBar; 


const NavContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
  display: block;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const FrontLink = styled(NavLink)`
  background: var(--terciary-color);
`