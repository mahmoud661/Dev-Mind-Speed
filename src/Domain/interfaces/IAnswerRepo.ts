/**
 * @fileoverview Answer repository interface defining data access operations for answers.
 * Provides contract for answer-related database operations.
 */

import { Answer } from "../entities/answer.entity";

/**
 * Interface defining answer repository operations.
 * Provides methods for creating, finding, and managing answer entities.
 * 
 * @interface IAnswerRepo
 */
export interface IAnswerRepo {
  /**
   * Creates a new answer for the specified question.
   * 
   * @param {number} questionId - The ID of the question being answered
   * @param {number} playerAnswer - The numerical answer provided by the player
   * @param {number} timeTaken - Time taken to answer in seconds
   * @param {boolean} isCorrect - Whether the answer is correct
   * @returns {Promise<Answer>} Promise resolving to the created answer entity
   */
  create(questionId: number, playerAnswer: number, timeTaken: number, isCorrect: boolean): Promise<Answer>;

  /**
   * Finds an answer by its unique ID.
   * 
   * @param {number} id - The unique identifier of the answer
   * @returns {Promise<Answer | null>} Promise resolving to the answer entity or null if not found
   */
  findById(id: number): Promise<Answer | null>;

  /**
   * Finds all answers for a specific question.
   * 
   * @param {number} questionId - The ID of the question to find answers for
   * @returns {Promise<Answer[]>} Promise resolving to an array of answer entities
   */
  findByQuestionId(questionId: number): Promise<Answer[]>;

  /**
   * Finds all answers for questions within a specific game.
   * 
   * @param {number} gameId - The ID of the game to find answers for
   * @returns {Promise<Answer[]>} Promise resolving to an array of answer entities
   */
  findByGameId(gameId: number): Promise<Answer[]>;
}
