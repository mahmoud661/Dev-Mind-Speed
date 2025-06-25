/**
 * @fileoverview Player repository interface defining data access operations for players.
 * Provides contract for player-related database operations.
 */

import { Player } from "../entities/player.entity";

/**
 * Interface defining player repository operations.
 * Provides methods for creating, finding, and managing player entities.
 * 
 * @interface IPlayerRepo
 */
export interface IPlayerRepo {
  /**
   * Creates a new player with the specified name.
   * 
   * @param {string} name - The name of the player to create
   * @returns {Promise<Player>} Promise resolving to the created player entity
   */
  create(name: string): Promise<Player>;

  /**
   * Finds a player by their unique ID.
   * 
   * @param {number} id - The unique identifier of the player
   * @returns {Promise<Player | null>} Promise resolving to the player entity or null if not found
   */
  findById(id: number): Promise<Player | null>;

  /**
   * Finds a player by their name.
   * 
   * @param {string} name - The name of the player to find
   * @returns {Promise<Player | null>} Promise resolving to the player entity or null if not found
   */
  findByName(name: string): Promise<Player | null>;
}
