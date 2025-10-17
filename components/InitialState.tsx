
import React from 'react';

interface InitialStateProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
);


const InitialState: React.FC<InitialStateProps> = ({ fileInputRef, onChange }) => {
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center flex flex-col items-center justify-center py-10">
      <div className="bg-emerald-100 rounded-full p-6 mb-6">
        <CameraIcon className="w-16 h-16 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Pronto a Scansionare il Tuo Pasto?</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Usa la fotocamera del tuo telefono per scattare una foto del tuo cibo e la nostra intelligenza artificiale fornirà un'analisi nutrizionale completa.
      </p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="flex items-center justify-center bg-emerald-500 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-lg"
      >
        <CameraIcon className="w-6 h-6 mr-3" />
        Scansiona con la Fotocamera
      </button>
    </div>
  );
};

export default InitialState;
