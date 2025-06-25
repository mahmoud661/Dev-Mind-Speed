/**
 * @fileoverview Game service containing business logic for game operations.
 * Handles game creation, question generation, answer processing, and game ending.
 */

import { injectable, inject } from "tsyringe";
import { IPlayerRepo } from "../../Domain/interfaces/IPlayerRepo";
import { IGameRepo } from "../../Domain/interfaces/IGameRepo";
import { IQuestionRepo } from "../../Domain/interfaces/IQuestionRepo";
import { IAnswerRepo } from "../../Domain/interfaces/IAnswerRepo";
import { 
  StartGameResponse, 
  SubmitAnswerResponse, 
  EndGameResponse, 
  BestScore,
  GameHistory
} from "../../Domain/dtos/GameResponseDtos";

/**
 * Service class handling game business logic.
 * Manages game lifecycle, question generation, and score calculation.
 * 
 * @class GameService
 */
@injectable()
export class GameService {
  /**
   * Creates a new GameService instance with injected dependencies.
   * 
   * @param {IPlayerRepo} playerRepo - Repository for player operations
   * @param {IGameRepo} gameRepo - Repository for game operations  
   * @param {IQuestionRepo} questionRepo - Repository for question operations
   * @param {IAnswerRepo} answerRepo - Repository for answer operations
   */
  constructor(
    @inject("IPlayerRepo") private playerRepo: IPlayerRepo,
    @inject("IGameRepo") private gameRepo: IGameRepo,
    @inject("IQuestionRepo") private questionRepo: IQuestionRepo,
    @inject("IAnswerRepo") private answerRepo: IAnswerRepo
  ) {}

  /**
   * Generates a math question based on the specified difficulty level.
   * Creates mathematical expressions with appropriate complexity for each difficulty.
   * 
   * @private
   * @param {number} difficulty - Difficulty level (1-4)
   * @returns {{ question: string; answer: number }} Object containing question text and correct answer
   */
  private generateMathQuestion(difficulty: number): { question: string; answer: number } {
    const difficultyConfig = {
      1: { operands: 2, digits: 1 },
      2: { operands: 3, digits: 2 },
      3: { operands: 4, digits: 3 },
      4: { operands: 5, digits: 4 }
    };

    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];
    const operations = ['+', '-', '*', '/'];
    
    let expression = '';
    const numbers: number[] = [];
    
    // Generate first number
    const firstNumber = this.generateRandomNumber(config.digits);
    numbers.push(firstNumber);
    expression = firstNumber.toString();
    
    // Generate remaining operands and operations
    for (let i = 1; i < config.operands; i++) {
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let nextNumber = this.generateRandomNumber(config.digits);
      
      // Avoid division by zero and ensure integer results for division
      if (operation === '/') {
        // Make sure we don't divide by zero and result is integer
        if (i === 1) {
          nextNumber = Math.max(1, nextNumber);
          // Make first number divisible by nextNumber for cleaner results
          numbers[0] = numbers[0] * nextNumber;
          expression = numbers[0].toString();
        } else {
          nextNumber = Math.max(1, nextNumber);
        }
      }
      
      numbers.push(nextNumber);
      expression += ` ${operation} ${nextNumber}`;
    }
    
    // Calculate the result
    const result = this.evaluateExpression(expression);
    
    return {
      question: expression,
      answer: Math.round(result * 100) / 100 // Round to 2 decimal places
    };
  }

  /**
   * Generates a random number with the specified number of digits.
   * 
   * @private
   * @param {number} digits - Number of digits for the generated number
   * @returns {number} Random number with the specified digit count
   */
  private generateRandomNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Evaluates a mathematical expression string and returns the result.
   * Note: In production, use a proper math expression parser for security.
   * 
   * @private
   * @param {string} expression - Mathematical expression to evaluate
   * @returns {number} Result of the mathematical expression
   */
  private evaluateExpression(expression: string): number {
    // Simple math expression evaluator
    // Note: In production, use a proper math expression parser for security
    return Function(`"use strict"; return (${expression})`)();
  }

  /**
   * Starts a new game for the specified player.
   * Creates or finds player, creates game session, and generates first question.
   * 
   * @async
   * @param {string} name - Name of the player starting the game
   * @param {number} difficulty - Difficulty level (1-4)
   * @returns {Promise<StartGameResponse>} Promise resolving to game start response
   * @throws {Error} When game creation fails
   */
  async startGame(name: string, difficulty: number): Promise<StartGameResponse> {
    // Find or create player
    let player = await this.playerRepo.findByName(name);
    if (!player) {
      player = await this.playerRepo.create(name);
    }

    // Create new game
    const game = await this.gameRepo.create(player.playerId, difficulty);

    // Generate first question
    const { question, answer } = this.generateMathQuestion(difficulty);
    await this.questionRepo.create(game.gameId, question, answer, 1);

    return {
      message: `Hello ${name}, find your submit API URL below`,
      submit_url: `/game/${game.gameId}/submit`,
      question: question,
      time_started: game.startTime
    };
  }

  /**
   * Processes a player's answer submission for the current question.
   * Validates answer, calculates timing, updates scores, and generates next question if applicable.
   * 
   * @async
   * @param {number} gameId - ID of the game session
   * @param {number} playerAnswer - Numerical answer provided by the player
   * @returns {Promise<SubmitAnswerResponse>} Promise resolving to answer submission response
   * @throws {Error} When game not found, game ended, or no unanswered questions
   */
  async submitAnswer(gameId: number, playerAnswer: number): Promise<SubmitAnswerResponse> {
    const game = await this.gameRepo.findByIdWithQuestions(gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.endTime) {
      throw new Error("Cannot submit answers for an ended game");
    }

    // Get all questions for this game
    const questions = await this.questionRepo.findByGameIdWithAnswers(gameId);
    
    // Find the current question (the one without an answer)
    const currentQuestion = questions.find(q => q.answers.length === 0);
    if (!currentQuestion) {
      throw new Error("No unanswered questions found");
    }

    // Calculate time taken
    let timeTaken: number;
    const previousAnswers = await this.answerRepo.findByGameId(gameId);
    
    if (previousAnswers.length === 0) {
      // First answer - calculate from game start time
      timeTaken = (Date.now() - game.startTime.getTime()) / 1000;
    } else {
      // Calculate from last answer submission
      const lastAnswer = previousAnswers[previousAnswers.length - 1];
      timeTaken = (Date.now() - lastAnswer.submittedAt.getTime()) / 1000;
    }

    // Check if answer is correct
    const isCorrect = Math.abs(playerAnswer - currentQuestion.correctAnswer) < 0.01;

    // Save the answer
    await this.answerRepo.create(currentQuestion.questionId, playerAnswer, timeTaken, isCorrect);

    // Update game score and total time
    const totalAnswers = previousAnswers.length + 1;
    const correctAnswers = previousAnswers.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
    
    game.currentScore = correctAnswers / totalAnswers;
    game.totalTimeSpent += timeTaken;
    await this.gameRepo.update(game);

    const result = isCorrect 
      ? `Good job ${game.player.name}, your answer is correct!` 
      : `Sorry ${game.player.name}, your answer is incorrect.`;

    const response: SubmitAnswerResponse = {
      result,
      time_taken: Math.round(timeTaken * 100) / 100,
      current_score: `${correctAnswers}/${totalAnswers}`
    };

    // Generate next question if game hasn't reached a limit (let's say 10 questions max)
    if (totalAnswers < 10) {
      const { question, answer } = this.generateMathQuestion(game.difficulty);
      await this.questionRepo.create(gameId, question, answer, totalAnswers + 1);
      
      response.next_question = {
        submit_url: `/game/${gameId}/submit`,
        question: question
      };
    }

    return response;
  }

  /**
   * Ends a game session and calculates final statistics.
   * Computes scores, identifies best performance, and compiles game history.
   * 
   * @async
   * @param {number} gameId - ID of the game session to end
   * @returns {Promise<EndGameResponse>} Promise resolving to game end response with statistics
   * @throws {Error} When game not found
   */
  async endGame(gameId: number): Promise<EndGameResponse> {
    const game = await this.gameRepo.findByIdWithQuestions(gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    // End the game
    await this.gameRepo.endGame(gameId);

    // Get all questions with answers
    const questions = await this.questionRepo.findByGameIdWithAnswers(gameId);
    const allAnswers = await this.answerRepo.findByGameId(gameId);

    // Calculate statistics
    const correctAnswers = allAnswers.filter(a => a.isCorrect).length;
    const totalAnswers = allAnswers.length;
    
    // Find best score (fastest correct answer)
    const correctAnswersWithTime = allAnswers.filter(a => a.isCorrect);
    let bestScore: BestScore;
    
    if (correctAnswersWithTime.length > 0) {
      const fastestAnswer = correctAnswersWithTime.reduce((fastest, current) => 
        current.timeTaken < fastest.timeTaken ? current : fastest
      );
      
      const bestQuestion = questions.find(q => 
        q.answers.some(a => a.answerId === fastestAnswer.answerId)
      );
      
      bestScore = {
        question: bestQuestion?.questionText || "",
        answer: bestQuestion?.correctAnswer || 0,
        time_taken: Math.round(fastestAnswer.timeTaken * 100) / 100
      };
    } else {
      bestScore = {
        question: "No correct answers",
        answer: 0,
        time_taken: 0
      };
    }

    // Build history
    const history: GameHistory[] = questions.map(question => {
      const answer = question.answers[0]; // Should only be one answer per question
      return {
        question: question.questionText,
        player_answer: answer?.playerAnswer || 0,
        correct_answer: question.correctAnswer,
        is_correct: answer?.isCorrect || false,
        time_taken: Math.round((answer?.timeTaken || 0) * 100) / 100
      };
    }).filter(h => h.player_answer !== 0); // Only include answered questions

    return {
      name: game.player.name,
      difficulty: game.difficulty,
      current_score: `${correctAnswers}/${totalAnswers}`,
      total_time_spent: Math.round(game.totalTimeSpent * 100) / 100,
      best_score: bestScore,
      history
    };
  }
}
