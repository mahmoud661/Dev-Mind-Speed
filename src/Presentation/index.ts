import express, { Application } from "express";

export class AppServer {
  private app: Application;
  private readonly prefix: string = "/api/v1";
  constructor() {
    this.app = express();
    this.initMiddleware();
  }

  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public async listen(port: number): Promise<void> {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
