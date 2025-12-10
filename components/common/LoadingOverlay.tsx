interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="rounded-lg bg-white px-6 py-4 shadow-lg">
        <div className="text-lg font-medium text-gray-900">로딩 중...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
