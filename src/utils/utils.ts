import Discord from 'discord.js';

export enum CommandType {
  BATTLE = '.전투정보',
  EVENT = '.이벤트',
}

export class Utils {
  /**
   * 메시지 정보를 기반으로 봇인지 아닌지 확인하는 메서드
   * 봇이 아닐 경우 true, 봇일 경우 false를 리턴한다.
   * @param authorType
   * @private
   */
  isNotBot(authorType: Discord.User): boolean {
    return authorType.bot ? false : true;
  }

  getCommand(content: string): string {
    const contents = content.split(' ');
    for (const command of Object.values(CommandType)) {
      if (command === contents[0]) {
        return command;
      }
    }
    return '';
  }
}
