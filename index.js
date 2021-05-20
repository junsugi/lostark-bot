const Discord = require('discord.js');
const client = new Discord.Client();
const lostArk = require("./lostArk.js");
const config = require("./config.json");
const lostArkImg = require("./lostArkData.json")
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
		if(messageArr[0].includes("!")){
			const userName = message.content.replace("!", "");
			if(userName.includes("이벤트")){
				// 이벤트 정보 출력
				lostArk.getEventMessageEmbed().then((data) => {
					const embed = createEventDescription(data);
					for(let i = 0; i < embed.length; i++)
						message.channel.send(embed[i]);
						setTimeout(()=>{}, 1000);
				});
				
				return;
			} else {
				lostArk.getUserInfo(userName).then((data) => {
					// description 생성
					if(userName === '정점은움직이지않아'){
						message.channel.send("*__길드장님의 고귀한 정보입니다.__* 🙇‍♂️🙇‍♀️");
					}
					const embed = createDescription(userName, data);			
					message.channel.send(embed);	
					return;	
				});
			}
		}
	} catch (error){		
	}
});

function createDescription(userName, data){
	// 각인 효과
	let body4 = "";
	for(let i = 0; i < data['ability'].length; i++){
		body4 = body4 + `${data['ability'][i]}\n`;
	}
	body4 = body4 + "\n";

	// 보유 캐릭터
	let body5 = "";
	for(let i = 0; i < data['own_job'].length; i++){
		body5 = body5 + `[${data['own_userName'][i]}](https://lostark.game.onstove.com/Profile/Character/${data['own_userName'][i]}) / ${data['own_job'][i]}\n`;
	}

	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setAuthor(`__${userName}__`, lostArkImg[`${data['job']}`], `https://lostark.game.onstove.com/Profile/Character/${userName}`)
		.addFields(
			{
				"name": "[ 기 본 정 보 ]", 
				"value": `\`캐릭터명\` : ${data['userName']}\n\`서 버 명\` : ${data['server']}\n\`직  업\` : ${data['job']}\n\`길 드\` : ${data['guild']}\n\`칭 호\` : ${data['title']}`, 
				inline: true
			},
			{
				"name": "[ 각 인 효 과 ]",
				"value": body4,
				inline: true
			},
		)
		.addFields(
			{ name: '\u200B', value: '\u200B' },
			{
				"name": "[ 원 정 대 영 지 ]",
				"value": `\`영지이름\` : ${data['garden_name']}\n\`영지Lv\` : ${data['garden_level']}\n`,
				inline: true			
			},
			{
				"name": "[ 기 본 특 성 ]",
				"value": `\`최대생명력\` : ${data['health']}\n\`공격력\` : ${data['attack']}`,
				inline: true
			},
			{
				"name": "[ 레 벨 정 보 ]", 
				"value": `\`전투Lv\` : ${data['level']}\n\`아이템Lv\` : ${data['itemLevel']}`,
				inline: true
			},
		)
		.addFields(
			{ name: '\u200B', value: '\u200B' },
			{
				"name": "[ 보 유 캐 릭 터 ]",
				"value": body5,
			}
		)
		.setThumbnail('https://i.imgur.com/Vc11WQc_d.webp?maxwidth=760&fidelity=grand')
		.setTimestamp()
		.setFooter("밤에뜨는해", "https://i.imgur.com/Vc11WQc_d.webp?maxwidth=760&fidelity=grand")
		;

	return embed;
}

function createEventDescription(data){
	let embedArr = [];
	for(let i = 0; i < data['subject'].length; i++){
		const embed = new Discord.MessageEmbed()
			.setColor("#fffff")
			.setAuthor(`${data['subject'][i]}`, "", `https://lostark.game.onstove.com${data['link'][i]}`)
			.setImage(`${data['thumb'][i]}`)
			.setFooter(`이벤트기간 : ${data['term'][i]}`, "")
			;
		console.log(`${data['thumb'][i]}`);
		embedArr.push(embed);
	}

	return embedArr;
}