/**
 * @fileoverview Answer entity representing player responses to questions.
 * Tracks player answers, timing, correctness, and relationships with questions.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Question } from "./question.entity";

/**
 * Answer entity representing a player's response to a question.
 * Records the player's answer, timing information, correctness, and submission timestamp.
 * 
 * @class Answer
 * @extends {BaseEntity}
 */
@Entity("answers")
export class Answer extends BaseEntity {
  /**
   * Unique identifier for the answer.
   * Auto-generated primary key.
   * 
   * @type {number}
   */
  @PrimaryGeneratedColumn({ name: "answer_id" })
  answerId!: number;

  /**
   * Foreign key referencing the question this answer responds to.
   * 
   * @type {number}
   */
  @Column({ name: "question_id", type: "integer", nullable: false })
  questionId!: number;

  /**
   * The numerical answer provided by the player.
   * 
   * @type {number}
   */
  @Column({ name: "player_answer", type: "numeric", nullable: false })
  playerAnswer!: number;

  /**
   * Time taken by the player to answer the question in seconds.
   * Measured from question presentation to answer submission.
   * 
   * @type {number}
   */
  @Column({ name: "time_taken", type: "numeric", nullable: false })
  timeTaken!: number;

  /**
   * Whether the player's answer is correct.
   * Determined by comparing player answer with the question's correct answer.
   * 
   * @type {boolean}
   */
  @Column({ name: "is_correct", type: "boolean", nullable: false })
  isCorrect!: boolean;

  /**
   * Timestamp when the answer was submitted.
   * Automatically set to current time when answer is created.
   * 
   * @type {Date}
   */
  @Column({ name: "submitted_at", type: "timestamp", default: () => "now()", nullable: false })
  submittedAt!: Date;

  /**
   * The question that this answer responds to.
   * Many-to-one relationship with Question entity.
   * 
   * @type {Question}
   */
  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: "question_id" })
  question!: Question;
}

