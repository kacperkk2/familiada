export interface Answer {
  id: string;
  text: string;
  points: number;
}

export interface Round {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Game {
  id: string;
  name: string;
  rounds: Round[];
}
