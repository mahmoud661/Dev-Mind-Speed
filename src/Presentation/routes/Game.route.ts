/**
 * @fileoverview Game route handler defining HTTP endpoints for game operations.
 * Provides REST API endpoints for starting games, submitting answers, and ending games.
 */

import { container } from "tsyringe";
import { BaseRoute } from "./base-route";
import { GameController } from "../controllers/Game.controller";
import { 
  validationMiddleware, 
  sanitizeInputMiddleware, 
  emptyValueMiddleware 
} from "../middlewares";
import { StartGameDto } from "../../Domain/dtos/StartGameDto";
import { SubmitAnswerDto } from "../../Domain/dtos/SubmitAnswerDto";

/**
 * Route class handling game-related HTTP endpoints.
 * Defines routes for game lifecycle operations with appropriate middleware.
 * 
 * @class GameRoute
 * @extends {BaseRoute}
 */
export class GameRoute extends BaseRoute {
  /**
   * Base path for all game-related endpoints.
   * 
   * @type {string}
   * @public
   */
  public path = "/game";
  
  /**
   * Initializes game route endpoints with middleware and controller bindings.
   * Sets up routes for starting games, submitting answers, and ending games.
   * 
   * @protected
   * @returns {void}
   */
  protected initRoutes(): void {
    const controller = container.resolve(GameController);

    // POST /game/start - Start a new game
    this.router.post("/start", 
      sanitizeInputMiddleware,
      emptyValueMiddleware,
      validationMiddleware(StartGameDto),
      controller.startGame.bind(controller)
    );

    // POST /game/:gameId/submit - Submit an answer to the current question
    this.router.post("/:gameId/submit",
      sanitizeInputMiddleware,
      emptyValueMiddleware,
      validationMiddleware(SubmitAnswerDto),
      controller.submitAnswer.bind(controller)
    );

    // GET /game/:gameId/end - End a game and get final results
    this.router.get("/:gameId/end", controller.endGame.bind(controller));
  }
}
