import { IsString, IsInt, Min, Max } from "class-validator";

export class StartGameDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  @Max(4)
  difficulty!: number;
}
