import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { type NutritionalInfo } from '../types';

interface NutritionChartsProps {
  totals: NutritionalInfo & { totalGlycemicLoad: number };
}

const COLORS = {
  protein: '#38bdf8', // sky-400
  carbs: '#facc15',   // amber-400
  fat: '#a855f7',     // purple-400
};

const GL_COLORS = {
    low: '#4ade80', // green-400
    medium: '#facc15', // amber-400
    high: '#f87171', // red-400
}

const getGlycemicLoadCategory = (gl: number) => {
    if (gl <= 10) return { label: 'Basso', color: GL_COLORS.low };
    if (gl <= 19) return { label: 'Medio', color: GL_COLORS.medium };
    return { label: 'Alto', color: GL_COLORS.high };
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (label === 'Distribuzione Calorie') {
        return (
            <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="font-bold text-gray-700">{`${payload[0].name}`}</p>
              <p className="text-sm text-gray-600">{`Calorie: ${payload[0].value.toFixed(0)} kcal`}</p>
              <p className="text-sm text-gray-500">{`Percentuale: ${(payload[0].payload.percent * 100).toFixed(1)}%`}</p>
            </div>
        );
      }
      if (label === 'CG Totale') {
         const category = getGlycemicLoadCategory(payload[0].value);
         return (
            <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="font-bold text-gray-700">Carico Glicemico</p>
                <p className="text-sm text-gray-600">{`Valore: ${payload[0].value.toFixed(1)}`}</p>
                <p className="text-sm" style={{color: category.color}}>{`Categoria: ${category.label}`}</p>
            </div>
         );
      }
    }
  
    return null;
  };

const NutritionCharts: React.FC<NutritionChartsProps> = ({ totals }) => {
  const proteinCalories = totals.protein * 4;
  const carbsCalories = totals.carbohydrates.total * 4;
  const fatCalories = totals.fat.total * 9;

  const macroData = [
    { name: 'Proteine', value: proteinCalories, color: COLORS.protein },
    { name: 'Carboidrati', value: carbsCalories, color: COLORS.carbs },
    { name: 'Grassi', value: fatCalories, color: COLORS.fat },
  ].filter(d => d.value > 0);

  const glycemicLoadData = [
    { name: 'CG Totale', value: totals.totalGlycemicLoad }
  ];

  const glycemicLoadCategory = getGlycemicLoadCategory(totals.totalGlycemicLoad);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      {/* Macronutrient Distribution Chart */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Distribuzione Calorie</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={macroData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {macroData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip label="Distribuzione Calorie" />} />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Glycemic Load Chart */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Carico Glicemico Totale</h4>
         <ResponsiveContainer width="100%" height={250}>
          <BarChart data={glycemicLoadData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, dataMax => Math.max(30, dataMax + 5)]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip content={<CustomTooltip label="CG Totale" />} cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" barSize={40} radius={[0, 10, 10, 0]}>
                <Cell fill={glycemicLoadCategory.color} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NutritionCharts;