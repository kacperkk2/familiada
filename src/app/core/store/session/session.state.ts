export interface GameSessionState {
  gameId: string;
  currentRoundIndex: number;
  revealedQuestion: boolean;
  revealedAnswers: string[];
  teamNames: [string, string];
  penaltyPoints: [number, number];
  teamScores: [number, number];
  roundPool: number;
}

export const initialSessionState: GameSessionState = {
  gameId: '',
  currentRoundIndex: 0,
  revealedQuestion: false,
  revealedAnswers: [],
  teamNames: ['Drużyna 1', 'Drużyna 2'],
  penaltyPoints: [0, 0],
  teamScores: [0, 0],
  roundPool: 0,
};
