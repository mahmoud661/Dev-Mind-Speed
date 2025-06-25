/**
 * @fileoverview Question repository interface defining data access operations for questions.
 * Provides contract for question-related database operations.
 */

import { Question } from "../entities/question.entity";

/**
 * Interface defining question repository operations.
 * Provides methods for creating, finding, and managing question entities.
 * 
 * @interface IQuestionRepo
 */
export interface IQuestionRepo {
  /**
   * Creates a new question for the specified game.
   * 
   * @param {number} gameId - The ID of the game this question belongs to
   * @param {string} questionText - The text content of the math question
   * @param {number} correctAnswer - The correct numerical answer
   * @param {number} questionOrder - The order of this question in the game sequence
   * @returns {Promise<Question>} Promise resolving to the created question entity
   */
  create(gameId: number, questionText: string, correctAnswer: number, questionOrder: number): Promise<Question>;

  /**
   * Finds a question by its unique ID.
   * 
   * @param {number} id - The unique identifier of the question
   * @returns {Promise<Question | null>} Promise resolving to the question entity or null if not found
   */
  findById(id: number): Promise<Question | null>;

  /**
   * Finds all questions for a specific game, ordered by question order.
   * 
   * @param {number} gameId - The ID of the game to find questions for
   * @returns {Promise<Question[]>} Promise resolving to an array of question entities
   */
  findByGameId(gameId: number): Promise<Question[]>;

  /**
   * Finds all questions for a specific game including their associated answers.
   * 
   * @param {number} gameId - The ID of the game to find questions for
   * @returns {Promise<Question[]>} Promise resolving to an array of question entities with answers
   */
  findByGameIdWithAnswers(gameId: number): Promise<Question[]>;
}
