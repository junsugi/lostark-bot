const Discord = require('discord.js');
const client = new Discord.Client();
const lostArk = require("./lostArk.js");
const config = require("./config.json");
const lostArkData = require("./lostArkData.json");

// initialized
client.once('ready', () => {
	console.log('까궁 봇 출격 완료!');
});

// 로그인 토큰
// 개발
client.login(config['dev-token']);
// 운영
//client.login(config['token']);


// 메시지 대기
client.on('message', message => {
	// 추후에 원하는 채널에서만 작동하도록 수정
	if (!message.author.bot) {
		// .명령어 (닉네임)으로 입력을 강제했기때문에 공백으로 나눠서 0은 명령어 1은 닉네임으로 간주
		const messageArr = message.content.split(" ")
		const command = messageArr[0];
		// 이벤트는 닉네임 입력 없이 가능
		if (command.includes(".이벤트")) {
			// 이벤트 정보 출력
			lostArk.getEventMessageEmbed().then((data) => {
				const embed = createEventDescription(data);
				for (let i = 0; i < embed.length; i++)
					message.channel.send(embed[i]);
			});
		} else if (command === '.전투정보') {
			const userName = messageArr[1];
			lostArk.getUserInfo(userName).then((data) => {
				// description 생성
				if (userName === '정점은움직이지않아') {
					message.channel.send("*__길드장님의 고귀한 정보입니다.__* 🙇‍♂️🙇‍♀️");
				}
				const embed = createDescription(userName, data);
				message.channel.send(embed);
			});
		} else if (command.includes('.참여정보')){
			const userName = messageArr[1];	
			const option = command[command.length-1].toLowerCase();
			// 영어만 정규 표현식
			const eng = /^[a-zA-Z]*$/; 
			const optionChk = eng.test(option);

			// option 값이 영어일 때 Y 혹은 N 인지 확인
			if(optionChk && (option !== 'y' && option !== 'n')){
				message.channel.send("옵션값은 영문으로 Y/N 으로만 가능합니다.");
				return;
			}
			console.log(`참여정보! : ${userName}`);
			lostArk.getInvestigateInfo(Discord, userName).then((json) => {
				if(json['column'].length === 0){
					message.channel.send("설문조사 안했음!!!");
					return;
				}
				let embed = new Discord.MessageEmbed();
				for(let i = 0; i < json['column'].length; i++){
					if(optionChk){
						if((option === "Y" || option === "y") && json['rowData'][i] === '네'){
							embed.addFields({"name": "`"+json['column'][i]+"`", "value": json['rowData'][i]});
						} else if((option === "N" || option === "n") && json['rowData'][i] === '아니오'){
							embed.addFields({"name": "`"+json['column'][i]+"`", "value": json['rowData'][i]});
						}
					} else {
						embed.addFields({"name": "`"+json['column'][i]+"`", "value": json['rowData'][i]});
					}
				}
				message.channel.send(embed);
			});
		} 
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

	let imgSrc = "";
	for(let i = 0; i < lostArkData['job_images'].length; i++){
		if(lostArkData['job_images'][i]['jobName'] === data['job']){
			imgSrc = lostArkData['job_images'][i]['imgSrc'];
		}
	}

	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setAuthor(`__${userName}__`, `${imgSrc}`, `https://lostark.game.onstove.com/Profile/Character/${userName}`)
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
		.setThumbnail('https://i.imgur.com/Vc11WQc_d.webp?maxwidth=760&fidelity=grand')
		.setTimestamp()
		.setFooter("밤에뜨는해", "https://i.imgur.com/Vc11WQc_d.webp?maxwidth=760&fidelity=grand")
		;
		const ownInfoArr = body5.split("\n");
		count = 1;
		let temp = "";
		for(let i = 0; i < ownInfoArr.length; i++){
			temp = temp + ownInfoArr[i] + "\n";
			if(i % 6 === 0 && i !== 0){
				if(count % 4 === 0 || count === 1){
					embed.addFields({ name: '\u200B', value: '\u200B' });
				} 
				embed.addFields(
					{
						"name": `[ 보 유 캐 릭 터 ${count}]`,
						"value": temp,
						inline: true
					}
				)
				count = count + 1;
				temp = "";
			}
		}

		if(count <= 1){
			embed.addFields(
				{ name: '\u200B', value: '\u200B' },
				{
					"name": `[ 보 유 캐 릭 터 1]`,
					"value": temp,
					inline: true
				}
			)
		}

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
		embedArr.push(embed);
	}

	return embedArr;
}