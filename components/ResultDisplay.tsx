import React, { useState } from 'react';
import { type AnalysisResult } from '../types';
import NutritionCharts from './NutritionCharts';
import Instructions from './Instructions';
import Disclaimer from './Disclaimer';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultDisplayProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
  onSave: () => void;
  isSaved: boolean;
}

type Section = 'consigli' | 'totali' | 'grafici' | 'ingredienti' | 'istruzioni' | 'disclaimer';

const SectionButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
      isActive
        ? 'bg-emerald-500 text-white shadow'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {label}
  </button>
);

const NutritionCard: React.FC<{ title: string; value: number; unit: string; color: string }> = ({ title, value, unit, color }) => (
    <div className={`flex-1 p-4 rounded-lg text-center ${color}`}>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-2xl font-bold">
            {value.toFixed(1)}
            <span className="text-base font-normal ml-1">{unit}</span>
        </p>
    </div>
);

const TotalsSummary: React.FC<{ totals: AnalysisResult['totals'] }> = ({ totals }) => (
    <div className="bg-gray-100 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Valore Nutrizionale Totale</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-white">
            <NutritionCard title="Calorie" value={totals.calories} unit="kcal" color="bg-red-400" />
            <NutritionCard title="Proteine" value={totals.protein} unit="g" color="bg-sky-400" />
            <NutritionCard title="Carboidrati" value={totals.carbohydrates.total} unit="g" color="bg-amber-400" />
            <NutritionCard title="Grassi" value={totals.fat.total} unit="g" color="bg-purple-400" />
            <NutritionCard title="Carico Glicemico" value={totals.totalGlycemicLoad} unit="" color="bg-green-400" />
        </div>
    </div>
);

const AIComments: React.FC<{ comments: string }> = ({ comments }) => (
     <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
                <h4 className="font-bold text-amber-800">Commenti del Nutrizionista AI</h4>
                <p className="text-gray-700 italic mt-1">"{comments}"</p>
            </div>
        </div>
    </div>
);

const IngredientsTable: React.FC<{ingredients: AnalysisResult['ingredients']}> = ({ingredients}) => {
    const [filter, setFilter] = useState('');

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredienti Dettagliati</h3>
            
            <div className="mb-4 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Cerca un ingrediente..."
                    className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="py-3 px-4">Ingrediente</th>
                            <th className="py-3 px-4 text-center" title="Peso Stimato">Peso</th>
                            <th className="py-3 px-4 text-center" title="Calorie">Cal</th>
                            <th className="py-3 px-4 text-center" title="Proteine (g)">Prot</th>
                            <th className="py-3 px-4 text-center" title="Carboidrati (g)">Carb</th>
                            <th className="py-3 px-4 text-center" title="Zuccheri (g)">Zucc</th>
                            <th className="py-3 px-4 text-center" title="Grassi (g)">Gras</th>
                            <th className="py-3 px-4 text-center" title="Grassi Saturi (g)">Sat</th>
                            <th className="py-3 px-4 text-center" title="Fibre (g)">Fib</th>
                            <th className="py-3 px-4 text-center" title="Sodio (mg)">Sod</th>
                            <th className="py-3 px-4 text-center" title="Indice Glicemico">IG</th>
                            <th className="py-3 px-4 text-center" title="Carico Glicemico">CG</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredIngredients.length > 0 ? (
                            filteredIngredients.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 text-sm text-gray-800">
                                    <td className="py-3 px-4 font-medium whitespace-nowrap">{item.name}</td>
                                    <td className="py-3 px-4 text-center whitespace-nowrap">{item.estimatedWeight}</td>
                                    <td className="py-3 px-4 text-center">{item.calories.toFixed(0)}</td>
                                    <td className="py-3 px-4 text-center">{item.protein.toFixed(1)}</td>
                                    <td className="py-3 px-4 text-center">{item.carbohydrates.total.toFixed(1)}</td>
                                    <td className="py-3 px-4 text-center">{item.carbohydrates.sugars.toFixed(1)}</td>
                                    <td className="py-3 px-4 text-center">{item.fat.total.toFixed(1)}</td>
                                    <td className="py-3 px-4 text-center">{item.fat.saturated.toFixed(1)}</td>
                                    <td className="py-3 px-4 text-center">{item.fiber.toFixed(1)}</td>
                                    <td className="py-3 px-4 text-center">{item.sodium.toFixed(0)}</td>
                                    <td className="py-3 px-4 text-center">{item.glycemicIndex}</td>
                                    <td className="py-3 px-4 text-center">{item.glycemicLoad.toFixed(1)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="text-center py-6 text-gray-500 italic">
                                    Nessun ingrediente trovato.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, image, onReset, onSave, isSaved }) => {
  const [activeSection, setActiveSection] = useState<Section>('consigli');

  const sections = [
    { id: 'consigli', label: 'Consigli AI' },
    { id: 'totali', label: 'Valori Totali' },
    { id: 'grafici', label: 'Grafici' },
    { id: 'ingredienti', label: 'Ingredienti' },
    { id: 'istruzioni', label: 'Istruzioni' },
    { id: 'disclaimer', label: 'Disclaimer' },
  ] as const;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderContent = () => {
    switch (activeSection) {
        case 'consigli': return <AIComments comments={result.expertComments} />;
        case 'totali': return <TotalsSummary totals={result.totals} />;
        case 'grafici': return <NutritionCharts totals={result.totals} />;
        case 'ingredienti': return <IngredientsTable ingredients={result.ingredients} />;
        case 'istruzioni': return <Instructions />;
        case 'disclaimer': return <Disclaimer />;
        default: return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Top section: Image and Dish Name */}
      <div className="text-center">
        <img src={image} alt="Analyzed meal" className="rounded-xl shadow-lg w-full max-w-sm mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{result.dishName}</h2>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-wrap gap-2 justify-center py-4">
        {sections.map(section => (
            <SectionButton
                key={section.id}
                label={section.label}
                isActive={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
            />
        ))}
      </div>
      
      {/* Dynamic Content Section */}
      <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                  {renderContent()}
              </motion.div>
          </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-lg"
        >
          Scansiona un Altro Pasto
        </button>
        <button
          onClick={onSave}
          disabled={isSaved}
          className="w-full sm:w-auto flex items-center justify-center bg-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-lg disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isSaved ? 'Analisi Salvata ✓' : 'Salva Analisi'}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;