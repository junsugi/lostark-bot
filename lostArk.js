const axios = require("axios");
const cheerio = require("cheerio");

async function getUserInfo(userName){
    console.log(`call getUserInfo : ${userName}`);
    let json = {};
    await axios.get(`https://lostark.game.onstove.com/Profile/Character/`+encodeURI(userName)).then(html => {
        const $ = cheerio.load(html.data);
        // 닉네임
        json['userName'] = $("span.profile-character-info__name").text();
        // 레벨
        json['level'] = $("span.profile-character-info__lv").text();
    });
    console.log(json);
    return json;
}

module.exports = {getUserInfo};