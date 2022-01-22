import * as Discord from 'discord.js';
import { Config } from './utils/config';
import { DiscordController } from './ctrl/discord-controller';
import { DiscordService } from './service/discord-service';

export class DiscordMain {
  private readonly client: Discord.Client;

  constructor() {
    this.client = new Discord.Client();
  }

  async start() {
    const config = new Config();
    const discordConfig = config.getDiscordConfig();

    const discordService = new DiscordService();
    const discordController = new DiscordController(
      discordService,
      this.client,
      discordConfig,
    );
    await discordController.login();
    discordController.listen();
  }
}
