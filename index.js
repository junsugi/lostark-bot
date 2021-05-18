const Discord = require('discord.js');
const client = new Discord.Client();
const lostArk = require("./lostArk.js");
const config = require("./config.json");
// initialized
client.once('ready', () => {
	console.log('Ready!');
});

// 로그인 토큰
client.login(config.token);

// 메시지 대기
client.on('message', message => {
	console.log(message.content);
	const messageArr = message.content.split("")
	try{
		if(messageArr[0].match("!")){
			const userName = message.content.replace("!", "");
			message.channel.send(userName+"님의 정보입니다.");
			lostArk.getUserInfo(userName).then((data) => {
				// description 생성
				const userInfo = createDescription(data);
				const embed = new Discord.MessageEmbed().setDescription(userInfo);
				message.channel.send(embed);
			});
		}
	} catch (error){
	}
});

function createDescription(data){
	console.log(data);
	let body1 = "[ 기 본 정 보 ]\n";
	body1 = body1 + `- 캐릭터명 : ${data['userName']}\n`;
	body1 = body1 + `- 서 버 명 : ${data['server']}\n`;
	body1 = body1 + `- 직    업 : ${data['job']}\n`;
	body1 = body1 + `- 길    드 : ${data['guild']}\n`;
	body1 = body1 + `- 칭    호 : ${data['title']}\n`;
	return body1;
}