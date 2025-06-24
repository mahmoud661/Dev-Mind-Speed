import { injectable } from "tsyringe";
import { Question } from "../../../Domain/entities/question.entity";
import { IQuestionRepo } from "../../../Domain/interfaces/IQuestionRepo";
import { AppDataSource } from "../init-db";

@injectable()
export class QuestionRepo implements IQuestionRepo {
  private _questionRepo;

  constructor() {
    this._questionRepo = AppDataSource.getRepository(Question);
  }

  async create(gameId: number, questionText: string, correctAnswer: number, questionOrder: number): Promise<Question> {
    const question = this._questionRepo.create({ 
      gameId, 
      questionText, 
      correctAnswer, 
      questionOrder 
    });
    return await this._questionRepo.save(question);
  }

  async findById(id: number): Promise<Question | null> {
    return await this._questionRepo.findOne({ 
      where: { questionId: id },
      relations: ['game', 'answers']
    });
  }

  async findByGameId(gameId: number): Promise<Question[]> {
    return await this._questionRepo.find({ 
      where: { gameId },
      order: { questionOrder: 'ASC' }
    });
  }

  async findByGameIdWithAnswers(gameId: number): Promise<Question[]> {
    return await this._questionRepo.find({ 
      where: { gameId },
      relations: ['answers'],
      order: { questionOrder: 'ASC' }
    });
  }
}
