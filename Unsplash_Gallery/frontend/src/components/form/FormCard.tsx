

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md space-y-4 ${className}`}>
      {children}
    </div>
  );
};