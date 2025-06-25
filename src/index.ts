/**
 * @fileoverview Main entry point for the Dev Mind Speed application.
 * This file initializes the database, registers dependencies, and starts the Express server.
 */

import "reflect-metadata";
import { AppServer } from "./Presentation";
import { initializeDatabase, closeDatabase } from "./Infrastructure/db/init-db";
import { registerDependencies } from "./Infrastructure/db/container";

/**
 * Starts the Dev Mind Speed application.
 * Initializes database connection, registers dependencies, and starts the HTTP server.
 * 
 * @async
 * @function startApplication
 * @returns {Promise<void>} Promise that resolves when the application is started
 * @throws {Error} When application fails to start
 */
async function startApplication() {
  try {
    console.log("🚀 Starting Dev Mind Speed application...");

    // Initialize database connection
    await initializeDatabase();

    // Register dependencies
    await registerDependencies();

    // Create and start the server
    const app = new AppServer();

    const PORT = process.env.PORT || 3000;

    await app.listen(Number(PORT));
  } catch (error) {
    console.error("❌ Error starting the application:", error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler for SIGTERM signal.
 * Closes database connection and exits the process cleanly.
 */
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await closeDatabase();
  process.exit(0);
});

/**
 * Graceful shutdown handler for SIGINT signal (Ctrl+C).
 * Closes database connection and exits the process cleanly.
 */
process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  await closeDatabase();
  process.exit(0);
});

// Start the application
startApplication();

