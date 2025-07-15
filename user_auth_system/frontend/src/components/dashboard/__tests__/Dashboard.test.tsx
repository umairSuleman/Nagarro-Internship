import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { logoutUser } from '../../../store/slices/authSlice';

//Mock the Redux hooks
const mockDispatch = jest.fn();
let mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    userID: 'user123'
};

jest.mock('../../../store/hooks', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: (selector: any) => selector({
        auth: {
        user: mockUser
        }
    })
}));

//Mock the auth slice
jest.mock('../../../store/slices/authSlice', () => ({
    logoutUser: jest.fn(() => ({ type: 'auth/logout' }))
}));

//Mock child components
jest.mock('../DashboardNavigation', () => {
    return function MockDashboardNavigation({ 
        title, 
        userName, 
        onLogout 
    }: { 
        title: string; 
        userName: string | undefined; 
        onLogout: () => void; 
    }) {
        return (
        <div data-testid="dashboard-navigation">
            <h1>{title}</h1>
            <span data-testid="nav-user-name">{userName}</span>
            <button onClick={onLogout} data-testid="logout-button">Logout</button>
        </div>
        );
    };
});

jest.mock('../ProfileSection', () => {
    return function MockProfileSection({ 
        title, 
        user 
    }: { 
        title: string; 
        user: any; 
    }) {
        return (
        <div data-testid="profile-section">
            <h2>{title}</h2>
            <div data-testid="user-name">{user?.name}</div>
            <div data-testid="user-email">{user?.email}</div>
            <div data-testid="user-id">{user?.userID}</div>
        </div>
        );
    };
});

jest.mock('../ProtectedContentSection', () => {
    return function MockProtectedContentSection({ 
        title, 
        description 
    }: { 
        title: string; 
        description: string; 
    }) {
        return (
        <div data-testid="protected-content-section">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
        );
    };
});

describe('Dashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock user to default
        mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        userID: 'user123'
        };
    });

    test('renders dashboard with all components', () => {
        render(<Dashboard />);
        
        expect(screen.getByTestId('dashboard-navigation')).toBeInTheDocument();
        expect(screen.getByTestId('profile-section')).toBeInTheDocument();
        expect(screen.getByTestId('protected-content-section')).toBeInTheDocument();
    });

    test('passes user data to components', () => {
        render(<Dashboard />);
        
        //Check navigation component receives user name
        expect(screen.getByTestId('nav-user-name')).toHaveTextContent('John Doe');
        
        //Check profile section receives user data
        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
        expect(screen.getByTestId('user-id')).toHaveTextContent('user123');
    });

    test('handles logout when logout button is clicked', () => {    
        render(<Dashboard />);
        
        const logoutButton = screen.getByTestId('logout-button');
        fireEvent.click(logoutButton);
        
        expect(mockDispatch).toHaveBeenCalledWith(logoutUser());
    });

    test('renders with null user', () => {
        //Update mock user to null
        mockUser = null as any;
        
        render(<Dashboard />);
        
        expect(screen.getByTestId('dashboard-navigation')).toBeInTheDocument();
        expect(screen.getByTestId('profile-section')).toBeInTheDocument();
        expect(screen.getByTestId('protected-content-section')).toBeInTheDocument();
        
        // Check that components handle null user gracefully
        expect(screen.getByTestId('nav-user-name')).toBeInTheDocument();
        expect(screen.getByTestId('user-name')).toBeInTheDocument();
        expect(screen.getByTestId('user-email')).toBeInTheDocument();
    });

    test('renders correct titles from config', () => {
        render(<Dashboard />);
        
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Profile Information')).toBeInTheDocument();
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('passes correct props to DashboardNavigation', () => {
        render(<Dashboard />);
        
        const navigation = screen.getByTestId('dashboard-navigation');
        expect(navigation).toBeInTheDocument();
        
        //Check that the title is passed correctly
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        
        //Check that logout button is present
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    test('passes correct props to ProfileSection', () => {
        render(<Dashboard />);
        
        const profileSection = screen.getByTestId('profile-section');
        expect(profileSection).toBeInTheDocument();
        
        //Check that the title is passed correctly
        expect(screen.getByText('Profile Information')).toBeInTheDocument();
        
        //Check that user data is displayed
        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
        expect(screen.getByTestId('user-id')).toHaveTextContent('user123');
    });

    test('passes correct props to ProtectedContentSection', () => {
        render(<Dashboard />);
        
        const protectedSection = screen.getByTestId('protected-content-section');
        expect(protectedSection).toBeInTheDocument();
        
        // heck that the title is passed correctly
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        
        //Check that description is displayed
        expect(screen.getByText('This is a protected area that only authenticated users can access.')).toBeInTheDocument();
    });

    test('handles undefined user properties gracefully', () => {
        //Set mock user with missing properties
        mockUser = {
        name: 'John Doe',
        email: '',
        userID: 'user123'
        } as any;
        
        render(<Dashboard />);
        
        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('user-email')).toBeInTheDocument(); //Should be empty but present
        expect(screen.getByTestId('user-id')).toHaveTextContent('user123');
    });
});