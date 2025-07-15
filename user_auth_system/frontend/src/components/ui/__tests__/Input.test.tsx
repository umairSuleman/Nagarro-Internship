import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../ui/Input';

describe('Input Component', () => {
    test('renders input with label', () => {
        render(
            <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter email"
                value=""
                onChange={() => {}}
            />
        );
        
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    });

    test('should accumulate inpute values when typing', async () => {
        const user = userEvent.setup();
        let currentValue ='';
        const handleChange = (value: string)=> {
            currentValue += value;
        };
        
        render(
            <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter email"
                value={currentValue}
                onChange={handleChange}
            />
        );
        
        const input = screen.getByLabelText(/email/i);
        await user.type(input, 'test@example.com');
        
        expect(currentValue).toBe('test@example.com');
    });

    test('shows error state', () => {
        render(
            <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter email"
                value=""
                onChange={() => {}}
                error="Invalid email"
            />
        );
        
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toHaveClass('border-red-300');
    });

});