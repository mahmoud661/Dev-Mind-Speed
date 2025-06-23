import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Game } from "./game.entity";
import { Answer } from "./answer.entity";

@Entity("questions")
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "question_id" })
  questionId!: number;

  @Column({ name: "game_id", type: "integer", nullable: false })
  gameId!: number;

  @Column({ name: "question_text", type: "text", nullable: false })
  questionText!: string;

  @Column({ name: "correct_answer", type: "numeric", nullable: false })
  correctAnswer!: number;

  @Column({ name: "question_order", type: "integer", nullable: false })
  questionOrder!: number;

  @ManyToOne(() => Game, (game) => game.questions)
  @JoinColumn({ name: "game_id" })
  game!: Game;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[];
}

