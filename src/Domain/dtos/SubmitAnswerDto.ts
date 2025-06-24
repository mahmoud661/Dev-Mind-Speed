import { IsNumber } from "class-validator";

export class SubmitAnswerDto {
  @IsNumber()
  answer!: number;
}
