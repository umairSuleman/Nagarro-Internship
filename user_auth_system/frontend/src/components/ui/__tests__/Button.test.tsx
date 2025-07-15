import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail } from 'lucide-react';
import Button from '../../ui/Button';

describe('Button Component', () => {
    test('renders button with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();
        
        render(<Button onClick={handleClick}>Click me</Button>);
        await user.click(screen.getByRole('button'));
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders with different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

        rerender(<Button variant="success">Success</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-green-600');
    });

    test('shows loading state', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    test('renders with icon', () => {
        render(<Button icon={Mail} iconPosition="left">With Icon</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        // Icon would be tested if it has a test-id or aria-label
    });
});