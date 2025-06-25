/**
 * @fileoverview Game controller handling HTTP requests for game operations.
 * Processes requests, delegates to service layer, and formats responses.
 */

import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { GameService } from "../../App/services/Game.service";

/**
 * Controller class handling game-related HTTP requests.
 * Processes requests, validates parameters, and delegates business logic to GameService.
 * 
 * @class GameController
 */
@injectable()
export class GameController {
  /**
   * Creates a new GameController instance with injected dependencies.
   * 
   * @param {GameService} gameService - Service for game business logic
   */
  constructor(
    @inject(GameService) private gameService: GameService
  ) {}

  /**
   * Handles POST /game/start requests to start a new game.
   * Creates a new game session for the player with specified difficulty.
   * 
   * @async
   * @param {Request} req - Express request object containing player name and difficulty
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Promise that resolves when response is sent
   */
  async startGame(req: Request, res: Response): Promise<void> {
    try {
      // req.body is already validated and sanitized by middleware
      const { name, difficulty } = req.body;

      const result = await this.gameService.startGame(name, difficulty);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error starting game:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Handles POST /game/:gameId/submit requests to submit an answer.
   * Processes player's answer submission and returns feedback with next question if applicable.
   * 
   * @async
   * @param {Request} req - Express request object containing game ID and answer
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Promise that resolves when response is sent
   */
  async submitAnswer(req: Request, res: Response): Promise<void> {
    try {
      const gameId = parseInt(req.params.gameId);
      if (isNaN(gameId)) {
        res.status(400).json({ error: "Invalid game ID" });
        return;
      }

      // req.body is already validated and sanitized by middleware
      const { answer } = req.body;

      const result = await this.gameService.submitAnswer(gameId, answer);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error submitting answer:", error);
      
      if (error instanceof Error) {
        if (error.message === "Game not found") {
          res.status(404).json({ error: "Game not found" });
          return;
        }
        if (error.message === "Cannot submit answers for an ended game") {
          res.status(400).json({ error: "Cannot submit answers for an ended game" });
          return;
        }
        if (error.message === "No unanswered questions found") {
          res.status(400).json({ error: "No unanswered questions found" });
          return;
        }
      }

      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Handles GET /game/:gameId/end requests to end a game session.
   * Ends the game and returns final statistics including scores and history.
   * 
   * @async
   * @param {Request} req - Express request object containing game ID
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Promise that resolves when response is sent
   */
  async endGame(req: Request, res: Response): Promise<void> {
    try {
      const gameId = parseInt(req.params.gameId);
      if (isNaN(gameId)) {
        res.status(400).json({ error: "Invalid game ID" });
        return;
      }

      const result = await this.gameService.endGame(gameId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error ending game:", error);
      
      if (error instanceof Error && error.message === "Game not found") {
        res.status(404).json({ error: "Game not found" });
        return;
      }

      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}
