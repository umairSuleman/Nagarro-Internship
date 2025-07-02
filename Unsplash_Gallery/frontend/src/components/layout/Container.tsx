

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'full',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };
  
  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};