import { AppServer } from "./Presentation";

const app = new AppServer();

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT)).catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
