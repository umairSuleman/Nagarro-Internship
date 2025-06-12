
import Calculator from "./Calculator";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {expect, jest, test} from '@jest/globals';

//describing Calculator Component
describe('Calculator Componenet', () => {
    
    //render the Calculator before every Test
    beforeEach(()=>{
        render(<Calculator />);
    });

    //Rendering Componenets
    describe('Rendering Componenets', () => {
        //Displays Zero
        test('Displays initial zero value', () => {
            expect(screen.getByTestId('result')).toHaveTextContent('0');
        });

        //All buttons are displayed
        test('All buttons displayed', () => {
            const buttons =['AC', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '.', '='];

            buttons.forEach(button => {
                expect(screen.getByText(button)).toBeInTheDocument();
            });

            // Handle the "0" button separately since it appears in both display and as a button
            const zeroButtons = screen.getAllByText('0');
            expect(zeroButtons).toHaveLength(2); // One in display, one as button
            
            // Verify the "0" button specifically
            const zeroButton = screen.getByRole('button', { name: '0' });
            expect(zeroButton).toBeInTheDocument();

        });
    });

    //Function Operations
    describe('Functional Operations', () => {

        //Handles Decimal Point
        test('Displays decimal numbers', () => {
            fireEvent.click(screen.getByText('8'));
            fireEvent.click(screen.getByText('.'));
            fireEvent.click(screen.getByText('5'));

            expect(screen.getByTestId('result')).toHaveTextContent('8.5');
        });

        //Handles AC button
        test('Displays 0 after AC press', () => {
            fireEvent.click(screen.getByText('8'));
            fireEvent.click(screen.getByText('AC'));

            expect(screen.getByTestId('result')).toHaveTextContent('0');
        }); 

        //Handles Percentage Button
        test('Converts to Percent', () => {
            fireEvent.click(screen.getByText('9'));
            fireEvent.click(screen.getByText('%'));

            expect(screen.getByTestId('result')).toHaveTextContent('0.09');
        }); 

        //Handles +/- Button
        test('Converts Number to negative', () => {
            fireEvent.click(screen.getByText('8'));
            fireEvent.click(screen.getByText('+/-'));

            expect(screen.getByTestId('result')).toHaveTextContent('-8');
        });
      
    });
    

    //Operations 

    describe('Mathematical Operations', () => {
        //Addition 
        test('Addition Works', () => {

            //normal
            fireEvent.click(screen.getByText('5'));
            fireEvent.click(screen.getByText('+'));
            fireEvent.click(screen.getByText('3'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('8');

            //chained 
            fireEvent.click(screen.getByText('+'));
            fireEvent.click(screen.getByText('7'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('15');

        });

        //Subtraction 
        test('Subtraction Works', () => {

            //normal
            fireEvent.click(screen.getByText('5'));
            fireEvent.click(screen.getByText('-'));
            fireEvent.click(screen.getByText('3'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('2');

            //chained 
            fireEvent.click(screen.getByText('-'));
            fireEvent.click(screen.getByText('1'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('1');

        });

        //Multiplication
        test('Multiplication Works', () => {
            //normal
            fireEvent.click(screen.getByText('5'));
            fireEvent.click(screen.getByText('×'));
            fireEvent.click(screen.getByText('3'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('15');

            //chained 
            fireEvent.click(screen.getByText('×'));
            fireEvent.click(screen.getByText('2'));
            fireEvent.click(screen.getByText('+/-'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('-30');

            //sign change
            fireEvent.click(screen.getByText('×'));
            fireEvent.click(screen.getByText('2'));
            fireEvent.click(screen.getByText('+/-'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('60');
        });

        //Division
        test('Division Works', () => {
            //normal
            fireEvent.click(screen.getByText('2'));
            fireEvent.click(screen.getByText('7'));
            fireEvent.click(screen.getByText('÷'));
            fireEvent.click(screen.getByText('3'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('9');

            //chained 
            fireEvent.click(screen.getByText('÷'));
            fireEvent.click(screen.getByText('2'));
            fireEvent.click(screen.getByText('+/-'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('-4.5');

            //sign change
            fireEvent.click(screen.getByText('÷'));
            fireEvent.click(screen.getByText('1'));
            fireEvent.click(screen.getByText('+/-'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result')).toHaveTextContent('4.5');

            //divide by zero error
            fireEvent.click(screen.getByText('÷'));
            fireEvent.click(screen.getByText('0'));
            fireEvent.click(screen.getByText('='));

            expect(screen.getByTestId('result').textContent).toMatch(/∞/);
        });
      
    });

});

