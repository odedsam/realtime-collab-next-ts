import { useSocket } from '@/hooks/useSocket';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, transport } = useSocket();

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <p className="font-semibold">
        Status:
        <span className={`ml-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </p>
      <p className="text-sm text-gray-600">Transport: {transport}</p>
    </div>
  );
};
