import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { GameService } from "../services/Game.service";
import { StartGameDto } from "../../Domain/dtos/StartGameDto";
import { SubmitAnswerDto } from "../../Domain/dtos/SubmitAnswerDto";

@injectable()
export class GameController {
  constructor(
    @inject(GameService) private gameService: GameService
  ) {}

  async startGame(req: Request, res: Response): Promise<void> {
    try {
      const startGameDto = plainToClass(StartGameDto, req.body);
      const errors = await validate(startGameDto);

      if (errors.length > 0) {
        res.status(400).json({
          error: "Validation failed",
          details: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const result = await this.gameService.startGame(
        startGameDto.name,
        startGameDto.difficulty
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error starting game:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async submitAnswer(req: Request, res: Response): Promise<void> {
    try {
      const gameId = parseInt(req.params.gameId);
      if (isNaN(gameId)) {
        res.status(400).json({ error: "Invalid game ID" });
        return;
      }

      const submitAnswerDto = plainToClass(SubmitAnswerDto, req.body);
      const errors = await validate(submitAnswerDto);

      if (errors.length > 0) {
        res.status(400).json({
          error: "Validation failed",
          details: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const result = await this.gameService.submitAnswer(
        gameId,
        submitAnswerDto.answer
      );

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
