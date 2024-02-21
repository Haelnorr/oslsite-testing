type ArticleType = {
    id:string,
    title:string,
    date:Date,
    author:string,
    link:string,
}

const Articles:ArticleType[] = [
    {
        id: "S18W3",
        title: "OSL heats up with controversy",
        date: new Date("2024/02/05"),
        author: "Doot",
        link: "https://cdn.discordapp.com/attachments/894858078959317012/1203730138206961734/OSL_Slaplog_w3_S18_PDF.pdf?ex=65e49d0d&is=65d2280d&hm=2b6f44e3301610d344f1bf03202589438fce5bfb27b6f3ffb4de45d1831e0777&",
    },
    {
        id: "S18W2",
        title: "Week 2 means it's time to grind!",
        date: new Date("2024/01/29"),
        author: "Doot",
        link: "https://cdn.discordapp.com/attachments/894858078959317012/1201360330425634939/OSL_Slaplog_w2_S18_PDF.pdf?ex=65e5387e&is=65d2c37e&hm=8da7c76972418e4d178beda03762693108f1afec3f8f4846d5ea2facad7dbf3a&",
    },
    {
        id: "S18W1",
        title: "Season 18 kicks off with a bang!",
        date: new Date("2024/01/22"),
        author: "Doot",
        link: "",
    },
    {
        id: "VOL2",
        title: "WEEK ONE RECAP- OSL OFF SEASON DRAFT LEAGUE",
        date: new Date("2021/10/13"),
        author: "EndEd",
        link: "https://cdn.discordapp.com/attachments/894858078959317012/897743995868950568/Draft_-_The_Weekly_Slap_Vol_2_October_13_2021.pdf?ex=65e817bf&is=65d5a2bf&hm=a7d40b174ca7edeeddaa9ac8c3dd8a4709e72f99c7bcdb1073626718ccd1f1b9&",
    },
    {
        id: "VOL1",
        title: "A NEW SEASON BEGINS!",
        date: new Date("2021/10/05"),
        author: "EndEd",
        link: "https://cdn.discordapp.com/attachments/894858078959317012/894858151944413194/The_Weekly_Slap_Vol_1_October_5_2021.pdf?ex=65e6d299&is=65d45d99&hm=9a19b0eee71d177a24a6b8ce3916af8477c5873cd2fb28a8cedf40eef8854b4b&",
    },
    {
        id: "S18W4-5",
        title: "Week 2 means it's time to grind!",
        date: new Date("2024/02/19"),
        author: "Doot",
        link: "https://cdn.discordapp.com/attachments/894858078959317012/1209117871918022676/OSL_Slaplog_w4-5_S18.pdf?ex=65e5c1c4&is=65d34cc4&hm=d2447a1749c58e289faf1d095aa24682cbfad5bfbf65971cafe95d82feb1bbbd&",
    },
]

export default Articles;