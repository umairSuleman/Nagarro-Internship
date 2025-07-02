

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 2 | 3 | 4 | 6 | 8;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 4,
  className = ''
}) => {
  const baseClasses = 'bg-white rounded-lg';
  
  const variantClasses = {
    default: 'shadow-md',
    elevated: 'shadow-lg',
    bordered: 'border border-gray-200'
  };
  
  const getPaddingClass = (padding: number) => `p-${padding}`;
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${getPaddingClass(padding)} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};