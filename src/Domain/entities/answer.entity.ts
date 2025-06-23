import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Question } from "./question.entity";

@Entity("answers")
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "answer_id" })
  answerId!: number;

  @Column({ name: "question_id", type: "integer", nullable: false })
  questionId!: number;

  @Column({ name: "player_answer", type: "numeric", nullable: false })
  playerAnswer!: number;

  @Column({ name: "time_taken", type: "numeric", nullable: false })
  timeTaken!: number;

  @Column({ name: "is_correct", type: "boolean", nullable: false })
  isCorrect!: boolean;

  @Column({ name: "submitted_at", type: "timestamp", default: () => "now()", nullable: false })
  submittedAt!: Date;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: "question_id" })
  question!: Question;
}

