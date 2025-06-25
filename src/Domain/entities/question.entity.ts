/**
 * @fileoverview Question entity representing math questions in game sessions.
 * Manages question content, correct answers, and relationships with games and player answers.
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
import { Game } from "./game.entity";
import { Answer } from "./answer.entity";

/**
 * Question entity representing a math question within a game.
 * Contains question text, correct answer, ordering, and relationships with games and answers.
 * 
 * @class Question
 * @extends {BaseEntity}
 */
@Entity("questions")
export class Question extends BaseEntity {
  /**
   * Unique identifier for the question.
   * Auto-generated primary key.
   * 
   * @type {number}
   */
  @PrimaryGeneratedColumn({ name: "question_id" })
  questionId!: number;

  /**
   * Foreign key referencing the game this question belongs to.
   * 
   * @type {number}
   */
  @Column({ name: "game_id", type: "integer", nullable: false })
  gameId!: number;

  /**
   * The text content of the math question.
   * Contains the mathematical expression to be solved.
   * 
   * @type {string}
   */
  @Column({ name: "question_text", type: "text", nullable: false })
  questionText!: string;

  /**
   * The correct numerical answer to the question.
   * Used to validate player submissions.
   * 
   * @type {number}
   */
  @Column({ name: "correct_answer", type: "numeric", nullable: false })
  correctAnswer!: number;

  /**
   * The order of this question within the game sequence.
   * Used to maintain question ordering for players.
   * 
   * @type {number}
   */
  @Column({ name: "question_order", type: "integer", nullable: false })
  questionOrder!: number;

  /**
   * The game that this question belongs to.
   * Many-to-one relationship with Game entity.
   * 
   * @type {Game}
   */
  @ManyToOne(() => Game, (game) => game.questions)
  @JoinColumn({ name: "game_id" })
  game!: Game;

  /**
   * All player answers submitted for this question.
   * One-to-many relationship with Answer entity.
   * 
   * @type {Answer[]}
   */
  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[];
}

