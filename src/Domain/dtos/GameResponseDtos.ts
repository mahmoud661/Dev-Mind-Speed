/**
 * @fileoverview Response DTOs for game-related operations.
 * Defines the structure of responses sent to clients for various game endpoints.
 */

/**
 * Response structure for starting a new game.
 * 
 * @interface StartGameResponse
 */
export interface StartGameResponse {
  /** Greeting message for the player */
  message: string;
  /** URL endpoint for submitting answers */
  submit_url: string;
  /** The first question text */
  question: string;
  /** Timestamp when the game was started */
  time_started: Date;
}

/**
 * Structure for the next question information.
 * 
 * @interface NextQuestion
 */
export interface NextQuestion {
  /** URL endpoint for submitting the answer to this question */
  submit_url: string;
  /** The question text */
  question: string;
}

/**
 * Response structure for submitting an answer.
 * 
 * @interface SubmitAnswerResponse
 */
export interface SubmitAnswerResponse {
  /** Result message indicating if the answer was correct */
  result: string;
  /** Time taken to answer the question in seconds */
  time_taken: number;
  /** Information about the next question (if available) */
  next_question?: NextQuestion;
  /** Current score as "correct/total" format */
  current_score: string;
}

/**
 * Structure for the player's best score information.
 * 
 * @interface BestScore
 */
export interface BestScore {
  /** The question text for the best score */
  question: string;
  /** The correct answer for the question */
  answer: number;
  /** Time taken for the fastest correct answer */
  time_taken: number;
}

/**
 * Structure for individual question history.
 * 
 * @interface GameHistory
 */
export interface GameHistory {
  /** The question text */
  question: string;
  /** The answer provided by the player */
  player_answer: number;
  /** The correct answer to the question */
  correct_answer: number;
  /** Whether the player's answer was correct */
  is_correct: boolean;
  /** Time taken to answer in seconds */
  time_taken: number;
}

/**
 * Response structure for ending a game and getting final results.
 * 
 * @interface EndGameResponse
 */
export interface EndGameResponse {
  /** Name of the player */
  name: string;
  /** Difficulty level of the game */
  difficulty: number;
  /** Final score as "correct/total" format */
  current_score: string;
  /** Total time spent on the game in seconds */
  total_time_spent: number;
  /** Information about the player's best performance */
  best_score: BestScore;
  /** Complete history of all questions and answers */
  history: GameHistory[];
}
