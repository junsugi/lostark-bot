const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

function getHtml(url){
    return new Promise((resolve, reject) => {
        axios.get(`${url}`).then((html) => {
            resolve(html);
        });
    });
}

function getUserInfo(userName){
    console.log(`call getUserInfo : ${userName}`);
    return new Promise((resolve, reject) => {
        getHtml(`https://lostark.game.onstove.com/Profile/Character/`+encodeURI(userName)).then(html => {
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
        getHtml("https://lostark.game.onstove.com/News/Event/Now").then(html => {
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

function getInvestigateInfo(Discord, userName) {
    return new Promise((resolve, reject) => {
        // xlsx 데이터 읽어오기
        const workbook = xlsx.readFile('./docs/20210510 주차 길드 컨텐츠 참여 조사(응답).xlsx');
        const worksheet = workbook.Sheets['설문지 응답 시트1'];
        const rowSize = xlsx.utils.decode_range(worksheet['!ref'])['e']['r'];
        const columnSize = xlsx.utils.decode_range(worksheet['!ref'])['e']['c'];
        // 컬럼 데이터 가져오기
        let column = [];
        for (let i = 0; i < columnSize; i++) {
            const alpabet = String.fromCharCode((65 + i));
            column.push(worksheet[`${alpabet}1`]['v']);
        }
        // B컬럼이 닉네임 정보를 가지고 있음. (해당 닉네임 row 데이터 가져오기)
        let rowData = [];
        for (let i = 0; i < rowSize; i++) {
            if (worksheet[`B${i + 2}`]['v'] === userName) {
                const row = (i + 2);
                for (let j = 0; j < columnSize; j++) {
                    const alpabet = String.fromCharCode((65 + j));
                    if(j === 0){
                        rowData.push(worksheet[alpabet + row] === undefined ? "응답 안함" : worksheet[(alpabet + row)]['w']);
                    } else {
                        rowData.push(worksheet[alpabet + row] === undefined ? "응답 안함" : worksheet[(alpabet + row)]['v']);
                    }
                }
            }
        }
        // 값이 없으면 설문조사 안한 사람
        const json = {
            "column" : rowData.length > 0 ? column : "",
            "rowData": rowData.length > 0 ? rowData : "으이구 설문조사 안했네~!!"
        }
        resolve(json);
    });
}

module.exports = {getUserInfo, getEventMessageEmbed, getInvestigateInfo};