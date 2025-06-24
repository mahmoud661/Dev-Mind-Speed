import express, { Application } from "express";
import { container } from "tsyringe";
import { GameRoute } from "./routes/Game.route";

export class AppServer {
  private app: Application;
  private readonly prefix: string = "/api/v1";
  
  constructor() {
    this.app = express();
    this.initMiddleware();
    this.initRoutes();
  }

  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initRoutes() {
    const gameRoute = container.resolve(GameRoute);
    this.app.use(this.prefix + gameRoute.path, gameRoute.router);
    
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK", message: "Dev Mind Speed API is running" });
    });
  }

  public async listen(port: number): Promise<void> {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
