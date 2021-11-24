"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = __importStar(require("discord.js"));
var lostArk = __importStar(require("./utils/lostArk"));
var config = __importStar(require("./config/config"));
var client = new Discord.Client();
// initialized
client.once('ready', function () {
    console.log('까궁 봇 출격 완료!');
});
// 로그인 토큰
client.login(process.env ? config.DISCORD_CONFIG.TOKEN : config.DISCORD_CONFIG.DEV_TOKEN);
// 메시지 대기
client.on('message', function (message) {
    // 추후에 원하는 채널에서만 작동하도록 수정
    if (!message.author.bot) {
        // .명령어 (닉네임)으로 입력을 강제했기때문에 공백으로 나눠서 0은 명령어 1은 닉네임으로 간주
        var messageArr = message.content.split(" ");
        var command = messageArr[0];
        // 이벤트는 닉네임 입력 없이 가능
        if (command.includes(".이벤트")) {
            // 이벤트 정보 출력
            lostArk.getEventMessageEmbed().then(function (data) {
                var embed = createEventDescription(data);
                for (var i = 0; i < embed.length; i++)
                    message.channel.send(embed[i]);
            });
        }
        else if (command === '.전투정보') {
            var userName_1 = messageArr[1];
            lostArk.getUserInfo(userName_1).then(function (data) {
                // description 생성
                if (userName_1 === '정점은움직이지않아') {
                    message.channel.send("*__길드장님의 고귀한 정보입니다.__* 🙇‍♂️🙇‍♀️");
                }
                var embed = createDescription(userName_1, data);
                message.channel.send(embed);
            });
        }
    }
});
function createDescription(userName, data) {
    var lostArkData = config.LOSTARK_DATA;
    // 각인 효과
    var body4 = "";
    for (var i = 0; i < data['ability'].length; i++) {
        body4 = body4 + "".concat(data['ability'][i], "\n");
    }
    body4 = body4 + "\n";
    // 보유 캐릭터
    var body5 = "";
    for (var i = 0; i < data['own_job'].length; i++) {
        body5 = body5 + "[".concat(data['own_userName'][i], "](https://lostark.game.onstove.com/Profile/Character/").concat(data['own_userName'][i], ") / ").concat(data['own_job'][i], "\n");
    }
    var imgSrc = "";
    for (var i = 0; i < lostArkData.JOB_IMAGES.length; i++) {
        if (lostArkData.JOB_IMAGES[i].JOB_NAME === data['job']) {
            imgSrc = lostArkData.JOB_IMAGES[i].IMG_SRC;
        }
    }
    var embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor("__".concat(userName, "__"), "".concat(imgSrc), "https://lostark.game.onstove.com/Profile/Character/".concat(userName))
        .addFields({
        "name": "[ 기 본 정 보 ]",
        "value": "`\uCE90\uB9AD\uD130\uBA85` : ".concat(data['userName'], "\n`\uC11C \uBC84 \uBA85` : ").concat(data['server'], "\n`\uC9C1  \uC5C5` : ").concat(data['job'], "\n`\uAE38 \uB4DC` : ").concat(data['guild'], "\n`\uCE6D \uD638` : ").concat(data['title']),
        inline: true
    }, {
        "name": "[ 각 인 효 과 ]",
        "value": body4,
        inline: true
    })
        .addFields({ name: '\u200B', value: '\u200B' }, {
        "name": "[ 원 정 대 영 지 ]",
        "value": "`\uC601\uC9C0\uC774\uB984` : ".concat(data['garden_name'], "\n`\uC601\uC9C0Lv` : ").concat(data['garden_level'], "\n"),
        inline: true
    }, {
        "name": "[ 기 본 특 성 ]",
        "value": "`\uCD5C\uB300\uC0DD\uBA85\uB825` : ".concat(data['health'], "\n`\uACF5\uACA9\uB825` : ").concat(data['attack']),
        inline: true
    }, {
        "name": "[ 레 벨 정 보 ]",
        "value": "`\uC804\uD22CLv` : ".concat(data['level'], "\n`\uC544\uC774\uD15CLv` : ").concat(data['itemLevel']),
        inline: true
    })
        .setThumbnail('https://i.imgur.com/Vc11WQc_d.webp?maxwidth=760&fidelity=grand')
        .setTimestamp()
        .setFooter("밤에뜨는해", "https://i.imgur.com/Vc11WQc_d.webp?maxwidth=760&fidelity=grand");
    var ownInfoArr = body5.split("\n");
    var count = 1;
    var temp = "";
    for (var i = 0; i < ownInfoArr.length; i++) {
        temp = temp + ownInfoArr[i] + "\n";
        if (i % 6 === 0 && i !== 0) {
            if (count % 4 === 0 || count === 1) {
                embed.addFields({ name: '\u200B', value: '\u200B' });
            }
            embed.addFields({
                "name": "[ \uBCF4 \uC720 \uCE90 \uB9AD \uD130 ".concat(count, "]"),
                "value": temp,
                inline: true
            });
            count = count + 1;
            temp = "";
        }
    }
    if (count <= 1) {
        embed.addFields({ name: '\u200B', value: '\u200B' }, {
            "name": "[ \uBCF4 \uC720 \uCE90 \uB9AD \uD130 1]",
            "value": temp,
            inline: true
        });
    }
    return embed;
}
function createEventDescription(data) {
    var embedArr = [];
    for (var i = 0; i < data['subject'].length; i++) {
        var embed = new Discord.MessageEmbed()
            .setColor("#fffff")
            .setAuthor("".concat(data['subject'][i]), "", "https://lostark.game.onstove.com".concat(data['link'][i]))
            .setImage("".concat(data['thumb'][i]))
            .setFooter("\uC774\uBCA4\uD2B8\uAE30\uAC04 : ".concat(data['term'][i]), "");
        embedArr.push(embed);
    }
    return embedArr;
}
//# sourceMappingURL=index.js.map