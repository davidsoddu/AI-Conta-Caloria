import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl text-gray-700">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Come Utilizzare l'App</h3>
      <ul className="space-y-4 list-decimal list-inside">
        <li>
          <span className="font-semibold">Scansiona il Tuo Pasto:</span> 
          Dalla schermata principale, tocca "Scansiona con la Fotocamera" e scatta una foto chiara e ben illuminata del tuo pasto.
        </li>
        <li>
          <span className="font-semibold">Attendi l'Analisi AI:</span> 
          Il nostro nutrizionista AI analizzerà l'immagine per identificare gli ingredienti e calcolare i valori nutrizionali. Questo potrebbe richiedere alcuni secondi.
        </li>
        <li>
          <span className="font-semibold">Esplora i Risultati:</span> 
          Una volta completata l'analisi, puoi navigare tra le diverse sezioni utilizzando i pulsanti del menu per visualizzare i consigli, i totali, i grafici e i dettagli degli ingredienti.
        </li>
        <li>
          <span className="font-semibold">Salva la Tua Analisi:</span> 
          Se vuoi conservare un'analisi, tocca il pulsante "Salva Analisi". Verrà ricaricata automaticamente la prossima volta che apri l'app.
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
