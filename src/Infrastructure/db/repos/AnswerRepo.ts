import { injectable } from "tsyringe";
import { Answer } from "../../../Domain/entities/answer.entity";
import { IAnswerRepo } from "../../../Domain/interfaces/IAnswerRepo";
import { AppDataSource } from "../init-db";

@injectable()
export class AnswerRepo implements IAnswerRepo {
  private _answerRepo;

  constructor() {
    this._answerRepo = AppDataSource.getRepository(Answer);
  }

  async create(questionId: number, playerAnswer: number, timeTaken: number, isCorrect: boolean): Promise<Answer> {
    const answer = this._answerRepo.create({ 
      questionId, 
      playerAnswer, 
      timeTaken, 
      isCorrect 
    });
    return await this._answerRepo.save(answer);
  }

  async findById(id: number): Promise<Answer | null> {
    return await this._answerRepo.findOne({ 
      where: { answerId: id },
      relations: ['question']
    });
  }

  async findByQuestionId(questionId: number): Promise<Answer[]> {
    return await this._answerRepo.find({ where: { questionId } });
  }

  async findByGameId(gameId: number): Promise<Answer[]> {
    return await this._answerRepo
      .createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('question.gameId = :gameId', { gameId })
      .getMany();
  }
}
