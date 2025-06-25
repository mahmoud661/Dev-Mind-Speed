/**
 * @fileoverview Database configuration and initialization for TypeORM.
 * Handles MySQL database connection, schema synchronization, and connection lifecycle.
 */

import "reflect-metadata";
import { DataSource } from "typeorm";
import { Player } from "../../Domain/entities/player.entity";
import { Game } from "../../Domain/entities/game.entity";
import { Question } from "../../Domain/entities/question.entity";
import { Answer } from "../../Domain/entities/answer.entity";
import dotenv from "dotenv";
dotenv.config();

/**
 * TypeORM DataSource configuration for MySQL database.
 * Configured with environment variables and entity classes.
 */
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

/**
 * Creates the database if it doesn't exist.
 * Uses a temporary connection without specifying database to create the target database.
 * 
 * @async
 * @function createDatabaseIfNotExists
 * @returns {Promise<void>} Promise that resolves when database is created or confirmed to exist
 * @throws {Error} When database creation fails
 */
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

/**
 * Initializes the database connection and synchronizes schema.
 * Creates database if it doesn't exist, establishes connection, and runs schema sync in development.
 * 
 * @async
 * @function initializeDatabase
 * @returns {Promise<void>} Promise that resolves when database is initialized
 * @throws {Error} When database initialization fails
 */
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

/**
 * Closes the database connection gracefully.
 * 
 * @async
 * @function closeDatabase
 * @returns {Promise<void>} Promise that resolves when database connection is closed
 * @throws {Error} When database closure fails
 */
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

/**
 * Gets a TypeORM repository for the specified entity.
 * 
 * @template T - The entity type
 * @param {new () => T} entity - The entity constructor
 * @returns {Repository<T>} TypeORM repository instance for the entity
 * @example
 * const playerRepo = getRepository(Player);
 */
export function getRepository<T>(entity: new () => T) {
  return AppDataSource.getRepository(entity);
}
