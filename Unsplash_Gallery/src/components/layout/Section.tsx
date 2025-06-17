interface SectionProps {
  children: React.ReactNode;
  spacing?: 4 | 6 | 8;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 6,
  className = ''
}) => {
  const getSpacingClass = (spacing: number) => `space-y-${spacing}`;
  
  return (
    <div className={`${getSpacingClass(spacing)} ${className}`}>
      {children}
    </div>
  );
};