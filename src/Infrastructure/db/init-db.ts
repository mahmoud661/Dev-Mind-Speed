import "reflect-metadata";
import { DataSource } from "typeorm";
import { Player } from "../../Domain/entities/player.entity";
import { Game } from "../../Domain/entities/game.entity";
import { Question } from "../../Domain/entities/question.entity";
import { Answer } from "../../Domain/entities/answer.entity";
import dotenv from "dotenv";
dotenv.config();

// Database configuration
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dev_mind_speed",
  synchronize: process.env.NODE_ENV !== "production", // Auto-sync schema in development
  logging: process.env.NODE_ENV === "development" ? ["error", "warn"] : false,
  entities: [
    Player,
    Game,
    Question,
    Answer
  ],
});

// Create database if it doesn't exist
async function createDatabaseIfNotExists(): Promise<void> {
  const dbName = process.env.DB_NAME || "dev_mind_speed";
  
  // Create a temporary connection without specifying database
  const tempDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "123456",
  });

  try {
    console.log("Creating database if it doesn't exist...");
    await tempDataSource.initialize();
    
    // Create database if it doesn't exist
    await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created or already exists`);
    
    await tempDataSource.destroy();
  } catch (error) {
    console.error("❌ Error creating database:", error);
    if (tempDataSource.isInitialized) {
      await tempDataSource.destroy();
    }
    throw error;
  }
}

// Initialize database connection
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("Initializing database connection...");
    
    // First, create the database if it doesn't exist
    await createDatabaseIfNotExists();
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connection established successfully");
    } else {
      console.log("✅ Database connection already established");
    }
    
    // Run migrations if needed
    if (process.env.NODE_ENV !== "production") {
      console.log("Running database synchronization...");
      await AppDataSource.synchronize();
      console.log("✅ Database schema synchronized");
    }
    
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Close database connection
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ Database connection closed");
    }
  } catch (error) {
    console.error("❌ Error closing database:", error);
    throw error;
  }
}

// Get repository for an entity
export function getRepository<T>(entity: new () => T) {
  return AppDataSource.getRepository(entity);
}
