import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardNavigation from '../DashboardNavigation';
import { Shield } from 'lucide-react';

describe('DashboardNavigation', () => {
    const mockOnLogout = jest.fn();
    
    const defaultProps = {
        title: 'Dashboard',
        icon: Shield,
        iconColor: 'text-blue-600',
        welcomeText: 'Welcome',
        userName: 'John Doe',
        onLogout: mockOnLogout
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders navigation with all elements', () => {
        render(<DashboardNavigation {...defaultProps} />);
        
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
        expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('displays fallback when userName is undefined', () => {
        render(<DashboardNavigation {...defaultProps} userName={undefined} />);
        
        expect(screen.getByText('Welcome, User')).toBeInTheDocument();
    });

    test('calls onLogout when logout button is clicked', () => {
        render(<DashboardNavigation {...defaultProps} />);
        
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);
        
        expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    test('renders with different props', () => {
        const customProps = {
        ...defaultProps,
        title: 'Admin Panel',
        welcomeText: 'Hello',
        userName: 'Jane Smith'
        };

        render(<DashboardNavigation {...customProps} />);
        
        expect(screen.getByRole('heading', { name: 'Admin Panel' })).toBeInTheDocument();
        expect(screen.getByText('Hello, Jane Smith')).toBeInTheDocument();
    });

    test('has correct accessibility attributes', () => {
        render(<DashboardNavigation {...defaultProps} />);
        
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        expect(logoutButton).toHaveAttribute('aria-label', 'Logout');
    });
});