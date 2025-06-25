/**
 * @fileoverview Player repository implementation using TypeORM.
 * Provides data access operations for Player entities.
 */

import { injectable } from "tsyringe";
import { Player } from "../../../Domain/entities/player.entity";
import { IPlayerRepo } from "../../../Domain/interfaces/IPlayerRepo";
import { AppDataSource } from "../init-db";

/**
 * TypeORM implementation of the Player repository.
 * Handles database operations for Player entities.
 * 
 * @class PlayerRepo
 * @implements {IPlayerRepo}
 */
@injectable()
export class PlayerRepo implements IPlayerRepo {
  /**
   * TypeORM repository instance for Player entity.
   * 
   * @private
   * @type {Repository<Player>}
   */
  private _playerRepo;

  /**
   * Creates a new PlayerRepo instance.
   * Initializes the TypeORM repository for Player entity.
   */
  constructor() {
    this._playerRepo = AppDataSource.getRepository(Player);
  }

  /**
   * Creates a new player with the specified name.
   * 
   * @param {string} name - The name of the player to create
   * @returns {Promise<Player>} Promise resolving to the created player entity
   */
  async create(name: string): Promise<Player> {
    const player = this._playerRepo.create({ name });
    return await this._playerRepo.save(player);
  }

  /**
   * Finds a player by their unique ID.
   * 
   * @param {number} id - The unique identifier of the player
   * @returns {Promise<Player | null>} Promise resolving to the player entity or null if not found
   */
  async findById(id: number): Promise<Player | null> {
    return await this._playerRepo.findOne({ where: { playerId: id } });
  }

  /**
   * Finds a player by their name.
   * 
   * @param {string} name - The name of the player to find
   * @returns {Promise<Player | null>} Promise resolving to the player entity or null if not found
   */
  async findByName(name: string): Promise<Player | null> {
    return await this._playerRepo.findOne({ where: { name } });
  }
}
