import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg shadow-sm text-gray-700">
      <h3 className="text-xl font-bold text-blue-800 mb-2">Disclaimer</h3>
      <p>
        Le informazioni nutrizionali fornite da questa applicazione sono generate da un modello di intelligenza artificiale e devono essere considerate come una stima.
      </p>
      <p className="mt-2">
        I valori possono variare in base alle dimensioni esatte delle porzioni, ai metodi di cottura e agli ingredienti specifici utilizzati. Quest'app non è intesa come un sostituto del parere medico professionale. Consulta sempre un medico o un dietologo qualificato per consigli personalizzati sulla salute e l'alimentazione.
      </p>
    </div>
  );
};

export default Disclaimer;
