import { injectable } from "tsyringe";
import { Player } from "../../../Domain/entities/player.entity";
import { IPlayerRepo } from "../../../Domain/interfaces/IPlayerRepo";
import { AppDataSource } from "../init-db";

@injectable()
export class PlayerRepo implements IPlayerRepo {
  private _playerRepo;

  constructor() {
    this._playerRepo = AppDataSource.getRepository(Player);
  }

  async create(name: string): Promise<Player> {
    const player = this._playerRepo.create({ name });
    return await this._playerRepo.save(player);
  }

  async findById(id: number): Promise<Player | null> {
    return await this._playerRepo.findOne({ where: { playerId: id } });
  }

  async findByName(name: string): Promise<Player | null> {
    return await this._playerRepo.findOne({ where: { name } });
  }
}
