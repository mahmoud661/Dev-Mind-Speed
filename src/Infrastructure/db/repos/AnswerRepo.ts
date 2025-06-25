/**
 * @fileoverview Answer repository implementation using TypeORM.
 * Provides data access operations for Answer entities.
 */

import { injectable } from "tsyringe";
import { Answer } from "../../../Domain/entities/answer.entity";
import { IAnswerRepo } from "../../../Domain/interfaces/IAnswerRepo";
import { AppDataSource } from "../init-db";

/**
 * TypeORM implementation of the Answer repository.
 * Handles database operations for Answer entities.
 * 
 * @class AnswerRepo
 * @implements {IAnswerRepo}
 */
@injectable()
export class AnswerRepo implements IAnswerRepo {
  /**
   * TypeORM repository instance for Answer entity.
   * 
   * @private
   * @type {Repository<Answer>}
   */
  private _answerRepo;

  /**
   * Creates a new AnswerRepo instance.
   * Initializes the TypeORM repository for Answer entity.
   */
  constructor() {
    this._answerRepo = AppDataSource.getRepository(Answer);
  }

  /**
   * Creates a new answer for the specified question.
   * 
   * @param {number} questionId - The ID of the question being answered
   * @param {number} playerAnswer - The numerical answer provided by the player
   * @param {number} timeTaken - Time taken to answer in seconds
   * @param {boolean} isCorrect - Whether the answer is correct
   * @returns {Promise<Answer>} Promise resolving to the created answer entity
   */
  async create(questionId: number, playerAnswer: number, timeTaken: number, isCorrect: boolean): Promise<Answer> {
    const answer = this._answerRepo.create({ 
      questionId, 
      playerAnswer, 
      timeTaken, 
      isCorrect 
    });
    return await this._answerRepo.save(answer);
  }

  /**
   * Finds an answer by its unique ID with question relation.
   * 
   * @param {number} id - The unique identifier of the answer
   * @returns {Promise<Answer | null>} Promise resolving to the answer entity or null if not found
   */
  async findById(id: number): Promise<Answer | null> {
    return await this._answerRepo.findOne({ 
      where: { answerId: id },
      relations: ['question']
    });
  }

  /**
   * Finds all answers for a specific question.
   * 
   * @param {number} questionId - The ID of the question to find answers for
   * @returns {Promise<Answer[]>} Promise resolving to an array of answer entities
   */
  async findByQuestionId(questionId: number): Promise<Answer[]> {
    return await this._answerRepo.find({ where: { questionId } });
  }

  /**
   * Finds all answers for questions within a specific game using query builder.
   * 
   * @param {number} gameId - The ID of the game to find answers for
   * @returns {Promise<Answer[]>} Promise resolving to an array of answer entities
   */
  async findByGameId(gameId: number): Promise<Answer[]> {
    return await this._answerRepo
      .createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('question.gameId = :gameId', { gameId })
      .getMany();
  }
}
