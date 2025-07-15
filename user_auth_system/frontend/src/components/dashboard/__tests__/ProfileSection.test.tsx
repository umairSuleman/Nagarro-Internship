import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileSection from '../ProfileSection';
import { ProfileField } from '../../../types/dashboardTypes';
import { User } from '../../../types/auth';

describe('ProfileSection', () => {
    const mockFields: ProfileField[] = [
        { key: 'name', label: 'Full Name', accessor: 'name' },
        { key: 'email', label: 'Email Address', accessor: 'email' },
        { key: 'userID', label: 'User ID', accessor: 'userID' }
    ];

    const mockUser: User = {
        name: 'John Doe',
        email: 'john@example.com',
        userID: 'user123'
    };

    test('renders profile section with user data', () => {
        render(
        <ProfileSection 
            title="Profile Information" 
            fields={mockFields} 
            user={mockUser} 
        />
        );
        
        expect(screen.getByRole('heading', { name: 'Profile Information' })).toBeInTheDocument();
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('User ID')).toBeInTheDocument();
        expect(screen.getByText('user123')).toBeInTheDocument();
    });

    test('renders N/A for missing user data', () => {
        const incompleteUser = {
        name: 'John Doe',
        email: '', //empty email
        userID: 'user123'
        } as User;

        render(
        <ProfileSection 
            title="Profile Information" 
            fields={mockFields} 
            user={incompleteUser} 
        />
        );
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument(); //for empty email
        expect(screen.getByText('user123')).toBeInTheDocument();
    });

    test('renders N/A for null user', () => {
        render(
        <ProfileSection 
            title="Profile Information" 
            fields={mockFields} 
            user={null} 
        />
        );
        
        expect(screen.getByRole('heading', { name: 'Profile Information' })).toBeInTheDocument();
        expect(screen.getAllByText('N/A')).toHaveLength(3); // All fields should show N/A
    });

    test('renders with empty fields array', () => {
        render(
        <ProfileSection 
            title="Profile Information" 
            fields={[]} 
            user={mockUser} 
        />
        );
        
        expect(screen.getByRole('heading', { name: 'Profile Information' })).toBeInTheDocument();
        //Should not render any field labels or values
        expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });

    test('renders with custom title', () => {
        render(
        <ProfileSection 
            title="User Details" 
            fields={mockFields} 
            user={mockUser} 
        />
        );
        
        expect(screen.getByRole('heading', { name: 'User Details' })).toBeInTheDocument();
    });
});