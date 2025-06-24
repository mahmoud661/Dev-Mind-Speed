import { Question } from "../entities/question.entity";

export interface IQuestionRepo {
  create(gameId: number, questionText: string, correctAnswer: number, questionOrder: number): Promise<Question>;
  findById(id: number): Promise<Question | null>;
  findByGameId(gameId: number): Promise<Question[]>;
  findByGameIdWithAnswers(gameId: number): Promise<Question[]>;
}
