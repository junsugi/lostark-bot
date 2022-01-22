export interface IDiscordController {
  login(): Promise<void>;
  listen(): void;
}
