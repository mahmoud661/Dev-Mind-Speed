import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Game } from "./game.entity";

@Entity("players")
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "player_id" })
  playerId!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @OneToMany(() => Game, (game) => game.player)
  games!: Game[];
}

