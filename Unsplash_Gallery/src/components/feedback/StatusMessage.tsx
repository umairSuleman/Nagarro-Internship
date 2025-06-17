

interface StatusMessageProps {
  query: string;
  total: number;
  currentPage: number;
  totalPages: number;
  className?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  query,
  total,
  currentPage,
  totalPages,
  className = ''
}) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <h3 className="text-xl font-semibold text-gray-700">
        "{query}" ({total.toLocaleString()} photos)
      </h3>
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};