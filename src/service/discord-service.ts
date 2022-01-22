import { IDiscordService } from '../interface/IDiscord-service';

export class DiscordService implements IDiscordService {
  getBattleStatus(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}
