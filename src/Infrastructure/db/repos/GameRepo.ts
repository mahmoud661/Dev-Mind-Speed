import { injectable } from "tsyringe";
import { Game } from "../../../Domain/entities/game.entity";
import { IGameRepo } from "../../../Domain/interfaces/IGameRepo";
import { AppDataSource } from "../init-db";

@injectable()
export class GameRepo implements IGameRepo {
  private _gameRepo;

  constructor() {
    this._gameRepo = AppDataSource.getRepository(Game);
  }

  async create(playerId: number, difficulty: number): Promise<Game> {
    const game = this._gameRepo.create({ 
      playerId, 
      difficulty,
      currentScore: 0,
      totalTimeSpent: 0
    });
    return await this._gameRepo.save(game);
  }

  async findById(id: number): Promise<Game | null> {
    return await this._gameRepo.findOne({ 
      where: { gameId: id },
      relations: ['player']
    });
  }

  async findByIdWithQuestions(id: number): Promise<Game | null> {
    return await this._gameRepo.findOne({ 
      where: { gameId: id },
      relations: ['player', 'questions', 'questions.answers']
    });
  }

  async update(game: Game): Promise<Game> {
    return await this._gameRepo.save(game);
  }

  async endGame(gameId: number): Promise<void> {
    await this._gameRepo.update(gameId, { endTime: new Date() });
  }
}
