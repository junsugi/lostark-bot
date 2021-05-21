const axios = require("axios");
const cheerio = require("cheerio");

function getUserInfo(userName){
    console.log(`call getUserInfo : ${userName}`);
    return new Promise((resolve, reject) => {
        axios.get(`https://lostark.game.onstove.com/Profile/Character/`+encodeURI(userName)).then(html => {
            const $ = cheerio.load(html.data);
            let json = {};
            // 닉네임
            json['userName'] = $("span.profile-character-info__name").text();
            
            // 레벨
            json['level'] = $("span.profile-character-info__lv").text();

            // 템렙
            $("div.level-info2__item > span").each(function(index, item){
                if(index === 1)
                    json['itemLevel'] = $(this).text();
            });

            // 서버명
            json['server'] = $("span.profile-character-info__server").text().replace("@", "");

            // 직업명
            json['job'] = $("img.profile-character-info__img").attr("alt");

            // 길드
            $("div.game-info__guild > span").each(function(index, item){
                if(index === 1)
                    json['guild'] = $(this).text();
            });

            // 칭호
            $("div.game-info__title > span").each(function(index, item){
                if(index === 1)
                    json['title'] = $(this).text();
            });
            // 원정대 영지 이름, f레벨
            $("div.game-info__wisdom").children().each(function(index, item){
                if(index === 1)
                    json['garden_level'] = $(this).text()
                else if (index === 2)
                    json['garden_name'] = $(this).text();
            });
            
            // 특성 정보
            let count = 0;
            let temp = [];
            $("div.profile-ability-battle > ul > li").children().each(function(index, item){
                if($(this).attr("class") !== 'profile-ability-tooltip'){
                     if($(this).text() !== undefined){
                        temp[count] = $(this).text();
                        count = count + 1;
                     }
                }                   
            });
            json['character'] = temp;

            // 각인 효과
            count = 0;
            temp = [];
            $("div.profile-ability-engrave > div > div > ul > li > span").each(function(index, item){                   
                temp[count] = $(this).text();
                count = count + 1;
            });
            json['ability'] = temp;

            // 보유 캐릭터 직업
            count = 0;
            temp = [];
            $("ul.profile-character-list__char").children().each(function(index, item){
                $(this).children().children().children().each(function(index, item){
                    if($(this).attr("alt") !== undefined){
                        temp[count] = $(this).attr("alt");
                        count = count + 1;
                    }                  
                });
            });
            json['own_job'] = temp;

            // 보유 캐릭터 명
            count = 0;
            temp = [];
            $("ul.profile-character-list__char > li > span > button").each(function(index, item){
                temp[count] = $(this).attr("onclick").split("/")[3].replace("'", "");
                count = count + 1;
            });
            json['own_userName'] = temp;

            // 공격력
            $("div.profile-ability-basic > ul > li > span").each(function(index, item){
                const attack = $(this).text();
                if(attack !== "공격력" && index === 1){
                    json['attack'] = attack;
                }
                const health = $(this).text();
                if(health !== '최대생명력' && index === 3){
                    json['health'] = health;
                }
            });
            resolve(json);
        });
    });
}

function getEventMessageEmbed(){
    console.log("call getEventMessageEmbed !!");
    return new Promise((resolve, reject) => {
        axios.get("https://lostark.game.onstove.com/News/Event/Now").then(html => {
            const $ = cheerio.load(html.data);
            let event = {};
            // 링크
            let temp = [];
            $("div.list.list--event > ul > li > a").each(function(index, item){
                temp[index] = $(this).attr("href");
            });
            event['link'] = temp;

            // 썸네일
            temp = [];
            let temp2 = [];
            $("div.list.list--event > ul > li > a > div.list__thumb > img").each(function(index, item){
                temp[index] = $(this).attr("src");
                temp2[index] = $(this).attr("alt");
            });
            event['thumb'] = temp;
            event['subject'] = temp2;

            // 이벤트 기간
            temp = [];
            $("div.list__term").each(function(index, item){
                temp[index] = $(this).text().split(" : ")[1];
            });
            event['term'] = temp;

            resolve(event);
        })
    });
}

module.exports = {getUserInfo, getEventMessageEmbed};