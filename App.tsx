import React, { useState, useCallback, useRef, useEffect } from 'react';
import { analyzeMeal } from './services/geminiService';
import { type AnalysisResult } from './types';
import Header from './components/Header';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import InitialState from './components/InitialState';
import ErrorDisplay from './components/ErrorDisplay';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check storage
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('lastAnalysis');
      if (savedData) {
        const { result, image } = JSON.parse(savedData);
        setAnalysisResult(result);
        setImage(image);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to load saved analysis:", err);
      localStorage.removeItem('lastAnalysis');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/...;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setAnalysisResult(null);
      setIsLoading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        setImage(reader.result as string);
        try {
          const base64Image = await fileToBase64(file);
          const result = await analyzeMeal(base64Image, file.type);
          setAnalysisResult(result);
          setIsSaved(false); // New analysis is not saved yet
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleReset = () => {
    setImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setIsSaved(false);
    localStorage.removeItem('lastAnalysis');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
      if (analysisResult && image) {
        try {
            const dataToSave = JSON.stringify({ result: analysisResult, image });
            localStorage.setItem('lastAnalysis', dataToSave);
            setIsSaved(true);
        } catch (err) {
            console.error("Failed to save analysis:", err);
            setError("Impossibile salvare l'analisi. Lo spazio di archiviazione locale potrebbe essere pieno.");
        }
      }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.98 },
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 280,
    damping: 25,
    duration: 0.6
  };
  
  const renderContent = () => {
    if (isLoading) {
       return (
          <motion.div
            key="loading"
            variants={pageVariants}
            transition={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
              <Spinner />
              <p className="text-lg text-gray-600 animate-pulse">Caricamento...</p>
            </div>
          </motion.div>
        );
    }

    if (error) {
       return (
        <motion.div
            key="error"
            variants={pageVariants}
            transition={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <ErrorDisplay message={error} onRetry={handleReset} />
        </motion.div>
       );
    }

    if (analysisResult && image) {
        return (
             <motion.div
                key="result"
                variants={pageVariants}
                transition={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ResultDisplay result={analysisResult} image={image} onReset={handleReset} onSave={handleSave} isSaved={isSaved} />
              </motion.div>
        );
    }

    // Initial state or loading new image
    if (image && !analysisResult) {
        return (
             <motion.div
                key="analyzing"
                variants={pageVariants}
                transition={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <div className="flex flex-col items-center justify-center space-y-6">
                  {image && (
                     <img src={image} alt="Meal to be analyzed" className="rounded-xl max-h-80 w-auto shadow-md" />
                  )}
                  <Spinner />
                  <p className="text-lg text-gray-600 animate-pulse">Il nostro nutrizionista AI sta analizzando il tuo pasto...</p>
                </div>
              </motion.div>
        );
    }
    
    return (
        <motion.div
            key="initial"
            variants={pageVariants}
            transition={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <InitialState fileInputRef={fileInputRef} onChange={handleImageChange} />
        </motion.div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
        <footer className="text-center text-gray-400 mt-8 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Conta Calorie. Tutte le informazioni nutrizionali sono una stima.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;