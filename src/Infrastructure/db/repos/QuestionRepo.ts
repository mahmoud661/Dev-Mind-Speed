import { injectable } from "tsyringe";
import { Repository, DataSource } from "typeorm";
import { Question } from "../../../Domain/entities/question.entity";
import { IQuestionRepo } from "../../../Domain/interfaces/IQuestionRepo";

@injectable()
export class QuestionRepo implements IQuestionRepo {
  private repository: Repository<Question>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Question);
  }

  async create(gameId: number, questionText: string, correctAnswer: number, questionOrder: number): Promise<Question> {
    const question = this.repository.create({ 
      gameId, 
      questionText, 
      correctAnswer, 
      questionOrder 
    });
    return await this.repository.save(question);
  }

  async findById(id: number): Promise<Question | null> {
    return await this.repository.findOne({ 
      where: { questionId: id },
      relations: ['game', 'answers']
    });
  }

  async findByGameId(gameId: number): Promise<Question[]> {
    return await this.repository.find({ 
      where: { gameId },
      order: { questionOrder: 'ASC' }
    });
  }

  async findByGameIdWithAnswers(gameId: number): Promise<Question[]> {
    return await this.repository.find({ 
      where: { gameId },
      relations: ['answers'],
      order: { questionOrder: 'ASC' }
    });
  }
}
