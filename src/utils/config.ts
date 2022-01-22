export interface DiscordProps {
  token: string;
}

export class Config {
  getDiscordConfig(): DiscordProps {
    const envList = ['DISCORD_TOKEN'];
    for (const env of envList) {
      if (!process.env[env]) throw new Error(`invalid env => ${env}`);
    }
    return {
      token: process.env.discord_token!,
    };
  }
}
