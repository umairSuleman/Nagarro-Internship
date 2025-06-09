import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    //if we have a stored value and werent waiting for a new operand
    if (storedValue !== null && !waitingForOperand) {
      calculate(storedValue, inputValue).then(result => {
        setStoredValue(result);
        setDisplay(String(result));
      });
    } else if (storedValue === null) {
      //first operation, just stor the value
      setStoredValue(inputValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = async (firstOperand, secondOperand) => {
    if (operation === null) return secondOperand;

    try {
      const response = await axios.post('http://localhost:5000/calculate', {
        expression: `${firstOperand}${operation}${secondOperand}`
      });
      return response.data.result;
    } catch (error) {
      console.error('Calculation error:', error);
      return secondOperand; //return the second opernd as fallback
    }
  };

  const handleEquals = async () => {
    if (operation === null || waitingForOperand) return;

    const inputValue = parseFloat(display);
    const result = await calculate(storedValue, inputValue);
    
    setDisplay(String(result));
    setStoredValue(result); //keep the result for further operations
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="calculator">
      <div className="display">
        <div className="result">{display}</div>
      </div>
      <div className="buttons">
        <button className="gray" onClick={clearAll}>AC</button>
        <button className="gray" onClick={toggleSign}>+/-</button>
        <button className="gray" onClick={handlePercentage}>%</button>
        <button className="orange" onClick={() => performOperation('/')}>÷</button>

        <button onClick={() => inputDigit('7')}>7</button>
        <button onClick={() => inputDigit('8')}>8</button>
        <button onClick={() => inputDigit('9')}>9</button>
        <button className="orange" onClick={() => performOperation('*')}>×</button>

        <button onClick={() => inputDigit('4')}>4</button>
        <button onClick={() => inputDigit('5')}>5</button>
        <button onClick={() => inputDigit('6')}>6</button>
        <button className="orange" onClick={() => performOperation('-')}>-</button>

        <button onClick={() => inputDigit('1')}>1</button>
        <button onClick={() => inputDigit('2')}>2</button>
        <button onClick={() => inputDigit('3')}>3</button>
        <button className="orange" onClick={() => performOperation('+')}>+</button>

        <button className="zero" onClick={() => inputDigit('0')}>0</button>
        <button onClick={inputDecimal}>.</button>
        <button className="orange" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};

export default Calculator;