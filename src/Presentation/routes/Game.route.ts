import { injectable, container } from "tsyringe";
import { BaseRoute } from "./base-route";
import { GameController } from "../../App/controllers/Game.controller";
import { 
  validationMiddleware, 
  sanitizeInputMiddleware, 
  emptyValueMiddleware 
} from "../../App/middlewares";
import { StartGameDto } from "../../Domain/dtos/StartGameDto";
import { SubmitAnswerDto } from "../../Domain/dtos/SubmitAnswerDto";

@injectable()
export class GameRoute extends BaseRoute {
  public path = "/game";
  private gameController: GameController;

  constructor() {
    super();
    this.gameController = container.resolve(GameController);
  }

  protected initRoutes(): void {
    // POST /game/start - Start a new game
    this.router.post("/start", 
      sanitizeInputMiddleware,
      emptyValueMiddleware,
      validationMiddleware(StartGameDto),
      (req, res) => {
        this.gameController.startGame(req, res);
      }
    );

    // POST /game/:gameId/submit - Submit an answer
    this.router.post("/:gameId/submit",
      sanitizeInputMiddleware,
      emptyValueMiddleware,
      validationMiddleware(SubmitAnswerDto),
      (req, res) => {
        this.gameController.submitAnswer(req, res);
      }
    );

    // GET /game/:gameId/end - End a game
    this.router.get("/:gameId/end", (req, res) => {
      this.gameController.endGame(req, res);
    });
  }
}
