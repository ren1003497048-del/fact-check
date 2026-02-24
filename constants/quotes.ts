/**
 * Quote Database for Loading Screen
 * Categorized truth quotes and historical events for intelligent loading screen
 */

export interface QuoteItem {
  quote: string;
  context: string;
  era: string;
  readTime: number; // Estimated reading time in seconds
}

export const QUOTE_DATABASE: Record<string, QuoteItem[]> = {
  // News & Journalism related
  news: [
    {
      quote: '当真相还在穿鞋的时候，谎言已经跑遍了半个世界。',
      context: '— 马克·吐温（此说法最早可追溯至1710年）\n\n讽刺作家乔纳森·斯威夫特和马克·吐温都引用过的这句格言，捕捉到了错误信息的病毒式传播本质——比社交媒体让它变得瞬间传播早了三个世纪。在新闻传播速度呈指数级增长的今天，这句话比以往任何时候都更加切题。',
      era: '新闻传播学',
      readTime: 6
    },
    {
      quote: '1835年大月球骗局',
      context: '《纽约太阳报》刊登了一系列文章，声称天文学家约翰·赫歇尔在月球上发现了生命——包括蝙蝠人和独角兽。报纸销量飙升。公众愿意相信。\n\n这是历史上第一次由媒体制造的病毒式假新闻。报纸没有撤回报道，而是在两周后「承认」这是一个玩笑，但销量已经翻倍。教训：信任信源，而非叙事。验证始终重要。',
      era: '媒体史',
      readTime: 8
    },
    {
      quote: '新闻业的第一条法则是：去验证，然后才去报道。',
      context: '— 菲利普·格雷厄姆，《华盛顿邮报》前发行人\n\n在24小时新闻周期和点击率竞争的时代，这条基本准则经常被遗忘。速度不应以牺牲准确性为代价。一个纠正的故事永远无法取代第一次就讲对的故事。假新闻的传播速度是真新闻的六倍，这使得验证比以往任何时候都更加关键。',
      era: '新闻伦理',
      readTime: 7
    },
    {
      quote: '黄色新闻的泛滥',
      context: '1890年代末，赫斯特报业和纽约世界报之间激烈竞争，催生了「黄色新闻」——耸人听闻、标题党、情绪化的新闻，不惜牺牲事实来争夺读者。这种模式在社交媒体时代以新的形式重现：算法优化的标题、情绪操纵、极化内容。\n\n历史告诉我们：没有把关人的信息生态系统会自然退化为娱乐。',
      era: '新闻史',
      readTime: 9
    }
  ],

  // Technology & Science related
  tech: [
    {
      quote: '第一原则是你绝不能欺骗自己——而你自己是最容易欺骗的人。',
      context: '— 理查德·费恩曼，加州理工学院毕业演讲（1974）\n\n这位诺贝尔物理学奖得主关于科学诚信的著名警告，同样适用于信息消费。在算法推荐和精心策划的信息流时代，自我欺骗是最大的脆弱之处。我们必须主动挑战自己的确认偏误。',
      era: '科学哲学',
      readTime: 7
    },
    {
      quote: 'Theranos诈骗案：硅谷的「坏血」',
      context: '伊丽莎白·霍姆斯声称其公司Theranos的设备可以用几滴血进行数百项检测。估值90亿美元。但这项技术从未真正奏效。数千患者可能收到了错误的检测结果。\n\n硅谷的「fake it till you make it」文化在医疗领域是危险的。当创新突破科学和伦理边界时，我们必须质疑，而不是盲目崇拜独角兽神话。',
      era: '科技史',
      readTime: 9
    },
    {
      quote: '任何足够先进的技术都与魔法无异。',
      context: '— 亚瑟·C·克拉克\n\n但当我们无法区分技术和魔法时，也意味着我们放弃了理解它们如何运作的责任。深度伪造、AI生成内容、算法黑箱——当技术变得不可解释时，它变成了信任的黑洞。透明度和可验证性是技术民主化的关键。',
      era: '技术哲学',
      readTime: 8
    },
    {
      quote: '数据不是真相，数据是对现实的观察。',
      context: '— 统计学原则\n\n数据可以被选择、切片、操纵以支持任何叙事。Correlation不等于causation。在没有适当背景的情况下解读数据，是通往错误结论的最快途径。科学方法不仅仅是收集数据，而是设计能够排除偏差的实验。',
      era: '数据科学',
      readTime: 7
    }
  ],

  // Politics & Ideology related
  politics: [
    {
      quote: '战争即和平。自由即奴役。无知即力量。',
      context: '— 乔治·奥威尔，《1984》（1949）\n\n奥威尔对极权主义语言操纵的反乌托邦式警示，预言了现代对真相衰退、宣传和信息武器化的担忧。当政府或机构重新定义基本词汇——"另类事实"、"假新闻"——他们在改写现实。语言控制是思想控制的前奏。',
      era: '政治哲学',
      readTime: 9
    },
    {
      quote: '水能载舟，亦能覆舟。',
      context: '— 荀子，《王制》（约公元前3世纪）\n\n信息如同流水，既能承载文明的舟船，也能倾覆虚假的楼阁。两千多年前的中国哲学家提醒我们：力量的双重性永远值得警惕。权力需要制衡，话语需要多元，真相需要守护。',
      era: '中国古代哲学',
      readTime: 6
    },
    {
      quote: '阿希从众实验',
      context: '1951年，所罗门·阿希展示了人们会如何公然否认自己亲眼所见，以与群体保持一致。75%的参与者至少有一次同意了明显错误的答案，仅仅因为其他人都在这么做。\n\n在信息茧房和回音室的时代，这种群体从众被算法放大。独立的批判性思维是抵抗集体错觉的唯一武器。',
      era: '社会心理学',
      readTime: 9
    },
    {
      quote: '宣传最有效的形式是当人们不认为它是宣传的时候。',
      context: '— 弗朗西斯·怀兰·肖恩，中央情报局前官员\n\n有效宣传不是大喊口号，而是微妙地塑造信息环境。选择性报道、框架效应、议程设置——这些工具无处不在，因为它们有效。媒体素养教育从未如此紧迫：识别框架，质疑叙事，追踪资金。',
      era: '政治传播',
      readTime: 8
    }
  ],

  // Health & Medical related
  health: [
    {
      quote: 'Wakesfield的伪造研究',
      context: '1998年，安德鲁·韦克菲尔德发表论文声称自闭症与麻疹、腮腺炎和风疹（MMR）疫苗之间存在联系。该论文后被完全撤回，他被禁止行医。但损害已经造成：麻疹病例在欧美激增。\n\n一项伪造的研究可以产生数十年的现实世界影响。科学共识不是通过单一研究建立的，而是通过可重复的验证。当被撤回的研究继续作为论据流传时，系统失效了。',
      era: '医学史',
      readTime: 10
    },
    {
      quote: '轶事不等于数据。',
      context: '— 医学研究黄金法则\n\n"我姑姑吃了这个就好了"不是科学证据。"我的朋友发帖说"不是同行评审。个人的强烈故事可以令人信服，因为它们在情感上引起共鸣，但它们不能代表一般情况。循证医学依赖于大样本量、对照试验和统计分析。',
      era: '循证医学',
      readTime: 6
    },
    {
      quote: ' correlation不等于因果。',
      context: '— 统计学101\n\n冰淇淋销售和溺水事故同时增加，但冰淇淋不会导致溺水——两者都由夏天引起。人类大脑天生擅长检测模式，但糟糕的是区分相关性和因果关系。这种认知偏差使我们在健康和营养方面容易受到错误信息的影响。',
      era: '研究方法',
      readTime: 7
    }
  ],

  // Business & Finance related
  business: [
    {
      quote: '安然公司崩塌',
      context: '2001年，能源巨头安然公司因会计欺诈而倒闭，成为当时最大的企业破产案。其"创造性会计"方法——将债务隐藏在离岸实体中——被视为"创新"，直到无法再隐藏。\n\n当"颠覆"和"创新"成为流行词时，监管和透明度变得不酷了。但安然提醒我们：财务复杂性可能掩盖简单的欺诈。如果一项交易好得难以置信，那它可能就是难以置信。',
      era: '商业史',
      readTime: 9
    },
    {
      quote: '庞氏骗局的本质',
      context: '— 查尔斯·庞齐，1920年\n\n"用后来投资者的钱支付早期投资者的回报。"这是最简单的骗局，也是最难识破的，因为早期的参与者确实赚了钱——并且是他们最响亮的啦啦队。在加密货币和投资领域，每当看到承诺不切实际回报时，都应该问：钱从哪里来？',
      era: '金融史',
      readTime: 7
    },
    {
      quote: '市场泡沫的共同特征',
      context: '— "这次不一样"综合症\n\n从郁金香狂热（1637）到互联网泡沫（2000），每一次泡沫都有信徒相信基本规则不再适用。新术语、新技术、新范式——但人类的贪婪和恐惧保持不变。当街头巷尾都在谈论某个投资时，可能正是该离场的时候。',
      era: '经济学',
      readTime: 8
    }
  ],

  // General & Philosophy (default)
  general: [
    {
      quote: '真相很少是纯粹的，也绝不简单。',
      context: '— 奥斯卡·王尔德，《不可儿戏》（1895）\n\n在这个耸人听闻的标题和病毒式短视频的时代，王尔德的智慧提醒我们：现实往往拒绝被简化。每一个主张都值得调查，每一个真相都需要细致的辨析。复杂的问题很少有简单的答案。',
      era: '文学',
      readTime: 6
    },
    {
      quote: '事实是顽强的东西；无论我们的愿望、倾向或激情如何，都无法改变事实和证据的状态。',
      context: '— 约翰·亚当斯，波士顿大屠杀案辩护词（1770）\n\n在美国革命前最动荡的审判之一中，亚当斯尽管持有爱国情怀，仍为英国士兵辩护。他对证据而非意识形态的承诺，成为法律伦理的基石。当情感与事实冲突时，选择事实需要勇气。',
      era: '法律史',
      readTime: 7
    },
    {
      quote: '认知失调和确认偏误导致聪明人拒绝接受不舒服的真相。',
      context: '— 心理学研究\n\n认识到我们自己的心理防御机制，是迈向真正理解的第一步。人类的大脑天生倾向于寻找支持既有信念的证据，这正是批判性思维如此重要的原因。我们必须主动挑战自己的假设。',
      era: '心理学',
      readTime: 6
    },
    {
      quote: '在信息时代，无知是一种选择。',
      context: '— 唐尼·米勒\n\n人类知识触手可及，但通往真相的障碍已不再是获取渠道——而是面对不舒服事实的意愿，以及区分可信信源的纪律。信息过载时代，批判性思维是最稀缺的资源。',
      era: '数字时代',
      readTime: 6
    },
    {
      quote: '调查性新闻和深度研究需要耐心。在即时答案的时代，彻底验证的纪律既罕见又革命性。',
      context: '— 媒体伦理原则\n\n真正的洞察需要时间酝酿。在这个追求速度的世界里，愿意慢下来深入挖掘真相的记者和研究员，成为了对抗浅薄信息的最后防线。好核查需要时间——这值得等待。',
      era: '新闻伦理',
      readTime: 7
    }
  ]
};

/**
 * Intelligent content classifier for quote selection
 */
export function detectContentType(text: string): string {
  const lowerText = text.toLowerCase();

  // Keyword-based classification
  const patterns = {
    news: [
      '新闻', '报道', '记者', '媒体', 'press', 'news', 'report', 'journalism',
      '头条', '热搜', '突发', 'breaking', 'article', '采访'
    ],
    tech: [
      '科技', '技术', 'ai', '人工智能', '算法', '硅谷', '数据', '芯片',
      'tech', 'technology', 'algorithm', 'software', 'app', 'platform',
      '创业', '公司', '估值', '融资', 'startup', 'unicorn'
    ],
    politics: [
      '政治', '政府', '选举', '政策', '总统', '领导人', 'politics', 'government',
      'election', 'policy', 'democracy', 'freedom', 'rights', 'censorship',
      '宣传', 'propaganda', '抗议', 'protest', '法律', 'law', 'court'
    ],
    health: [
      '健康', '医疗', '疫苗', '病毒', '医学', '治疗', 'health', 'medical',
      'vaccine', 'virus', 'doctor', 'medicine', 'treatment', 'drug',
      '营养', '饮食', 'exercise', '疫情', 'pandemic', 'covid'
    ],
    business: [
      '经济', '金融', '投资', '股票', '股市', 'business', 'finance',
      'investment', 'stock', 'market', 'economy', 'money', 'crypto',
      '加密货币', '比特币', 'bitcoin', '庞氏', '骗局', 'scam', 'fraud'
    ]
  };

  // Check each category
  for (const [category, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  // Default to general
  return 'general';
}

/**
 * Select quotes based on content type
 */
export function selectQuotesByCategory(contentType: string): QuoteItem[] {
  return QUOTE_DATABASE[contentType] || QUOTE_DATABASE.general;
}
