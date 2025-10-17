
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
);

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center py-10 bg-red-50 border-2 border-red-200 rounded-xl">
       <div className="bg-red-100 rounded-full p-4 mb-4">
            <ErrorIcon className="w-12 h-12 text-red-500" />
       </div>
      <h3 className="text-xl font-bold text-red-800 mb-2">Analisi Fallita</h3>
      <p className="text-red-600 max-w-md mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        Riprova
      </button>
    </div>
  );
};

export default ErrorDisplay;
