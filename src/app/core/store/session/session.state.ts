export interface GameSessionState {
  gameId: string;
  currentRoundIndex: number;
  revealedQuestion: boolean;
  revealedAnswers: string[];
}

export const initialSessionState: GameSessionState = {
  gameId: '',
  currentRoundIndex: 0,
  revealedQuestion: false,
  revealedAnswers: [],
};
