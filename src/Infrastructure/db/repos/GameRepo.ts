import { injectable } from "tsyringe";
import { Repository, DataSource } from "typeorm";
import { Game } from "../../../Domain/entities/game.entity";
import { IGameRepo } from "../../../Domain/interfaces/IGameRepo";

@injectable()
export class GameRepo implements IGameRepo {
  private repository: Repository<Game>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Game);
  }

  async create(playerId: number, difficulty: number): Promise<Game> {
    const game = this.repository.create({ 
      playerId, 
      difficulty,
      currentScore: 0,
      totalTimeSpent: 0
    });
    return await this.repository.save(game);
  }

  async findById(id: number): Promise<Game | null> {
    return await this.repository.findOne({ 
      where: { gameId: id },
      relations: ['player']
    });
  }

  async findByIdWithQuestions(id: number): Promise<Game | null> {
    return await this.repository.findOne({ 
      where: { gameId: id },
      relations: ['player', 'questions', 'questions.answers']
    });
  }

  async update(game: Game): Promise<Game> {
    return await this.repository.save(game);
  }

  async endGame(gameId: number): Promise<void> {
    await this.repository.update(gameId, { endTime: new Date() });
  }
}
