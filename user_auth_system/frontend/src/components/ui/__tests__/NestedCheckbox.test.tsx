import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NestedCheckbox from '../NestedCheckbox';
import { CheckboxConfig } from '../../../types/nestedCheckbox';
import { Users, File, Settings } from 'lucide-react';

describe('NestedCheckbox Component', () => {
    const mockConfig: CheckboxConfig = {
        items: [
        {
            id: 'parent1',
            label: 'Parent 1',
            icon: Users,
            children: [
            {
                id: 'child1',
                label: 'Child 1',
                icon: File,
            },
            {
                id: 'child2',
                label: 'Child 2',
                icon: Settings,
            },
            ],
        },
        {
            id: 'parent2',
            label: 'Parent 2',
            description: 'This is parent 2',
        },
        ],
        allowPartialSelection: true,
        expandable: true,
        showIcons: true,
        showDescriptions: true,
        multiSelect: true,
        theme: 'default',
    };

    test('renders checkbox items correctly', () => {
        render(<NestedCheckbox config={mockConfig} />);
        
        expect(screen.getByText('Parent 1')).toBeInTheDocument();
        expect(screen.getByText('Parent 2')).toBeInTheDocument();
        expect(screen.getByText('This is parent 2')).toBeInTheDocument();
    });

    test('handles checkbox selection', async () => {
        const user = userEvent.setup();
        const mockOnSelectionChange = jest.fn();
        
        const config = {
        ...mockConfig,
        onSelectionChange: mockOnSelectionChange,
        };

        render(<NestedCheckbox config={config} />);
        
        const parent1Checkbox = screen.getByRole('checkbox', { name: /parent 1/i });
        await user.click(parent1Checkbox);
        
        expect(mockOnSelectionChange).toHaveBeenCalledWith(['parent1', 'child1', 'child2']);
    });

    test('handles expand/collapse functionality', async () => {
        const user = userEvent.setup();
        render(<NestedCheckbox config={mockConfig} />);
        
        //Initially children should not be visible
        expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
        
        //Expand parent
        const expandButton = screen.getByLabelText('Expand');
        await user.click(expandButton);
        
        //Children should now be visible
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        
        //Collapse parent
        const collapseButton = screen.getByLabelText('Collapse');
        await user.click(collapseButton);
        
        //Children should be hidden again
        expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    });

    test('handles disabled items', () => {
        const configWithDisabled: CheckboxConfig = {
        ...mockConfig,
        items: [
            {
            id: 'disabled-item',
            label: 'Disabled Item',
            disabled: true,
            },
        ],
        };

        render(<NestedCheckbox config={configWithDisabled} />);
        
        const disabledCheckbox = screen.getByRole('checkbox', { name: /disabled item/i });
        expect(disabledCheckbox).toBeDisabled();
    });

    test('clears all selections', async () => {
        const user = userEvent.setup();
        const mockOnSelectionChange = jest.fn();
        
        const config = {
        ...mockConfig,
        onSelectionChange: mockOnSelectionChange,
        };

        render(<NestedCheckbox config={config} />);
        
        //Select parent
        const parent1Checkbox = screen.getByRole('checkbox', { name: /parent 1/i });
        await user.click(parent1Checkbox);
        
        //Clear all
        const clearButton = screen.getByText('Clear All');
        await user.click(clearButton);
        
        expect(mockOnSelectionChange).toHaveBeenLastCalledWith([]);
    });

    test('displays selection count', async () => {
        const user = userEvent.setup();
        render(<NestedCheckbox config={mockConfig} />);
        
        //Initially no selections
        expect(screen.getByText('Selected items: 0')).toBeInTheDocument();
        
        //Select parent
        const parent1Checkbox = screen.getByRole('checkbox', { name: /parent 1/i });
        await user.click(parent1Checkbox);
        
        //Should show 3 selections (parent + 2 children)
        expect(screen.getByText('Selected items: 3')).toBeInTheDocument();
    });

    test('applies different themes', () => {
        const { rerender } = render(<NestedCheckbox config={mockConfig} />);
        
        //Test dark theme
        rerender(<NestedCheckbox config={{...mockConfig, theme: 'dark'}} />);
        const darkContainer = screen.getByTestId('checkbox-container');
        expect(darkContainer).toHaveClass('bg-gray-800');
        
        //Test minimal theme
        rerender(<NestedCheckbox config={{...mockConfig, theme: 'minimal'}} />);
        const minimalContainer = screen.getByTestId('checkbox-container');
        expect(minimalContainer).toHaveClass('bg-transparent');
    });
});