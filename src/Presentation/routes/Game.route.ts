import { container } from "tsyringe";
import { BaseRoute } from "./base-route";
import { GameController } from "../../App/controllers/Game.controller";
import { 
  validationMiddleware, 
  sanitizeInputMiddleware, 
  emptyValueMiddleware 
} from "../../App/middlewares";
import { StartGameDto } from "../../Domain/dtos/StartGameDto";
import { SubmitAnswerDto } from "../../Domain/dtos/SubmitAnswerDto";

export class GameRoute extends BaseRoute {
  public path = "/game";
  
  protected initRoutes(): void {
    const controller = container.resolve(GameController);

    this.router.post("/start", 
      sanitizeInputMiddleware,
      emptyValueMiddleware,
      validationMiddleware(StartGameDto),
      controller.startGame.bind(controller)
    );

    this.router.post("/:gameId/submit",
      sanitizeInputMiddleware,
      emptyValueMiddleware,
      validationMiddleware(SubmitAnswerDto),
      controller.submitAnswer.bind(controller)
    );

    this.router.get("/:gameId/end", controller.endGame.bind(controller));
  }
}
