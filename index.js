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
	if(messageArr[0].match("!")){
		const userName = message.content.replace("!", "");
		message.channel.send(userName+"님의 정보입니다.");
		const data = lostArk.getUserInfo(userName);
		message.channel.send(data);
	}
});