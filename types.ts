export type SimulationType = 'basic' | 'list' | 'probability' | 'complex';

export interface Hint {
  title: string;
  content: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  goals: string[];
  simulationType: SimulationType;
  hints: Hint[];
  pythonCode: string;
}
