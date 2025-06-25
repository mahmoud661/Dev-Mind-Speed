/**
 * @fileoverview Data Transfer Object for starting a new game.
 * Defines the structure and validation rules for game start requests.
 */

import { IsString, IsInt, Min, Max } from "class-validator";

/**
 * DTO for starting a new game session.
 * Contains player name and difficulty level with validation constraints.
 * 
 * @class StartGameDto
 */
export class StartGameDto {
  /**
   * The name of the player starting the game.
   * Must be a non-empty string.
   * 
   * @type {string}
   */
  @IsString()
  name!: string;

  /**
   * The difficulty level for the game.
   * Must be an integer between 1 and 4 (inclusive).
   * 
   * @type {number}
   */
  @IsInt()
  @Min(1)
  @Max(4)
  difficulty!: number;
}
