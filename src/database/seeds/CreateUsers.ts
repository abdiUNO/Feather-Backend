import { User } from '../../entity/user.entity';
import { Seed, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export class CreateUsers implements Seed {
  constructor() {}

  public async seed(factory: Factory, connection: Connection): Promise<any> {
    await factory(User)().seedMany(10);
  }
}
