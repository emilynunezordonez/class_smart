import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserPage } from '../../../src/pages/users/UserPage';
import { useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

jest.mock('../../../src/components/users/Navigation', () => ({
  Navigation: () => <div data-testid="navigation">Mocked Navigation</div>
}));

jest.mock('../../../src/components/users/UserList', () => ({
  UserList: ({ searchCriteria, searchValue }) => (
    <div data-testid="user-list">
      criteria: {searchCriteria}, value: {searchValue}
    </div>
  )
}));

describe('UserPage', () => {
  it('renderiza Navigation y UserList con parámetros de URL', () => {
    useParams.mockReturnValue({
      criteria: 'email',
      value: 'john@example.com'
    });

    render(<UserPage />);
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('user-list')).toHaveTextContent('criteria: email, value: john@example.com');
  });

  it('renderiza UserList con valores undefined si no hay parámetros', () => {
    useParams.mockReturnValue({});

    render(<UserPage />);
    expect(screen.getByTestId('user-list')).toHaveTextContent('criteria: , value:');
  });
});
