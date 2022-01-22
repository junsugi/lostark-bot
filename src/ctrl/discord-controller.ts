import { IDiscordController } from '../interface/IDiscord-controller';
import { DiscordProps } from '../utils/config';
import * as Discord from 'discord.js';
import { IDiscordService } from '../interface/IDiscord-service';
import { CommandType, Utils } from '../utils/utils';

export class DiscordController implements IDiscordController {
  constructor(
    private readonly discordService: IDiscordService,
    private readonly client: Discord.Client,
    private readonly config: DiscordProps,
  ) {}

  async login(): Promise<void> {
    await this.client.login(this.config.token);
  }

  listen(): void {
    const utils = new Utils();
    this.client.once('ready', () => {
      console.log('discord lostArkBot start!');
    });

    this.client.on('message', async (message: Discord.Message) => {
      if (utils.isNotBot(message.author)) {
        const command = utils.getCommand(message.content);
        switch (command) {
          case CommandType.BATTLE:
            await this.discordService.getBattleStatus();
            break;
          case CommandType.EVENT:
            console.log('이벤트');
            break;
        }
      }
    });
  }
}
