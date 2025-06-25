/**
 * @fileoverview Player entity representing game players in the system.
 * Manages player information and their relationship with games.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Game } from "./game.entity";

/**
 * Player entity representing a game player.
 * Contains player identification and tracks all games played by the player.
 * 
 * @class Player
 * @extends {BaseEntity}
 */
@Entity("players")
export class Player extends BaseEntity {
  /**
   * Unique identifier for the player.
   * Auto-generated primary key.
   * 
   * @type {number}
   */
  @PrimaryGeneratedColumn({ name: "player_id" })
  playerId!: number;

  /**
   * Display name of the player.
   * Must be provided and cannot exceed 255 characters.
   * 
   * @type {string}
   */
  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  /**
   * All games played by this player.
   * One-to-many relationship with Game entity.
   * 
   * @type {Game[]}
   */
  @OneToMany(() => Game, (game) => game.player)
  games!: Game[];
}

