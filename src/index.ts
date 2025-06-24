import "reflect-metadata";
import { AppServer } from "./Presentation";
import { initializeDatabase, closeDatabase } from "./Infrastructure/db/init-db";
import { registerDependencies } from "./Infrastructure/db/container";

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
    console.log(`🌟 Server running on port ${PORT}`);
    
  } catch (error) {
    console.error("❌ Error starting the application:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await closeDatabase();  
  process.exit(0);
});

// Start the application
startApplication();
