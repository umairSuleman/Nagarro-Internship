import './Button.css';

const Button = ({ value, onClick, variant = 'digit' }) => {
  const buttonClass = `button ${variant}`;
  
  return (
    <button 
      className={buttonClass} 
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};

export default Button;