import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background: #fff;
    transition: width 0.3s ease;
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TablasNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/tablas/inicio', label: 'INICIO' },
    { path: '/tablas/caja', label: 'CAJA' },
    { path: '/tablas/clientes', label: 'CLIENTES' },
    { path: '/tablas/ventas', label: 'VENTAS' },
    { path: '/tablas/personal', label: 'PERSONAL' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink
              $active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </NavLink>
          </NavItem>
        ))}
        <LogoutButton onClick={handleLogout}>
          Cerrar Sesión
        </LogoutButton>
      </NavList>
    </NavContainer>
  );
};

export default TablasNavBar; 