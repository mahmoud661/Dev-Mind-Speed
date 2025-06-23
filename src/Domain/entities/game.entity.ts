import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Player } from "./player.entity";
import { Question } from "./question.entity";

@Entity("games")
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "game_id" })
  gameId!: number;

  @Column({ name: "player_id", type: "integer", nullable: false })
  playerId!: number;

  @Column({ type: "integer", nullable: false })
  difficulty!: number;

  @Column({ name: "start_time", type: "timestamp", default: () => "now()", nullable: false })
  startTime!: Date;

  @Column({ name: "end_time", type: "timestamp", nullable: true })
  endTime?: Date;

  @Column({ name: "current_score", type: "numeric", precision: 5, scale: 2, default: 0.00 })
  currentScore!: number;

  @Column({ name: "total_time_spent", type: "numeric", default: 0.00 })
  totalTimeSpent!: number;

  @ManyToOne(() => Player, (player) => player.games)
  @JoinColumn({ name: "player_id" })
  player!: Player;

  @OneToMany(() => Question, (question) => question.game)
  questions!: Question[];
}

