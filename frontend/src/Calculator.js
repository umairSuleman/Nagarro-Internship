import React, { useState } from 'react';
import './App.css';
import Button from './components/Button/Button';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const buttonLayout =[
    { value: 'AC', variant: 'function' },
    { value: '+/-', variant: 'function' },
    { value: '%', variant: 'function' },
    { value: '÷', variant: 'operator' },
    { value: '7', variant: 'digit' },
    { value: '8', variant: 'digit' },
    { value: '9', variant: 'digit' },
    { value: '×', variant: 'operator' },
    { value: '4', variant: 'digit' },
    { value: '5', variant: 'digit' },
    { value: '6', variant: 'digit' },
    { value: '-', variant: 'operator' },
    { value: '1', variant: 'digit' },
    { value: '2', variant: 'digit' },
    { value: '3', variant: 'digit' },
    { value: '+', variant: 'operator' },
    { value: '0', variant: 'zero' },
    { value: '.', variant: 'digit' },
    { value: '=', variant: 'operator' }
  ];

  const clearAll = () => {
    setDisplay('0');
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

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

  const handleEquals = () => {
    if (operation === null || waitingForOperand) return;

    const inputValue = parseFloat(display);
    const result = calculate(storedValue, inputValue, operation);
    
    if (result === '') {
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

  const handleButtonClick = (value) => {
    switch (value) {
      case 'AC':
        clearAll();
        break;
      case '+/-':
        toggleSign();
        break;
      case '%':
        handlePercentage();
        break;
      case '÷':
      case '×':
      case '-':
      case '+':
        performOperation(value);
        break;
      case '=':
        handleEquals();
        break;
      case '.':
        inputDecimal();
        break;
      case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        inputDigit(value);
        break;
      default:
        break;
    }
  };

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
            onClick={handleButtonClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Calculator;