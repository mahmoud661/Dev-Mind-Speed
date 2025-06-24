import { Answer } from "../entities/answer.entity";

export interface IAnswerRepo {
  create(questionId: number, playerAnswer: number, timeTaken: number, isCorrect: boolean): Promise<Answer>;
  findById(id: number): Promise<Answer | null>;
  findByQuestionId(questionId: number): Promise<Answer[]>;
  findByGameId(gameId: number): Promise<Answer[]>;
}
