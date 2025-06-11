
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

    //Displays Zero
    test('Displays initial zero value', () => {
        expect(screen.getByTestId('result')).toHaveTextContent('0');
    });

    //Handles Button Presses
    test('Displays appropriate button on press', () => {
        fireEvent.click(screen.getByText('7'));
        expect(screen.getByTestId('result')).toHaveTextContent('7');

        fireEvent.click(screen.getByText('5'));
        expect(screen.getByTestId('result')).toHaveTextContent('75');
    });

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

    //Operations 

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

