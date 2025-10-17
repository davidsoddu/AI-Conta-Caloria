export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: {
    total: number;
    sugars: number;
  };
  fat: {
    total: number;
    saturated: number;
  };
  fiber: number;
  sodium: number; // in mg
}

export interface Ingredient extends NutritionalInfo {
  name: string;
  estimatedWeight: string; // e.g., "150g"
  glycemicIndex: number;
  glycemicLoad: number;
}

export interface AnalysisResult {
  dishName: string;
  ingredients: Ingredient[];
  totals: NutritionalInfo & { totalGlycemicLoad: number };
  expertComments: string;
}
