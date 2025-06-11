import React, { useState } from 'react';
import './App.css';
import Button from './components/Button/Button';

const Calculator = () => {

  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);


  //clear the Result Tab
  const clearAll = () => {
    setDisplay('0');
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  //inputs digits
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  //inputs decimals
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  //calculates expression
  const calculate = (firstOperand, secondOperand, op) => {
    if (op === null) return secondOperand;

    const first = parseFloat(firstOperand);
    const second = parseFloat(secondOperand);

    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        if (second === 0) {
          return '∞'; // Handle division by zero
        }
        return first / second;
      case '%':
        return first % second;
      default:
        return second;
    }
  };

  //performs operations
  const performOperation = (op) => {
    const ops = {
      '÷': '/',
      '×': '*',
      '+': '+',
      '-': '-',
      '%': '%'
    };
    const actualOp = ops[op] || op;
    const inputValue = parseFloat(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operation) {
      const result = calculate(storedValue, inputValue, operation);
      if (result === 'Error') {
        setDisplay('Error');
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }
      setStoredValue(result);
      setDisplay(String(result));
    }
    setWaitingForOperand(true);
    setOperation(actualOp);
  };

  //Equal button press 
  const handleEquals = () => {
    if (operation === null || waitingForOperand) return;

    const inputValue = parseFloat(display);
    const result = calculate(storedValue, inputValue, operation);
    
    if (result === 'Error') {
      setDisplay('Error');
      setStoredValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      return;
    }
    
    setDisplay(String(result));
    setStoredValue(result); // keep the result for further operations
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  //Button Layout
  const buttonLayout =[
    { value: 'AC', variant: 'function', handler: clearAll },
    { value: '+/-', variant: 'function', handler: toggleSign },
    { value: '%', variant: 'function', handler: handlePercentage },
    { value: '÷', variant: 'operator', handler: () => performOperation('÷') },
    { value: '7', variant: 'digit', handler: () => inputDigit('7') },
    { value: '8', variant: 'digit', handler: () => inputDigit('8') },
    { value: '9', variant: 'digit', handler: () => inputDigit('9') },
    { value: '×', variant: 'operator', handler: () => performOperation('×') },
    { value: '4', variant: 'digit', handler: () => inputDigit('4') },
    { value: '5', variant: 'digit', handler: () => inputDigit('5') },
    { value: '6', variant: 'digit', handler: () => inputDigit('6') },
    { value: '-', variant: 'operator', handler: () => performOperation('-') },
    { value: '1', variant: 'digit', handler: () => inputDigit('1') },
    { value: '2', variant: 'digit', handler: () => inputDigit('2') },
    { value: '3', variant: 'digit', handler: () => inputDigit('3') },
    { value: '+', variant: 'operator', handler: () => performOperation('+') },
    { value: '0', variant: 'zero', handler: () => inputDigit('0') },
    { value: '.', variant: 'digit', handler: inputDecimal },
    { value: '=', variant: 'operator', handler: handleEquals }
  ];

  return (
    <div className="calculator">
      <div className="display" data-testid="display">
        <div className="result" data-testid="result">{display}</div>
      </div>
      <div className="buttons-grid">
        {buttonLayout.map((btn) => (
          <Button
            key={btn.value}
            value={btn.value}
            variant={btn.variant}
            onClick={btn.handler}
          />
        ))}
      </div>
    </div>
  );
};

export default Calculator;