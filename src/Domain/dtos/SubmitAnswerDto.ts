/**
 * @fileoverview Data Transfer Object for submitting an answer to a question.
 * Defines the structure and validation rules for answer submission requests.
 */

import { IsNumber } from "class-validator";

/**
 * DTO for submitting an answer to a game question.
 * Contains the numerical answer provided by the player.
 * 
 * @class SubmitAnswerDto
 */
export class SubmitAnswerDto {
  /**
   * The numerical answer provided by the player.
   * Must be a valid number.
   * 
   * @type {number}
   */
  @IsNumber()
  answer!: number;
}
