
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM5.293 5.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM12.586 5.293a1 1 0 010 1.414l.707.707a1 1 0 011.414-1.414l-.707-.707a1 1 0 01-1.414 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">
            AI <span className="text-emerald-500">Conta</span> Calorie
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
