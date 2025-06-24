import { Game } from "../entities/game.entity";

export interface IGameRepo {
  create(playerId: number, difficulty: number): Promise<Game>;
  findById(id: number): Promise<Game | null>;
  findByIdWithQuestions(id: number): Promise<Game | null>;
  update(game: Game): Promise<Game>;
  endGame(gameId: number): Promise<void>;
}
