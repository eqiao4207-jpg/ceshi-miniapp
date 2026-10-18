export type TestOption = { label: string; scores: Record<string, number> }
export type TestQuestion = { id: string; title: string; note?: string; options: TestOption[] }
export type TestItem = { id: string; title: string; subtitle: string; category: string; minutes: number; price: string; priceCouponFen: number; accent: string; description: string; questions: TestQuestion[] }

export const tests: TestItem[] = [
  { id:'social-battery', title:'你的社交电量', subtitle:'你是充电型、续航型，还是随时关机型？', category:'生活方式', minutes:3, price:'5.90', priceCouponFen:199, accent:'#d8f06a', description:'用 8 个轻松选择，看看你的能量如何在人群里流动。', questions:[
    { id:'q1', title:'临时收到朋友的聚会邀请，你会？', options:[{label:'立刻换衣服出门',scores:{sun:2}},{label:'先问都有谁，再决定',scores:{moon:2}},{label:'礼貌拒绝，今天只想独处',scores:{cloud:2}}] },
    { id:'q2', title:'周末最理想的下午是？', options:[{label:'和一群人吃饭聊天',scores:{sun:2}},{label:'约一个熟人散步',scores:{moon:2}},{label:'一个人窝在家里',scores:{cloud:2}}] },
    { id:'q3', title:'在人多的地方待了几个小时后，你？', options:[{label:'越聊越兴奋',scores:{sun:2}},{label:'还好，需要一点安静',scores:{moon:2}},{label:'马上想找个角落消失',scores:{cloud:2}}] },
    { id:'q4', title:'你更喜欢哪种聊天？', options:[{label:'热闹地分享近况',scores:{sun:2}},{label:'慢慢聊一些真心话',scores:{moon:2}},{label:'不说话也舒服',scores:{cloud:2}}] },
    { id:'q5', title:'朋友说你“很会带动气氛”，你会？', options:[{label:'这不是我的超能力吗',scores:{sun:2}},{label:'偶尔吧，看状态',scores:{moon:2}},{label:'你认真的吗',scores:{cloud:2}}] },
    { id:'q6', title:'旅行时你更想？', options:[{label:'认识新朋友',scores:{sun:2}},{label:'和熟人一起探索',scores:{moon:2}},{label:'按自己的节奏走',scores:{cloud:2}}] },
    { id:'q7', title:'消息很多时，你通常？', options:[{label:'看到就回',scores:{sun:2}},{label:'分批处理',scores:{moon:2}},{label:'先静音一会儿',scores:{cloud:2}}] },
    { id:'q8', title:'给今天的自己选一个词？', options:[{label:'热烈',scores:{sun:2}},{label:'松弛',scores:{moon:2}},{label:'安静',scores:{cloud:2}}] }
  ]},
  { id:'hidden-self', title:'你的隐藏性格', subtitle:'别人眼里的你，和你心里的你差多少？', category:'性格倾向', minutes:4, price:'5.90', priceCouponFen:199, accent:'#ffb49e', description:'一份轻盈但很像你的性格切片，适合分享给朋友互测。', questions:[
    {id:'q1',title:'计划突然被打乱，你会？',options:[{label:'马上想个新方案',scores:{spark:2}},{label:'先观察再决定',scores:{tide:2}},{label:'需要一点时间消化',scores:{nest:2}}]},
    {id:'q2',title:'朋友最常夸你？',options:[{label:'有行动力',scores:{spark:2}},{label:'很会倾听',scores:{tide:2}},{label:'很可靠',scores:{nest:2}}]},
    {id:'q3',title:'一个人时，你最享受？',options:[{label:'做点新鲜的事',scores:{spark:2}},{label:'漫无目的地走走',scores:{tide:2}},{label:'把熟悉的小事做好',scores:{nest:2}}]}
  ] },
  { id:'love-language', title:'你的恋爱沟通风格', subtitle:'你说喜欢的方式，可能比你想象中更明显。', category:'关系灵感', minutes:4, price:'5.90', priceCouponFen:299, accent:'#f0c7e5', description:'从日常小选择里，找到你表达在乎的方式。', questions:[
    {id:'q1',title:'你想念一个人时，会？',options:[{label:'直接发消息',scores:{word:2}},{label:'给对方准备小惊喜',scores:{gift:2}},{label:'默默关注近况',scores:{care:2}}]},
    {id:'q2',title:'你最在意对方记得？',options:[{label:'说过的话',scores:{word:2}},{label:'重要的日子',scores:{gift:2}},{label:'你的情绪变化',scores:{care:2}}]},
    {id:'q3',title:'吵架后你倾向于？',options:[{label:'把话说开',scores:{word:2}},{label:'用行动缓和',scores:{gift:2}},{label:'先给彼此空间',scores:{care:2}}]}
  ] },
  { id:'aesthetic-mood', title:'你的氛围感色彩', subtitle:'选出最近吸引你的画面，收获一张专属情绪色卡。', category:'视觉偏好', minutes:2, price:'5.90', priceCouponFen:99, accent:'#b9d6ff', description:'不需要认真思考，第一眼喜欢的通常就是答案。', questions:[
    {id:'q1',title:'今天第一眼想靠近哪种颜色？',options:[{label:'柠檬黄',scores:{yellow:2}},{label:'海盐蓝',scores:{blue:2}},{label:'樱桃红',scores:{red:2}}]},
    {id:'q2',title:'你会把哪张图设成壁纸？',options:[{label:'阳光洒进房间',scores:{yellow:2}},{label:'海边的远景',scores:{blue:2}},{label:'夜里的霓虹灯',scores:{red:2}}]},
    {id:'q3',title:'最近更需要哪种能量？',options:[{label:'明亮和勇气',scores:{yellow:2}},{label:'平静和空间',scores:{blue:2}},{label:'热烈和行动',scores:{red:2}}]}
  ] }
]

export const getTest = (id: string) => tests.find(item => item.id === id) || tests[0]
