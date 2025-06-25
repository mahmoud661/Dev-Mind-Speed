/**
 * @fileoverview Question repository implementation using TypeORM.
 * Provides data access operations for Question entities.
 */

import { injectable } from "tsyringe";
import { Question } from "../../../Domain/entities/question.entity";
import { IQuestionRepo } from "../../../Domain/interfaces/IQuestionRepo";
import { AppDataSource } from "../init-db";

/**
 * TypeORM implementation of the Question repository.
 * Handles database operations for Question entities.
 * 
 * @class QuestionRepo
 * @implements {IQuestionRepo}
 */
@injectable()
export class QuestionRepo implements IQuestionRepo {
  /**
   * TypeORM repository instance for Question entity.
   * 
   * @private
   * @type {Repository<Question>}
   */
  private _questionRepo;

  /**
   * Creates a new QuestionRepo instance.
   * Initializes the TypeORM repository for Question entity.
   */
  constructor() {
    this._questionRepo = AppDataSource.getRepository(Question);
  }

  /**
   * Creates a new question for the specified game.
   * 
   * @param {number} gameId - The ID of the game this question belongs to
   * @param {string} questionText - The text content of the math question
   * @param {number} correctAnswer - The correct numerical answer
   * @param {number} questionOrder - The order of this question in the game sequence
   * @returns {Promise<Question>} Promise resolving to the created question entity
   */
  async create(gameId: number, questionText: string, correctAnswer: number, questionOrder: number): Promise<Question> {
    const question = this._questionRepo.create({ 
      gameId, 
      questionText, 
      correctAnswer, 
      questionOrder 
    });
    return await this._questionRepo.save(question);
  }

  /**
   * Finds a question by its unique ID with game and answers relations.
   * 
   * @param {number} id - The unique identifier of the question
   * @returns {Promise<Question | null>} Promise resolving to the question entity or null if not found
   */
  async findById(id: number): Promise<Question | null> {
    return await this._questionRepo.findOne({ 
      where: { questionId: id },
      relations: ['game', 'answers']
    });
  }

  /**
   * Finds all questions for a specific game, ordered by question order.
   * 
   * @param {number} gameId - The ID of the game to find questions for
   * @returns {Promise<Question[]>} Promise resolving to an array of question entities
   */
  async findByGameId(gameId: number): Promise<Question[]> {
    return await this._questionRepo.find({ 
      where: { gameId },
      order: { questionOrder: 'ASC' }
    });
  }

  /**
   * Finds all questions for a specific game including their associated answers.
   * 
   * @param {number} gameId - The ID of the game to find questions for
   * @returns {Promise<Question[]>} Promise resolving to an array of question entities with answers
   */
  async findByGameIdWithAnswers(gameId: number): Promise<Question[]> {
    return await this._questionRepo.find({ 
      where: { gameId },
      relations: ['answers'],
      order: { questionOrder: 'ASC' }
    });
  }
}
