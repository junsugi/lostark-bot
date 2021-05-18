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
			message.channel.send(`[${userName}] 님의 정보입니다.`);
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
	let body1 = "[ 기 본 정 보 ]\n";
	body1 = body1 + `- 캐릭터명 : ${data['userName']}\n`;
	body1 = body1 + `- 서 버 명 : ${data['server']}\n`;
	body1 = body1 + `- 직    업 : ${data['job']}\n`;
	body1 = body1 + `- 길    드 : ${data['guild']}\n`;
	body1 = body1 + `- 칭    호 : ${data['title']}\n\n`;

	let body2 = "[ 레 벨 정 보 ]\n";
	body2 = body2 + `- 전투Lv : ${data['level']}\n`;
	body2 = body2 + `- 아이템Lv : ${data['itemLevel']}\n\n`;

	let body3 = "[ 원 정 대 영 지 ]\n";
	body3 = body3 + `- 영지이름 : ${data['garden_name']}\n`;
	body3 = body3 + `- 영지Lv : ${data['garden_level']}\n\n`;

	let body4 = "[ 각 인 효 과 ]\n";
	for(let i = 0; i < data['ability'].length; i++){
		body4 = body4 + `- ${data['ability'][i]}\n`;
	}
	body4 = body4 + "\n";

	let body5 = "[ 보 유 캐 릭 ]\n";
	for(let i = 0; i < data['own_job'].length; i++){
		body5 = body5 + `- ${data['own_userName'][i]} / ${data['own_job'][i]}\n`;
	}

	return body1 + body2 + body3 + body4 + body5;
}