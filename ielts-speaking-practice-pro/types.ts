
export interface IeltsQuestion {
  part: 'Part 1' | 'Part 3';
  question: string;
}

export interface EvaluationResult {
  band: number;
  justification: string;
  sampleAnswer: string;
}
