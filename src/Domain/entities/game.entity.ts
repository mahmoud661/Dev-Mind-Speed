/**
 * @fileoverview Game entity representing individual game sessions.
 * Tracks game progress, timing, scoring, and relationships with players and questions.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Player } from "./player.entity";
import { Question } from "./question.entity";

/**
 * Game entity representing a single game session.
 * Contains game state, timing information, scores, and relationships with player and questions.
 * 
 * @class Game
 * @extends {BaseEntity}
 */
@Entity("games")
export class Game extends BaseEntity {
  /**
   * Unique identifier for the game session.
   * Auto-generated primary key.
   * 
   * @type {number}
   */
  @PrimaryGeneratedColumn({ name: "game_id" })
  gameId!: number;

  /**
   * Foreign key referencing the player who started this game.
   * 
   * @type {number}
   */
  @Column({ name: "player_id", type: "integer", nullable: false })
  playerId!: number;

  /**
   * Difficulty level of the game (1-4).
   * Determines the complexity of generated questions.
   * 
   * @type {number}
   */
  @Column({ type: "integer", nullable: false })
  difficulty!: number;

  /**
   * Timestamp when the game was started.
   * Automatically set to current time when game is created.
   * 
   * @type {Date}
   */
  @Column({ name: "start_time", type: "timestamp", default: () => "now()", nullable: false })
  startTime!: Date;

  /**
   * Timestamp when the game was ended.
   * Null if the game is still in progress.
   * 
   * @type {Date | undefined}
   */
  @Column({ name: "end_time", type: "timestamp", nullable: true })
  endTime?: Date;

  /**
   * Current score of the game as a percentage (0.00-1.00).
   * Calculated as correct answers divided by total answers.
   * 
   * @type {number}
   */
  @Column({ name: "current_score", type: "numeric", precision: 5, scale: 2, default: 0.00 })
  currentScore!: number;

  /**
   * Total time spent on the game in seconds.
   * Cumulative time across all answered questions.
   * 
   * @type {number}
   */
  @Column({ name: "total_time_spent", type: "numeric", default: 0.00 })
  totalTimeSpent!: number;

  /**
   * The player who is playing this game.
   * Many-to-one relationship with Player entity.
   * 
   * @type {Player}
   */
  @ManyToOne(() => Player, (player) => player.games)
  @JoinColumn({ name: "player_id" })
  player!: Player;

  /**
   * All questions generated for this game.
   * One-to-many relationship with Question entity.
   * 
   * @type {Question[]}
   */
  @OneToMany(() => Question, (question) => question.game)
  questions!: Question[];
}

