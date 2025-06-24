import { injectable } from "tsyringe";
import { Repository, DataSource } from "typeorm";
import { Player } from "../../../Domain/entities/player.entity";
import { IPlayerRepo } from "../../../Domain/interfaces/IPlayerRepo";

@injectable()
export class PlayerRepo implements IPlayerRepo {
  private repository: Repository<Player>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Player);
  }

  async create(name: string): Promise<Player> {
    const player = this.repository.create({ name });
    return await this.repository.save(player);
  }

  async findById(id: number): Promise<Player | null> {
    return await this.repository.findOne({ where: { playerId: id } });
  }

  async findByName(name: string): Promise<Player | null> {
    return await this.repository.findOne({ where: { name } });
  }
}
