import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../../ui/Alert';

describe('Alert Component', () => {
    test('renders alert with message', () => {
        render(<Alert type="error" message="Something went wrong" />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('renders different alert types', () => {
        const { rerender } = render(<Alert type="error" message="Error message" />);
        expect(screen.getByText('Error message')).toBeInTheDocument();

        rerender(<Alert type="success" message="Success message" />);
        expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const handleClose = jest.fn();
        
        render(<Alert type="error" message="Test message" onClose={handleClose} />);
        
        const closeButton = screen.getByLabelText(/close alert/i);
        await user.click(closeButton);
        
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not render close button when onClose is not provided', () => {
        render(<Alert type="info" message="Info message" />);
        expect(screen.queryByLabelText(/close alert/i)).not.toBeInTheDocument();
    });
});