import { injectable } from "tsyringe";
import { Repository, DataSource } from "typeorm";
import { Answer } from "../../../Domain/entities/answer.entity";
import { IAnswerRepo } from "../../../Domain/interfaces/IAnswerRepo";

@injectable()
export class AnswerRepo implements IAnswerRepo {
  private repository: Repository<Answer>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Answer);
  }

  async create(questionId: number, playerAnswer: number, timeTaken: number, isCorrect: boolean): Promise<Answer> {
    const answer = this.repository.create({ 
      questionId, 
      playerAnswer, 
      timeTaken, 
      isCorrect 
    });
    return await this.repository.save(answer);
  }

  async findById(id: number): Promise<Answer | null> {
    return await this.repository.findOne({ 
      where: { answerId: id },
      relations: ['question']
    });
  }

  async findByQuestionId(questionId: number): Promise<Answer[]> {
    return await this.repository.find({ where: { questionId } });
  }

  async findByGameId(gameId: number): Promise<Answer[]> {
    return await this.repository
      .createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('question.gameId = :gameId', { gameId })
      .getMany();
  }
}
