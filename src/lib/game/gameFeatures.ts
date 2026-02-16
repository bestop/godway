import {
  Skill,
  Quest,
  Achievement,
  RandomEvent,
  Dungeon,
  DailySignInReward,
  RealmType
} from '@/types/game';

export const SKILLS: Skill[] = [
  {
    id: 'skill_basic_attack',
    name: '普通攻击',
    description: '基础攻击，造成100%攻击力伤害',
    icon: '⚔️',
    type: 'attack',
    target: 'enemy',
    mpCost: 0,
    cooldown: 0,
    effect: { damageMultiplier: 1.0 },
    requiredRealm: '练气期',
    unlockLevel: 1
  },
  {
    id: 'skill_heavy_strike',
    name: '重击',
    description: '强力一击，造成150%攻击力伤害',
    icon: '💥',
    type: 'attack',
    target: 'enemy',
    mpCost: 10,
    cooldown: 2,
    effect: { damageMultiplier: 1.5 },
    requiredRealm: '练气期',
    unlockLevel: 3
  },
  {
    id: 'skill_heal',
    name: '回春术',
    description: '恢复30%最大气血',
    icon: '💚',
    type: 'heal',
    target: 'self',
    mpCost: 15,
    cooldown: 3,
    effect: { healMultiplier: 0.3 },
    requiredRealm: '练气期',
    unlockLevel: 2
  },
  {
    id: 'skill_sword_qi',
    name: '剑气斩',
    description: '释放剑气，造成200%攻击力伤害',
    icon: '🗡️',
    type: 'attack',
    target: 'enemy',
    mpCost: 20,
    cooldown: 3,
    effect: { damageMultiplier: 2.0 },
    requiredRealm: '筑基期',
    unlockLevel: 1
  },
  {
    id: 'skill_iron_skin',
    name: '铁壁',
    description: '提升50%防御，持续3回合',
    icon: '🛡️',
    type: 'buff',
    target: 'self',
    mpCost: 15,
    cooldown: 5,
    effect: { buffDef: 0.5, duration: 3 },
    requiredRealm: '筑基期',
    unlockLevel: 2
  },
  {
    id: 'skill_fireball',
    name: '火球术',
    description: '释放火球，造成250%攻击力伤害',
    icon: '🔥',
    type: 'attack',
    target: 'enemy',
    mpCost: 25,
    cooldown: 2,
    effect: { damageMultiplier: 2.5 },
    requiredRealm: '筑基期',
    unlockLevel: 4
  },
  {
    id: 'skill_thunder_strike',
    name: '雷霆一击',
    description: '召唤雷霆，造成300%攻击力伤害',
    icon: '⚡',
    type: 'attack',
    target: 'enemy',
    mpCost: 35,
    cooldown: 4,
    effect: { damageMultiplier: 3.0 },
    requiredRealm: '金丹期',
    unlockLevel: 1
  },
  {
    id: 'skill_meditation',
    name: '冥想',
    description: '恢复50%最大灵力',
    icon: '🧘',
    type: 'heal',
    target: 'self',
    mpCost: 0,
    cooldown: 5,
    effect: { healMultiplier: 0.5 },
    requiredRealm: '金丹期',
    unlockLevel: 3
  },
  {
    id: 'skill_break_armor',
    name: '破甲',
    description: '降低敌人30%防御，持续3回合',
    icon: '🔨',
    type: 'debuff',
    target: 'enemy',
    mpCost: 20,
    cooldown: 4,
    effect: { debuffDef: 0.3, duration: 3 },
    requiredRealm: '金丹期',
    unlockLevel: 5
  },
  {
    id: 'skill_spirit_burst',
    name: '灵力爆发',
    description: '释放全部灵力，造成400%攻击力伤害',
    icon: '💫',
    type: 'special',
    target: 'enemy',
    mpCost: 50,
    cooldown: 6,
    effect: { damageMultiplier: 4.0 },
    requiredRealm: '元婴期',
    unlockLevel: 1
  },
  {
    id: 'skill_life_steal',
    name: '吸血术',
    description: '造成200%攻击力伤害，并恢复等量气血',
    icon: '🩸',
    type: 'special',
    target: 'enemy',
    mpCost: 30,
    cooldown: 4,
    effect: { damageMultiplier: 2.0, healMultiplier: 0.5 },
    requiredRealm: '元婴期',
    unlockLevel: 3
  },
  {
    id: 'skill_divine_shield',
    name: '神盾',
    description: '提升100%防御，持续5回合',
    icon: '✨',
    type: 'buff',
    target: 'self',
    mpCost: 40,
    cooldown: 8,
    effect: { buffDef: 1.0, duration: 5 },
    requiredRealm: '元婴期',
    unlockLevel: 5
  },
  {
    id: 'skill_heavenly_thunder',
    name: '天雷灭世',
    description: '召唤天雷，造成500%攻击力伤害',
    icon: '🌩️',
    type: 'attack',
    target: 'enemy',
    mpCost: 80,
    cooldown: 8,
    effect: { damageMultiplier: 5.0 },
    requiredRealm: '化神期',
    unlockLevel: 1
  },
  {
    id: 'skill_immortal_body',
    name: '不灭金身',
    description: '恢复100%最大气血',
    icon: '🌟',
    type: 'heal',
    target: 'self',
    mpCost: 60,
    cooldown: 10,
    effect: { healMultiplier: 1.0 },
    requiredRealm: '化神期',
    unlockLevel: 3
  },
  {
    id: 'skill_world_destroyer',
    name: '灭世一击',
    description: '毁天灭地的一击，造成800%攻击力伤害',
    icon: '💥',
    type: 'special',
    target: 'enemy',
    mpCost: 100,
    cooldown: 10,
    effect: { damageMultiplier: 8.0 },
    requiredRealm: '合体期',
    unlockLevel: 1
  },
  {
    id: 'skill_dao_heart',
    name: '道心',
    description: '恢复全部气血和灵力',
    icon: '☯️',
    type: 'heal',
    target: 'self',
    mpCost: 0,
    cooldown: 15,
    effect: { healMultiplier: 1.0 },
    requiredRealm: '合体期',
    unlockLevel: 5
  },
  {
    id: 'skill_heavenly_dao',
    name: '天道之力',
    description: '召唤天道之力，造成1000%攻击力伤害',
    icon: '👑',
    type: 'special',
    target: 'enemy',
    mpCost: 150,
    cooldown: 15,
    effect: { damageMultiplier: 10.0 },
    requiredRealm: '大乘期',
    unlockLevel: 1
  }
];

export function getAvailableSkills(realm: RealmType, level: number): Skill[] {
  const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
  const currentIndex = realmOrder.indexOf(realm);
  
  return SKILLS.filter(skill => {
    const skillRealmIndex = realmOrder.indexOf(skill.requiredRealm || '练气期');
    return skillRealmIndex <= currentIndex && (skill.unlockLevel || 1) <= level;
  });
}

export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find(skill => skill.id === id);
}

export const QUESTS: Quest[] = [
  {
    id: 'quest_kill_wolf',
    name: '初试身手',
    description: '击败5只野狼',
    type: 'kill',
    target: 'monster_qi_1',
    requiredCount: 5,
    rewards: { exp: 100, gold: 50 },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_kill_fox',
    name: '妖狐猎手',
    description: '击败3只妖狐',
    type: 'kill',
    target: 'monster_qi_3',
    requiredCount: 3,
    rewards: { exp: 200, gold: 100 },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_reach_level_5',
    name: '初窥门径',
    description: '达到练气期5层',
    type: 'reach_level',
    target: '5',
    requiredCount: 1,
    rewards: { exp: 300, gold: 200 },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_win_battle_10',
    name: '战斗新手',
    description: '赢得10场战斗',
    type: 'win_battle',
    target: 'any',
    requiredCount: 10,
    rewards: { exp: 150, gold: 100 },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_kill_boss_qi',
    name: '斩妖除魔',
    description: '击败练气期妖王',
    type: 'kill',
    target: 'monster_qi_9',
    requiredCount: 1,
    rewards: { exp: 500, gold: 300, items: ['tribulation_pill'] },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_reach_zhuji',
    name: '筑基之路',
    description: '成功渡劫进入筑基期',
    type: 'reach_realm',
    target: '筑基期',
    requiredCount: 1,
    rewards: { exp: 1000, gold: 500 },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_kill_zhuji_monsters',
    name: '筑基历练',
    description: '击败10只筑基期妖兽',
    type: 'kill',
    target: 'monster_zhuji_1',
    requiredCount: 10,
    rewards: { exp: 800, gold: 400 },
    requiredRealm: '筑基期'
  },
  {
    id: 'quest_kill_dragon',
    name: '屠龙勇士',
    description: '击败蛟龙',
    type: 'kill',
    target: 'monster_zhuji_5',
    requiredCount: 3,
    rewards: { exp: 1500, gold: 800, items: ['pill_exp_large'] },
    requiredRealm: '筑基期'
  },
  {
    id: 'quest_reach_jindan',
    name: '金丹大道',
    description: '成功渡劫进入金丹期',
    type: 'reach_realm',
    target: '金丹期',
    requiredCount: 1,
    rewards: { exp: 3000, gold: 1500 },
    requiredRealm: '筑基期'
  },
  {
    id: 'quest_kill_jindan_boss',
    name: '金丹挑战',
    description: '击败金丹巅峰妖圣',
    type: 'kill',
    target: 'monster_jindan_9',
    requiredCount: 1,
    rewards: { exp: 5000, gold: 3000, items: ['tribulation_pill', 'tribulation_pill'] },
    requiredRealm: '金丹期'
  },
  {
    id: 'quest_win_battle_100',
    name: '百战勇士',
    description: '赢得100场战斗',
    type: 'win_battle',
    target: 'any',
    requiredCount: 100,
    rewards: { exp: 2000, gold: 1000 },
    requiredRealm: '练气期'
  },
  {
    id: 'quest_win_battle_500',
    name: '千锤百炼',
    description: '赢得500场战斗',
    type: 'win_battle',
    target: 'any',
    requiredCount: 500,
    rewards: { exp: 10000, gold: 5000 },
    requiredRealm: '筑基期'
  },
  {
    id: 'quest_daily_battle',
    name: '每日修炼',
    description: '今日击败10只妖兽',
    type: 'kill',
    target: 'any',
    requiredCount: 10,
    rewards: { exp: 200, gold: 100 },
    requiredRealm: '练气期',
    isDaily: true
  },
  {
    id: 'quest_daily_meditate',
    name: '每日打坐',
    description: '今日修炼5次',
    type: 'use_item',
    target: 'meditate',
    requiredCount: 5,
    rewards: { exp: 100, gold: 50 },
    requiredRealm: '练气期',
    isDaily: true
  }
];

export function getAvailableQuests(realm: RealmType): Quest[] {
  const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
  const currentIndex = realmOrder.indexOf(realm);
  
  return QUESTS.filter(quest => {
    const questRealmIndex = realmOrder.indexOf(quest.requiredRealm || '练气期');
    return questRealmIndex <= currentIndex;
  });
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_blood',
    name: '初战告捷',
    description: '赢得第一场战斗',
    icon: '⚔️',
    type: 'battle',
    requirement: { type: 'win_battle', target: 1 },
    rewards: { gold: 100 }
  },
  {
    id: 'ach_battle_10',
    name: '战斗新手',
    description: '赢得10场战斗',
    icon: '🗡️',
    type: 'battle',
    requirement: { type: 'win_battle', target: 10 },
    rewards: { gold: 500 }
  },
  {
    id: 'ach_battle_50',
    name: '战斗达人',
    description: '赢得50场战斗',
    icon: '⚔️',
    type: 'battle',
    requirement: { type: 'win_battle', target: 50 },
    rewards: { gold: 1000 }
  },
  {
    id: 'ach_battle_100',
    name: '百战勇士',
    description: '赢得100场战斗',
    icon: '🛡️',
    type: 'battle',
    requirement: { type: 'win_battle', target: 100 },
    rewards: { gold: 2000 }
  },
  {
    id: 'ach_battle_500',
    name: '战神',
    description: '赢得500场战斗',
    icon: '👑',
    type: 'battle',
    requirement: { type: 'win_battle', target: 500 },
    rewards: { gold: 10000, title: '战神' }
  },
  {
    id: 'ach_battle_1000',
    name: '无双战神',
    description: '赢得1000场战斗',
    icon: '🌟',
    type: 'battle',
    requirement: { type: 'win_battle', target: 1000 },
    rewards: { gold: 50000, title: '无双战神' }
  },
  {
    id: 'ach_level_5',
    name: '初窥门径',
    description: '达到练气期5层',
    icon: '📖',
    type: 'level',
    requirement: { type: 'reach_level', target: 5 },
    rewards: { gold: 200 }
  },
  {
    id: 'ach_level_9',
    name: '练气圆满',
    description: '达到练气期9层',
    icon: '📚',
    type: 'level',
    requirement: { type: 'reach_level', target: 9 },
    rewards: { gold: 500 }
  },
  {
    id: 'ach_realm_zhuji',
    name: '筑基修士',
    description: '成功渡劫进入筑基期',
    icon: '🏛️',
    type: 'level',
    requirement: { type: 'reach_realm', target: 2 },
    rewards: { gold: 1000 }
  },
  {
    id: 'ach_realm_jindan',
    name: '金丹真人',
    description: '成功渡劫进入金丹期',
    icon: '💎',
    type: 'level',
    requirement: { type: 'reach_realm', target: 3 },
    rewards: { gold: 3000 }
  },
  {
    id: 'ach_realm_yuanying',
    name: '元婴尊者',
    description: '成功渡劫进入元婴期',
    icon: '👼',
    type: 'level',
    requirement: { type: 'reach_realm', target: 4 },
    rewards: { gold: 8000 }
  },
  {
    id: 'ach_realm_huashen',
    name: '化神大能',
    description: '成功渡劫进入化神期',
    icon: '🔥',
    type: 'level',
    requirement: { type: 'reach_realm', target: 5 },
    rewards: { gold: 20000, title: '化神大能' }
  },
  {
    id: 'ach_realm_heti',
    name: '合体至尊',
    description: '成功渡劫进入合体期',
    icon: '⚡',
    type: 'level',
    requirement: { type: 'reach_realm', target: 6 },
    rewards: { gold: 50000, title: '合体至尊' }
  },
  {
    id: 'ach_realm_dacheng',
    name: '大乘仙尊',
    description: '成功渡劫进入大乘期',
    icon: '🌟',
    type: 'level',
    requirement: { type: 'reach_realm', target: 7 },
    rewards: { gold: 100000, title: '大乘仙尊' }
  },
  {
    id: 'ach_gold_10000',
    name: '小有积蓄',
    description: '累计获得10000金币',
    icon: '💰',
    type: 'collection',
    requirement: { type: 'total_gold', target: 10000 },
    rewards: { gold: 500 }
  },
  {
    id: 'ach_gold_100000',
    name: '富甲一方',
    description: '累计获得100000金币',
    icon: '💎',
    type: 'collection',
    requirement: { type: 'total_gold', target: 100000 },
    rewards: { gold: 5000 }
  },
  {
    id: 'ach_gold_1000000',
    name: '富可敌国',
    description: '累计获得1000000金币',
    icon: '👑',
    type: 'collection',
    requirement: { type: 'total_gold', target: 1000000 },
    rewards: { gold: 50000, title: '富可敌国' }
  },
  {
    id: 'ach_kill_boss_10',
    name: '妖魔克星',
    description: '击败10个Boss级怪物',
    icon: '👹',
    type: 'battle',
    requirement: { type: 'kill_boss', target: 10 },
    rewards: { gold: 3000 }
  },
  {
    id: 'ach_tribulation_success',
    name: '渡劫成功',
    description: '成功渡劫1次',
    icon: '🌈',
    type: 'special',
    requirement: { type: 'tribulation_success', target: 1 },
    rewards: { gold: 1000 }
  },
  {
    id: 'ach_tribulation_5',
    name: '渡劫大师',
    description: '成功渡劫5次',
    icon: '✨',
    type: 'special',
    requirement: { type: 'tribulation_success', target: 5 },
    rewards: { gold: 20000, title: '渡劫大师' }
  }
];

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'event_treasure_chest',
    name: '神秘宝箱',
    description: '你在路边发现了一个神秘的宝箱...',
    icon: '📦',
    type: 'treasure',
    choices: [
      {
        id: 'open',
        text: '打开宝箱',
        outcomes: [
          { probability: 0.5, effects: { gold: 500, message: '宝箱里有500金币！' } },
          { probability: 0.3, effects: { gold: 1000, exp: 200, message: '宝箱里有1000金币和200经验！' } },
          { probability: 0.15, effects: { item: 'pill_exp_medium', message: '宝箱里有一颗悟道丹！' } },
          { probability: 0.05, effects: { item: 'tribulation_pill', message: '宝箱里有一颗渡劫丹！' } }
        ]
      },
      {
        id: 'ignore',
        text: '无视离开',
        outcomes: [
          { probability: 1, effects: { message: '你选择离开，也许错过了什么...' } }
        ]
      }
    ]
  },
  {
    id: 'event_wounded_cultivator',
    name: '受伤的修士',
    description: '你遇到了一位受伤的修士，他似乎需要帮助...',
    icon: '🧑‍🦽',
    type: 'opportunity',
    choices: [
      {
        id: 'help',
        text: '帮助他（消耗50气血）',
        requirements: { minHp: 50 },
        outcomes: [
          { probability: 0.6, effects: { hp: -50, gold: 300, message: '修士感激地给了你300金币！' } },
          { probability: 0.3, effects: { hp: -50, exp: 500, message: '修士传授给你一些修炼心得，获得500经验！' } },
          { probability: 0.1, effects: { hp: -50, item: 'pill_maxhp_small', message: '修士赠送你一颗壮骨丹！' } }
        ]
      },
      {
        id: 'ignore',
        text: '无视离开',
        outcomes: [
          { probability: 1, effects: { message: '你选择离开...' } }
        ]
      }
    ]
  },
  {
    id: 'event_spirit_vein',
    name: '灵脉发现',
    description: '你发现了一处小型灵脉，可以在此修炼...',
    icon: '✨',
    type: 'opportunity',
    choices: [
      {
        id: 'meditate',
        text: '在此修炼',
        outcomes: [
          { probability: 0.7, effects: { exp: 300, message: '你在灵脉处修炼，获得300经验！' } },
          { probability: 0.2, effects: { exp: 800, message: '灵脉灵气充沛，获得800经验！' } },
          { probability: 0.1, effects: { exp: 1500, item: 'pill_exp_medium', message: '灵脉爆发，获得1500经验和一颗悟道丹！' } }
        ]
      },
      {
        id: 'leave',
        text: '继续赶路',
        outcomes: [
          { probability: 1, effects: { message: '你选择继续前进...' } }
        ]
      }
    ]
  },
  {
    id: 'event_monster_ambush',
    name: '妖兽伏击',
    description: '突然，一只妖兽从暗处扑来！',
    icon: '🐺',
    type: 'danger',
    choices: [
      {
        id: 'fight',
        text: '迎战',
        outcomes: [
          { probability: 0.6, effects: { hp: -30, gold: 200, exp: 150, message: '你击退了妖兽，获得200金币和150经验！' } },
          { probability: 0.3, effects: { hp: -50, gold: 400, exp: 300, message: '激战后获胜，获得400金币和300经验！' } },
          { probability: 0.1, effects: { hp: -80, gold: 100, message: '艰难获胜，但损失惨重...' } }
        ]
      },
      {
        id: 'escape',
        text: '逃跑',
        outcomes: [
          { probability: 0.7, effects: { message: '你成功逃脱了！' } },
          { probability: 0.3, effects: { hp: -20, message: '逃跑时被攻击，损失20气血...' } }
        ]
      }
    ]
  },
  {
    id: 'event_merchant',
    name: '神秘商人',
    description: '一位神秘的商人向你兜售物品...',
    icon: '🧙',
    type: 'opportunity',
    choices: [
      {
        id: 'buy_cheap',
        text: '购买便宜货（100金币）',
        requirements: { minGold: 100 },
        outcomes: [
          { probability: 0.5, effects: { gold: -100, item: 'pill_hp_medium', message: '你买到了一颗回血丹！' } },
          { probability: 0.3, effects: { gold: -100, item: 'pill_exp_small', message: '你买到了一颗精元丹！' } },
          { probability: 0.2, effects: { gold: -100, message: '你买到了...一块石头？上当了！' } }
        ]
      },
      {
        id: 'buy_expensive',
        text: '购买珍品（500金币）',
        requirements: { minGold: 500 },
        outcomes: [
          { probability: 0.4, effects: { gold: -500, item: 'pill_exp_large', message: '你买到了一颗天灵丹！' } },
          { probability: 0.3, effects: { gold: -500, item: 'tribulation_pill', message: '你买到了一颗渡劫丹！' } },
          { probability: 0.2, effects: { gold: -500, item: 'pill_maxhp_medium', message: '你买到了一颗固元丹！' } },
          { probability: 0.1, effects: { gold: -500, message: '商人消失了，你的钱也没了...' } }
        ]
      },
      {
        id: 'ignore',
        text: '无视离开',
        outcomes: [
          { probability: 1, effects: { message: '你选择离开...' } }
        ]
      }
    ]
  },
  {
    id: 'event_ancient_ruins',
    name: '上古遗迹',
    description: '你发现了一处上古遗迹，里面似乎有宝物...',
    icon: '🏛️',
    type: 'mystery',
    minRealm: '筑基期',
    choices: [
      {
        id: 'explore',
        text: '探索遗迹',
        outcomes: [
          { probability: 0.3, effects: { exp: 1000, gold: 800, message: '你在遗迹中发现了宝藏，获得800金币和1000经验！' } },
          { probability: 0.25, effects: { hp: -100, exp: 1500, message: '触发机关，但获得1500经验！' } },
          { probability: 0.25, effects: { item: 'pill_maxhp_large', message: '你发现了一颗龙血丹！' } },
          { probability: 0.2, effects: { hp: -150, message: '遗迹崩塌，你仓皇逃出...' } }
        ]
      },
      {
        id: 'leave',
        text: '离开',
        outcomes: [
          { probability: 1, effects: { message: '你选择离开这处遗迹...' } }
        ]
      }
    ]
  },
  {
    id: 'event_celestial_phenomenon',
    name: '天象异变',
    description: '天空中出现奇异的光芒，似乎蕴含天地灵气...',
    icon: '🌌',
    type: 'opportunity',
    minRealm: '金丹期',
    choices: [
      {
        id: 'absorb',
        text: '吸收灵气',
        outcomes: [
          { probability: 0.5, effects: { exp: 2000, message: '你吸收了天地灵气，获得2000经验！' } },
          { probability: 0.3, effects: { exp: 5000, mp: 50, message: '灵气充沛，获得5000经验和50灵力！' } },
          { probability: 0.2, effects: { item: 'pill_maxmp_large', message: '你领悟了天道，获得一颗天灵玄丹！' } }
        ]
      },
      {
        id: 'observe',
        text: '静观其变',
        outcomes: [
          { probability: 0.6, effects: { exp: 500, message: '你静静观察，获得500经验。' } },
          { probability: 0.4, effects: { exp: 1000, gold: 500, message: '天象过后，你发现了500金币！' } }
        ]
      }
    ]
  }
];

export function getRandomEvent(realm: RealmType): RandomEvent | null {
  const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
  const currentIndex = realmOrder.indexOf(realm);
  
  const availableEvents = RANDOM_EVENTS.filter(event => {
    if (!event.minRealm) return true;
    const minIndex = realmOrder.indexOf(event.minRealm);
    return currentIndex >= minIndex;
  });
  
  if (availableEvents.length === 0) return null;
  if (Math.random() > 0.15) return null;
  
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

export const DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_wolf_den',
    name: '狼穴',
    description: '野狼聚集的洞穴，适合新手历练',
    icon: '🐺',
    requiredRealm: '练气期',
    floors: [
      { level: 1, monsters: ['monster_qi_1', 'monster_qi_1'] },
      { level: 2, monsters: ['monster_qi_1', 'monster_qi_1', 'monster_qi_1'] },
      { level: 3, monsters: ['monster_qi_2', 'monster_qi_2'], boss: 'monster_qi_3' }
    ],
    rewards: { exp: 500, gold: 300, items: ['pill_hp_medium', 'pill_exp_small'] },
    cooldown: 3600000
  },
  {
    id: 'dungeon_fox_cave',
    name: '妖狐洞',
    description: '妖狐盘踞的洞穴，危机四伏',
    icon: '🦊',
    requiredRealm: '练气期',
    floors: [
      { level: 1, monsters: ['monster_qi_3', 'monster_qi_3'] },
      { level: 2, monsters: ['monster_qi_4', 'monster_qi_4'] },
      { level: 3, monsters: ['monster_qi_5', 'monster_qi_5'], boss: 'monster_qi_6' }
    ],
    rewards: { exp: 1000, gold: 600, items: ['pill_exp_medium', 'pill_hp_large'] },
    cooldown: 3600000
  },
  {
    id: 'dungeon_demon_tower',
    name: '魔塔',
    description: '封印着强大妖魔的古塔',
    icon: '🗼',
    requiredRealm: '筑基期',
    floors: [
      { level: 1, monsters: ['monster_zhuji_1', 'monster_zhuji_1'] },
      { level: 2, monsters: ['monster_zhuji_2', 'monster_zhuji_2', 'monster_zhuji_2'] },
      { level: 3, monsters: ['monster_zhuji_3', 'monster_zhuji_4'], boss: 'monster_zhuji_5' }
    ],
    rewards: { exp: 3000, gold: 2000, items: ['pill_exp_large', 'tribulation_pill'] },
    cooldown: 7200000
  },
  {
    id: 'dungeon_dragon_palace',
    name: '龙宫遗迹',
    description: '上古龙族留下的宫殿',
    icon: '🐉',
    requiredRealm: '金丹期',
    floors: [
      { level: 1, monsters: ['monster_jindan_1', 'monster_jindan_2'] },
      { level: 2, monsters: ['monster_jindan_3', 'monster_jindan_3', 'monster_jindan_4'] },
      { level: 3, monsters: ['monster_jindan_5', 'monster_jindan_6'], boss: 'monster_jindan_7' }
    ],
    rewards: { exp: 10000, gold: 8000, items: ['pill_exp_large', 'pill_exp_large', 'tribulation_pill'] },
    cooldown: 14400000
  },
  {
    id: 'dungeon_celestial_realm',
    name: '天界裂缝',
    description: '通往天界的裂缝，充满未知的危险',
    icon: '🌟',
    requiredRealm: '元婴期',
    floors: [
      { level: 1, monsters: ['monster_yuanying_1', 'monster_yuanying_2'] },
      { level: 2, monsters: ['monster_yuanying_3', 'monster_yuanying_3', 'monster_yuanying_4'] },
      { level: 3, monsters: ['monster_yuanying_5', 'monster_yuanying_6'], boss: 'monster_yuanying_7' }
    ],
    rewards: { exp: 50000, gold: 40000, items: ['pill_exp_large', 'tribulation_pill', 'tribulation_pill'] },
    cooldown: 28800000
  }
];

export function getAvailableDungeons(realm: RealmType): Dungeon[] {
  const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
  const currentIndex = realmOrder.indexOf(realm);
  
  return DUNGEONS.filter(dungeon => {
    const dungeonIndex = realmOrder.indexOf(dungeon.requiredRealm);
    return currentIndex >= dungeonIndex;
  });
}

export const DAILY_SIGN_IN_REWARDS: DailySignInReward[] = [
  { day: 1, rewards: { gold: 100 } },
  { day: 2, rewards: { gold: 150, exp: 100 } },
  { day: 3, rewards: { gold: 200, item: 'pill_hp_medium', itemQuantity: 2 } },
  { day: 4, rewards: { gold: 300, exp: 300 } },
  { day: 5, rewards: { gold: 400, item: 'pill_exp_medium' } },
  { day: 6, rewards: { gold: 500, exp: 500 } },
  { day: 7, rewards: { gold: 1000, item: 'tribulation_pill', exp: 1000 } },
  { day: 14, rewards: { gold: 2000, item: 'pill_maxhp_medium', exp: 2000 } },
  { day: 21, rewards: { gold: 3000, item: 'pill_maxmp_medium', exp: 3000 } },
  { day: 30, rewards: { gold: 5000, item: 'tribulation_pill', itemQuantity: 2, exp: 5000 } }
];

export function getDailySignInReward(consecutiveDays: number): DailySignInReward | null {
  return DAILY_SIGN_IN_REWARDS.find(r => r.day === consecutiveDays) || null;
}

export function getNextSignInReward(consecutiveDays: number): DailySignInReward | null {
  const nextReward = DAILY_SIGN_IN_REWARDS.find(r => r.day > consecutiveDays);
  return nextReward || null;
}
