/**
 * @fileoverview Game repository implementation using TypeORM.
 * Provides data access operations for Game entities.
 */

import { injectable } from "tsyringe";
import { Game } from "../../../Domain/entities/game.entity";
import { IGameRepo } from "../../../Domain/interfaces/IGameRepo";
import { AppDataSource } from "../init-db";

/**
 * TypeORM implementation of the Game repository.
 * Handles database operations for Game entities.
 * 
 * @class GameRepo
 * @implements {IGameRepo}
 */
@injectable()
export class GameRepo implements IGameRepo {
  /**
   * TypeORM repository instance for Game entity.
   * 
   * @private
   * @type {Repository<Game>}
   */
  private _gameRepo;

  /**
   * Creates a new GameRepo instance.
   * Initializes the TypeORM repository for Game entity.
   */
  constructor() {
    this._gameRepo = AppDataSource.getRepository(Game);
  }

  /**
   * Creates a new game for the specified player with given difficulty.
   * 
   * @param {number} playerId - The ID of the player starting the game
   * @param {number} difficulty - The difficulty level (1-4)
   * @returns {Promise<Game>} Promise resolving to the created game entity
   */
  async create(playerId: number, difficulty: number): Promise<Game> {
    const game = this._gameRepo.create({ 
      playerId, 
      difficulty,
      currentScore: 0,
      totalTimeSpent: 0
    });
    return await this._gameRepo.save(game);
  }

  /**
   * Finds a game by its unique ID with player relation.
   * 
   * @param {number} id - The unique identifier of the game
   * @returns {Promise<Game | null>} Promise resolving to the game entity or null if not found
   */
  async findById(id: number): Promise<Game | null> {
    return await this._gameRepo.findOne({ 
      where: { gameId: id },
      relations: ['player']
    });
  }

  /**
   * Finds a game by its unique ID including associated questions and answers.
   * 
   * @param {number} id - The unique identifier of the game
   * @returns {Promise<Game | null>} Promise resolving to the game entity with questions or null if not found
   */
  async findByIdWithQuestions(id: number): Promise<Game | null> {
    return await this._gameRepo.findOne({ 
      where: { gameId: id },
      relations: ['player', 'questions', 'questions.answers']
    });
  }

  /**
   * Updates an existing game entity.
   * 
   * @param {Game} game - The game entity to update
   * @returns {Promise<Game>} Promise resolving to the updated game entity
   */
  async update(game: Game): Promise<Game> {
    return await this._gameRepo.save(game);
  }

  /**
   * Marks a game as ended by setting the end time to current timestamp.
   * 
   * @param {number} gameId - The ID of the game to end
   * @returns {Promise<void>} Promise that resolves when the game is marked as ended
   */
  async endGame(gameId: number): Promise<void> {
    await this._gameRepo.update(gameId, { endTime: new Date() });
  }
}
