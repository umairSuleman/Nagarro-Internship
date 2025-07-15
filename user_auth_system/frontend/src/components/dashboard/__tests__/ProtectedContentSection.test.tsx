import { render, screen } from '@testing-library/react';
import { Shield, CheckCircle } from 'lucide-react';
import ProtectedContentSection from '../ProtectedContentSection';
import { StatusBadge } from '../../../types/dashboardTypes';

//mock lucide-react icons
jest.mock('lucide-react', () => ({
  Shield: ({ className }: { className?: string }) => (
    <div data-testid="shield-icon" className={className}>Shield</div>
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <div data-testid="check-circle-icon" className={className}>CheckCircle</div>
  ),
  AlertCircle: ({ className }: { className?: string }) => (
    <div data-testid="alert-circle-icon" className={className}>AlertCircle</div>
  ),
}));

describe('ProtectedContentSection', () => {
    const mockStatusBadge: StatusBadge = {
        text: 'Authentication Status: Verified',
        icon: Shield,
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
    };

    const defaultProps = {
        title: 'Protected Content',
        description: 'This is a protected area that only authenticated users can access.',
        statusBadge: mockStatusBadge
    };

    describe('Rendering', () => {
        test('renders the component with all required elements', () => {
            render(<ProtectedContentSection {...defaultProps} />);

            expect(screen.getByText('Protected Content')).toBeInTheDocument();
            expect(screen.getByText('This is a protected area that only authenticated users can access.')).toBeInTheDocument();
            expect(screen.getByText('Authentication Status: Verified')).toBeInTheDocument();
            expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
        });

        test('renders title with correct styling', () => {
            render(<ProtectedContentSection {...defaultProps} />);

            const title = screen.getByText('Protected Content');
            expect(title).toHaveClass('text-lg', 'font-medium', 'text-gray-900');
            expect(title.tagName).toBe('H2');
        });

        test('renders description with correct styling', () => {
            render(<ProtectedContentSection {...defaultProps} />);

            const description = screen.getByText('This is a protected area that only authenticated users can access.');
            expect(description).toHaveClass('text-gray-600');
            expect(description.tagName).toBe('P');
        });
    });

    describe('Status Badge', () => {
        test('renders status badge with correct styling', () => {
            render(<ProtectedContentSection {...defaultProps} />);

            const statusText = screen.getByText('Authentication Status: Verified');
            const flexContainer = statusText.closest('div'); 
            const badgeContainer = flexContainer?.parentElement; 
            
            expect(badgeContainer).toHaveClass('mt-4', 'p-4', 'bg-green-50', 'rounded-lg');
            expect(flexContainer).toHaveClass('flex', 'items-center');
        });

        test('renders status icon with correct styling', () => {
            render(<ProtectedContentSection {...defaultProps} />);

            const statusIcon = screen.getByTestId('shield-icon');
            expect(statusIcon).toHaveClass('h-5', 'w-5', 'text-green-600', 'mr-2');
        });

        test('renders status text with correct styling', () => {
            render(<ProtectedContentSection {...defaultProps} />);

            const statusText = screen.getByText('Authentication Status: Verified');
            expect(statusText).toHaveClass('text-green-800', 'font-medium');
        });

        test('renders different icon types correctly', () => {
            const checkCircleBadge: StatusBadge = {
                text: 'Status: Active',
                icon: CheckCircle,
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-800',
                iconColor: 'text-blue-600'
            };

            render(
                <ProtectedContentSection 
                {...defaultProps} 
                statusBadge={checkCircleBadge}
                />
            );

            expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
            expect(screen.getByText('Status: Active')).toBeInTheDocument();
        });
    });

    describe('Props Handling', () => {
        test('renders with custom title', () => {
        render(
            <ProtectedContentSection 
            {...defaultProps} 
            title="Custom Protected Area"
            />
        );

        expect(screen.getByText('Custom Protected Area')).toBeInTheDocument();
        });

        test('renders with custom description', () => {
        render(
            <ProtectedContentSection 
            {...defaultProps} 
            description="Custom description for protected content."
            />
        );

        expect(screen.getByText('Custom description for protected content.')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        test('handles empty strings gracefully', () => {
        const emptyBadge: StatusBadge = {
            text: '',
            icon: Shield,
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-800',
            iconColor: 'text-gray-600'
        };

        render(
            <ProtectedContentSection 
            title=""
            description=""
            statusBadge={emptyBadge}
            />
        );

        //component should render without crashing
        expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
        });
    });

});