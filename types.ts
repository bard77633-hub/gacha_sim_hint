export interface Hint {
  title: string;
  content: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  goals: string[];
  hints: Hint[];
  pythonCode: string;
  // Simulation parameters for the JS visualization
  simulationType: 'basic' | 'list' | 'probability' | 'complex';
}