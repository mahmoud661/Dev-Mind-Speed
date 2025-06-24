export interface StartGameResponse {
  message: string;
  submit_url: string;
  question: string;
  time_started: Date;
}

export interface NextQuestion {
  submit_url: string;
  question: string;
}

export interface SubmitAnswerResponse {
  result: string;
  time_taken: number;
  next_question?: NextQuestion;
  current_score: string;
}

export interface BestScore {
  question: string;
  answer: number;
  time_taken: number;
}

export interface GameHistory {
  question: string;
  player_answer: number;
  correct_answer: number;
  is_correct: boolean;
  time_taken: number;
}

export interface EndGameResponse {
  name: string;
  difficulty: number;
  current_score: string;
  total_time_spent: number;
  best_score: BestScore;
  history: GameHistory[];
}
