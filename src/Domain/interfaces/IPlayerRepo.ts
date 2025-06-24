import { Player } from "../entities/player.entity";

export interface IPlayerRepo {
  create(name: string): Promise<Player>;
  findById(id: number): Promise<Player | null>;
  findByName(name: string): Promise<Player | null>;
}
