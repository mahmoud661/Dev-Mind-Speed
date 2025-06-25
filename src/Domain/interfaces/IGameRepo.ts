/**
 * @fileoverview Game repository interface defining data access operations for games.
 * Provides contract for game-related database operations.
 */

import { Game } from "../entities/game.entity";

/**
 * Interface defining game repository operations.
 * Provides methods for creating, finding, updating, and managing game entities.
 * 
 * @interface IGameRepo
 */
export interface IGameRepo {
  /**
   * Creates a new game for the specified player with given difficulty.
   * 
   * @param {number} playerId - The ID of the player starting the game
   * @param {number} difficulty - The difficulty level (1-4)
   * @returns {Promise<Game>} Promise resolving to the created game entity
   */
  create(playerId: number, difficulty: number): Promise<Game>;

  /**
   * Finds a game by its unique ID.
   * 
   * @param {number} id - The unique identifier of the game
   * @returns {Promise<Game | null>} Promise resolving to the game entity or null if not found
   */
  findById(id: number): Promise<Game | null>;

  /**
   * Finds a game by its unique ID including associated questions.
   * 
   * @param {number} id - The unique identifier of the game
   * @returns {Promise<Game | null>} Promise resolving to the game entity with questions or null if not found
   */
  findByIdWithQuestions(id: number): Promise<Game | null>;

  /**
   * Updates an existing game entity.
   * 
   * @param {Game} game - The game entity to update
   * @returns {Promise<Game>} Promise resolving to the updated game entity
   */
  update(game: Game): Promise<Game>;

  /**
   * Marks a game as ended by setting the end time.
   * 
   * @param {number} gameId - The ID of the game to end
   * @returns {Promise<void>} Promise that resolves when the game is marked as ended
   */
  endGame(gameId: number): Promise<void>;
}
