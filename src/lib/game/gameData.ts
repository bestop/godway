// 游戏数据定义
import { 
  GameItem, 
  Monster, 
  PillItem, 
  TribulationPillItem, 
  EquipmentItem, 
  MaterialItem,
  RealmType,
  EquipmentType,
  ItemQuality
} from '@/types/game';

// 丹药列表
export const PILLS: PillItem[] = [
  {
    id: 'pill_hp_small',
    name: '回气丹',
    type: 'pill',
    description: '恢复50点气血',
    icon: '💊',
    effect: 'hp',
    value: 50
  },
  {
    id: 'pill_hp_medium',
    name: '回血丹',
    type: 'pill',
    description: '恢复150点气血',
    icon: '💊',
    effect: 'hp',
    value: 150
  },
  {
    id: 'pill_hp_large',
    name: '复元丹',
    type: 'pill',
    description: '恢复500点气血',
    icon: '💊',
    effect: 'hp',
    value: 500
  },
  {
    id: 'pill_mp_small',
    name: '聚灵丹',
    type: 'pill',
    description: '恢复30点灵力',
    icon: '💊',
    effect: 'mp',
    value: 30
  },
  {
    id: 'pill_mp_large',
    name: '凝神丹',
    type: 'pill',
    description: '恢复100点灵力',
    icon: '💊',
    effect: 'mp',
    value: 100
  },
  {
    id: 'pill_exp_small',
    name: '精元丹',
    type: 'pill',
    description: '增加100点经验',
    icon: '🌟',
    effect: 'exp',
    value: 100
  },
  {
    id: 'pill_exp_medium',
    name: '悟道丹',
    type: 'pill',
    description: '增加500点经验',
    icon: '🌟',
    effect: 'exp',
    value: 500
  },
  {
    id: 'pill_exp_large',
    name: '天灵丹',
    type: 'pill',
    description: '增加2000点经验',
    icon: '🌟',
    effect: 'exp',
    value: 2000
  },
  // 永久提升丹药
  {
    id: 'pill_maxhp_small',
    name: '壮骨丹',
    type: 'pill',
    description: '永久增加20点最大气血',
    icon: '❤️',
    effect: 'maxHp',
    value: 20
  },
  {
    id: 'pill_maxhp_medium',
    name: '固元丹',
    type: 'pill',
    description: '永久增加50点最大气血',
    icon: '❤️',
    effect: 'maxHp',
    value: 50
  },
  {
    id: 'pill_maxhp_large',
    name: '龙血丹',
    type: 'pill',
    description: '永久增加120点最大气血',
    icon: '❤️',
    effect: 'maxHp',
    value: 120
  },
  {
    id: 'pill_maxmp_small',
    name: '灵心丹',
    type: 'pill',
    description: '永久增加15点最大灵力',
    icon: '💫',
    effect: 'maxMp',
    value: 15
  },
  {
    id: 'pill_maxmp_medium',
    name: '清灵丹',
    type: 'pill',
    description: '永久增加40点最大灵力',
    icon: '💫',
    effect: 'maxMp',
    value: 40
  },
  {
    id: 'pill_maxmp_large',
    name: '天灵玄丹',
    type: 'pill',
    description: '永久增加100点最大灵力',
    icon: '💫',
    effect: 'maxMp',
    value: 100
  },
  // 技能丹药
  {
    id: 'pill_skill_small',
    name: '悟道丹',
    type: 'pill',
    description: '技能熟练度+1',
    icon: '📖',
    effect: 'skill',
    value: 1
  },
  {
    id: 'pill_skill_medium',
    name: '通玄丹',
    type: 'pill',
    description: '技能熟练度+3',
    icon: '📖',
    effect: 'skill',
    value: 3
  },
  {
    id: 'pill_skill_large',
    name: '天悟丹',
    type: 'pill',
    description: '技能熟练度+10',
    icon: '📖',
    effect: 'skill',
    value: 10
  }
];

// 渡劫丹
export const TRIBULATION_PILLS: TribulationPillItem[] = [
  {
    id: 'tribulation_pill',
    name: '渡劫丹',
    type: 'tribulation_pill',
    description: '渡劫时提高10%成功率，最多叠加5颗',
    icon: '🔮',
    bonusRate: 0.1
  }
];

// 装备列表 - 武器
export const WEAPONS: EquipmentItem[] = [
  // 练气期武器
  {
    id: 'weapon_qi_1',
    name: '木剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'common',
    description: '普通的木剑，适合练气期修士使用',
    icon: '🗡️',
    stats: { atk: 5 },
    requiredRealm: '练气期'
  },
  {
    id: 'weapon_qi_2',
    name: '铁剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'fine',
    description: '精铁打造的剑，锋利无比',
    icon: '🗡️',
    stats: { atk: 12 },
    requiredRealm: '练气期'
  },
  {
    id: 'weapon_qi_3',
    name: '青云剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'rare',
    description: '蕴含灵气的宝剑',
    icon: '⚔️',
    stats: { atk: 25 },
    requiredRealm: '练气期'
  },
  // 筑基期武器
  {
    id: 'weapon_zhuji_1',
    name: '流光剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'fine',
    description: '剑身流转光芒，筑基期利器',
    icon: '⚔️',
    stats: { atk: 35 },
    requiredRealm: '筑基期'
  },
  {
    id: 'weapon_zhuji_2',
    name: '玄铁剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'rare',
    description: '玄铁铸造，重达千斤',
    icon: '⚔️',
    stats: { atk: 55 },
    requiredRealm: '筑基期'
  },
  {
    id: 'weapon_zhuji_3',
    name: '紫电剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'epic',
    description: '蕴含雷电之力，威力惊人',
    icon: '⚡',
    stats: { atk: 80, mp: 20 },
    requiredRealm: '筑基期'
  },
  // 金丹期武器
  {
    id: 'weapon_jindan_1',
    name: '金光剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'rare',
    description: '金光闪闪，锋芒毕露',
    icon: '✨',
    stats: { atk: 100 },
    requiredRealm: '金丹期'
  },
  {
    id: 'weapon_jindan_2',
    name: '星辰剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'epic',
    description: '蕴含星辰之力的神剑',
    icon: '💫',
    stats: { atk: 150, mp: 50 },
    requiredRealm: '金丹期'
  },
  {
    id: 'weapon_jindan_3',
    name: '九天玄剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'legendary',
    description: '传说中的神剑，九天玄铁打造',
    icon: '🌟',
    stats: { atk: 220, mp: 80, hp: 100 },
    requiredRealm: '金丹期'
  },
  // 元婴期武器
  {
    id: 'weapon_yuanying_1',
    name: '元婴剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'epic',
    description: '元婴境界方可驾驭的宝剑',
    icon: '🗡️',
    stats: { atk: 250, mp: 100 },
    requiredRealm: '元婴期'
  },
  {
    id: 'weapon_yuanying_2',
    name: '虚空剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'legendary',
    description: '可穿梭虚空的神秘之剑',
    icon: '🌀',
    stats: { atk: 350, mp: 150, hp: 200 },
    requiredRealm: '元婴期'
  },
  // 化神期武器
  {
    id: 'weapon_huashen_1',
    name: '化神剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'legendary',
    description: '化神境界的至宝',
    icon: '⚡',
    stats: { atk: 500, mp: 200, hp: 300 },
    requiredRealm: '化神期'
  },
  // 合体期武器
  {
    id: 'weapon_heti_1',
    name: '合体神剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'legendary',
    description: '合体期的无上神兵',
    icon: '🔥',
    stats: { atk: 800, mp: 300, hp: 500 },
    requiredRealm: '合体期'
  },
  // 大乘期武器
  {
    id: 'weapon_dacheng_1',
    name: '天道剑',
    type: 'equipment',
    equipmentType: 'weapon',
    quality: 'legendary',
    description: '蕴含天道之力的至高神剑',
    icon: '👑',
    stats: { atk: 1200, mp: 500, hp: 800 },
    requiredRealm: '大乘期'
  }
];

// 装备列表 - 防具
export const ARMORS: EquipmentItem[] = [
  // 练气期防具
  {
    id: 'armor_qi_1',
    name: '布衣',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'common',
    description: '普通的布衣，防御力有限',
    icon: '👕',
    stats: { def: 3 },
    requiredRealm: '练气期'
  },
  {
    id: 'armor_qi_2',
    name: '皮甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'fine',
    description: '兽皮制成的护甲',
    icon: '🥋',
    stats: { def: 8 },
    requiredRealm: '练气期'
  },
  {
    id: 'armor_qi_3',
    name: '青云袍',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'rare',
    description: '蕴含灵气的道袍',
    icon: '👘',
    stats: { def: 18, hp: 30 },
    requiredRealm: '练气期'
  },
  // 筑基期防具
  {
    id: 'armor_zhuji_1',
    name: '玄铁甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'fine',
    description: '玄铁打造的护甲',
    icon: '🛡️',
    stats: { def: 30, hp: 50 },
    requiredRealm: '筑基期'
  },
  {
    id: 'armor_zhuji_2',
    name: '紫云甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'rare',
    description: '紫色云纹装饰的护甲',
    icon: '🛡️',
    stats: { def: 50, hp: 80 },
    requiredRealm: '筑基期'
  },
  {
    id: 'armor_zhuji_3',
    name: '雷神甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'epic',
    description: '蕴含雷电之力的护甲',
    icon: '⚡',
    stats: { def: 75, hp: 120, mp: 30 },
    requiredRealm: '筑基期'
  },
  // 金丹期防具
  {
    id: 'armor_jindan_1',
    name: '金丹袍',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'rare',
    description: '金丹境界的法袍',
    icon: '✨',
    stats: { def: 100, hp: 150 },
    requiredRealm: '金丹期'
  },
  {
    id: 'armor_jindan_2',
    name: '星辰甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'epic',
    description: '蕴含星辰之力的铠甲',
    icon: '💫',
    stats: { def: 150, hp: 200, mp: 50 },
    requiredRealm: '金丹期'
  },
  {
    id: 'armor_jindan_3',
    name: '九天神甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'legendary',
    description: '传说中的神甲',
    icon: '🌟',
    stats: { def: 220, hp: 350, mp: 100 },
    requiredRealm: '金丹期'
  },
  // 元婴期防具
  {
    id: 'armor_yuanying_1',
    name: '元婴袍',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'epic',
    description: '元婴境界的法宝',
    icon: '🛡️',
    stats: { def: 280, hp: 400, mp: 120 },
    requiredRealm: '元婴期'
  },
  {
    id: 'armor_yuanying_2',
    name: '虚空甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'legendary',
    description: '可抵御虚空之力的神秘铠甲',
    icon: '🌀',
    stats: { def: 400, hp: 600, mp: 200 },
    requiredRealm: '元婴期'
  },
  // 化神期防具
  {
    id: 'armor_huashen_1',
    name: '化神甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'legendary',
    description: '化神境界的至宝',
    icon: '⚡',
    stats: { def: 600, hp: 800, mp: 300 },
    requiredRealm: '化神期'
  },
  // 合体期防具
  {
    id: 'armor_heti_1',
    name: '合体神甲',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'legendary',
    description: '合体期的无上防御',
    icon: '🔥',
    stats: { def: 900, hp: 1200, mp: 450 },
    requiredRealm: '合体期'
  },
  // 大乘期防具
  {
    id: 'armor_dacheng_1',
    name: '天道法袍',
    type: 'equipment',
    equipmentType: 'armor',
    quality: 'legendary',
    description: '蕴含天道之力的至高法袍',
    icon: '👑',
    stats: { def: 1500, hp: 2000, mp: 800 },
    requiredRealm: '大乘期'
  }
];

// 装备列表 - 饰品
export const ACCESSORIES: EquipmentItem[] = [
  // 练气期饰品
  {
    id: 'accessory_qi_1',
    name: '灵石',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'common',
    description: '蕴含微弱灵气的石头',
    icon: '💎',
    stats: { hp: 20 },
    requiredRealm: '练气期'
  },
  {
    id: 'accessory_qi_2',
    name: '玉佩',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'fine',
    description: '温润的玉佩',
    icon: '📿',
    stats: { hp: 40, mp: 15 },
    requiredRealm: '练气期'
  },
  {
    id: 'accessory_qi_3',
    name: '青云佩',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'rare',
    description: '蕴含灵气的玉佩',
    icon: '📿',
    stats: { hp: 80, mp: 30 },
    requiredRealm: '练气期'
  },
  // 筑基期饰品
  {
    id: 'accessory_zhuji_1',
    name: '筑基玉',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'fine',
    description: '筑基期修士常用饰品',
    icon: '💎',
    stats: { hp: 100, mp: 40 },
    requiredRealm: '筑基期'
  },
  {
    id: 'accessory_zhuji_2',
    name: '紫云佩',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'rare',
    description: '紫色云纹玉佩',
    icon: '📿',
    stats: { hp: 150, mp: 60 },
    requiredRealm: '筑基期'
  },
  {
    id: 'accessory_zhuji_3',
    name: '雷神珠',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'epic',
    description: '蕴含雷电之力的宝珠',
    icon: '⚡',
    stats: { hp: 200, mp: 100 },
    requiredRealm: '筑基期'
  },
  // 金丹期饰品
  {
    id: 'accessory_jindan_1',
    name: '金丹玉',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'rare',
    description: '金丹境界的宝物',
    icon: '✨',
    stats: { hp: 250, mp: 120 },
    requiredRealm: '金丹期'
  },
  {
    id: 'accessory_jindan_2',
    name: '星辰珠',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'epic',
    description: '蕴含星辰之力的宝珠',
    icon: '💫',
    stats: { hp: 350, mp: 180 },
    requiredRealm: '金丹期'
  },
  {
    id: 'accessory_jindan_3',
    name: '九天神玉',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'legendary',
    description: '传说中的神玉',
    icon: '🌟',
    stats: { hp: 500, mp: 280 },
    requiredRealm: '金丹期'
  },
  // 元婴期饰品
  {
    id: 'accessory_yuanying_1',
    name: '元婴珠',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'epic',
    description: '元婴境界的法宝',
    icon: '💎',
    stats: { hp: 600, mp: 350 },
    requiredRealm: '元婴期'
  },
  {
    id: 'accessory_yuanying_2',
    name: '虚空玉',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'legendary',
    description: '可穿梭虚空的神秘玉石',
    icon: '🌀',
    stats: { hp: 900, mp: 500 },
    requiredRealm: '元婴期'
  },
  // 化神期饰品
  {
    id: 'accessory_huashen_1',
    name: '化神珠',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'legendary',
    description: '化神境界的至宝',
    icon: '⚡',
    stats: { hp: 1200, mp: 700 },
    requiredRealm: '化神期'
  },
  // 合体期饰品
  {
    id: 'accessory_heti_1',
    name: '合体神玉',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'legendary',
    description: '合体期的无上宝物',
    icon: '🔥',
    stats: { hp: 1800, mp: 1000 },
    requiredRealm: '合体期'
  },
  // 大乘期饰品
  {
    id: 'accessory_dacheng_1',
    name: '天道之玉',
    type: 'equipment',
    equipmentType: 'accessory',
    quality: 'legendary',
    description: '蕴含天道之力的至高宝物',
    icon: '👑',
    stats: { hp: 3000, mp: 1500 },
    requiredRealm: '大乘期'
  }
];

// 材料列表
export const MATERIALS: MaterialItem[] = [
  {
    id: 'material_iron',
    name: '玄铁矿',
    type: 'material',
    description: '锻造装备的基础材料',
    icon: '🪨',
    rarity: 'common'
  },
  {
    id: 'material_crystal',
    name: '灵晶',
    type: 'material',
    description: '蕴含灵气的晶石',
    icon: '💎',
    rarity: 'fine'
  },
  {
    id: 'material_jade',
    name: '灵玉',
    type: 'material',
    description: '高品质的灵玉',
    icon: '📿',
    rarity: 'rare'
  },
  {
    id: 'material_essence',
    name: '妖丹',
    type: 'material',
    description: '妖兽体内的内丹',
    icon: '🔮',
    rarity: 'epic'
  },
  {
    id: 'material_soul',
    name: '天魂石',
    type: 'material',
    description: '蕴含天道的神秘石头',
    icon: '🌟',
    rarity: 'legendary'
  }
];

// 所有物品列表
export const ALL_ITEMS: GameItem[] = [
  ...PILLS,
  ...TRIBULATION_PILLS,
  ...WEAPONS,
  ...ARMORS,
  ...ACCESSORIES,
  ...MATERIALS
];

// 根据ID获取物品
export function getItemById(id: string): GameItem | undefined {
  return ALL_ITEMS.find(item => item.id === id);
}

// 怪物列表 - 降低难度：提高掉落率和奖励
export const MONSTERS: Monster[] = [
  // 练气期怪物
  {
    id: 'monster_qi_1',
    name: '野狼',
    realm: '练气期',
    level: 1,
    hp: 40,
    atk: 6,
    def: 2,
    exp: 25,
    gold: 15,
    drops: [
      { itemId: 'pill_hp_small', rate: 0.6 },
      { itemId: 'material_iron', rate: 0.3 }
    ],
    icon: '🐺'
  },
  {
    id: 'monster_qi_2',
    name: '山贼',
    realm: '练气期',
    level: 2,
    hp: 65,
    atk: 10,
    def: 4,
    exp: 45,
    gold: 30,
    drops: [
      { itemId: 'pill_hp_small', rate: 0.6 },
      { itemId: 'weapon_qi_1', rate: 0.1 }
    ],
    icon: '🗡️'
  },
  {
    id: 'monster_qi_3',
    name: '妖狐',
    realm: '练气期',
    level: 3,
    hp: 100,
    atk: 15,
    def: 6,
    exp: 70,
    gold: 50,
    drops: [
      { itemId: 'pill_hp_small', rate: 0.65 },
      { itemId: 'weapon_qi_2', rate: 0.08 },
      { itemId: 'material_crystal', rate: 0.2 }
    ],
    icon: '🦊'
  },
  {
    id: 'monster_qi_4',
    name: '石魔',
    realm: '练气期',
    level: 4,
    hp: 150,
    atk: 18,
    def: 12,
    exp: 100,
    gold: 70,
    drops: [
      { itemId: 'pill_hp_medium', rate: 0.55 },
      { itemId: 'armor_qi_2', rate: 0.08 },
      { itemId: 'material_iron', rate: 0.4 }
    ],
    icon: '🗿'
  },
  {
    id: 'monster_qi_5',
    name: '邪修',
    realm: '练气期',
    level: 5,
    hp: 200,
    atk: 25,
    def: 16,
    exp: 150,
    gold: 100,
    drops: [
      { itemId: 'pill_hp_medium', rate: 0.6 },
      { itemId: 'pill_exp_small', rate: 0.35 },
      { itemId: 'weapon_qi_3', rate: 0.06 }
    ],
    icon: '👤'
  },
  {
    id: 'monster_qi_6',
    name: '灵蛇',
    realm: '练气期',
    level: 6,
    hp: 280,
    atk: 32,
    def: 20,
    exp: 200,
    gold: 130,
    drops: [
      { itemId: 'pill_hp_medium', rate: 0.65 },
      { itemId: 'pill_mp_small', rate: 0.3 },
      { itemId: 'accessory_qi_2', rate: 0.06 }
    ],
    icon: '🐍'
  },
  {
    id: 'monster_qi_7',
    name: '魔化熊',
    realm: '练气期',
    level: 7,
    hp: 380,
    atk: 42,
    def: 28,
    exp: 260,
    gold: 180,
    drops: [
      { itemId: 'pill_hp_large', rate: 0.55 },
      { itemId: 'armor_qi_3', rate: 0.06 },
      { itemId: 'material_crystal', rate: 0.25 }
    ],
    icon: '🐻'
  },
  {
    id: 'monster_qi_8',
    name: '厉鬼',
    realm: '练气期',
    level: 8,
    hp: 480,
    atk: 55,
    def: 32,
    exp: 350,
    gold: 250,
    drops: [
      { itemId: 'pill_hp_large', rate: 0.6 },
      { itemId: 'pill_exp_medium', rate: 0.4 },
      { itemId: 'accessory_qi_3', rate: 0.06 }
    ],
    icon: '👻'
  },
  {
    id: 'monster_qi_9',
    name: '妖王',
    realm: '练气期',
    level: 9,
    hp: 600,
    atk: 68,
    def: 40,
    exp: 450,
    gold: 350,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.15 },
      { itemId: 'weapon_qi_3', rate: 0.1 },
      { itemId: 'pill_exp_medium', rate: 0.4 }
    ],
    icon: '👹'
  },
  // 筑基期怪物 - 降低难度
  {
    id: 'monster_zhuji_1',
    name: '筑基妖兽',
    realm: '筑基期',
    level: 1,
    hp: 900,
    atk: 95,
    def: 48,
    exp: 700,
    gold: 500,
    drops: [
      { itemId: 'pill_hp_large', rate: 0.55 },
      { itemId: 'weapon_zhuji_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_zhuji_2',
    name: '邪道修士',
    realm: '筑基期',
    level: 2,
    hp: 1200,
    atk: 120,
    def: 64,
    exp: 950,
    gold: 700,
    drops: [
      { itemId: 'pill_hp_large', rate: 0.6 },
      { itemId: 'armor_zhuji_1', rate: 0.05 }
    ],
    icon: '🧙'
  },
  {
    id: 'monster_zhuji_3',
    name: '血魔',
    realm: '筑基期',
    level: 3,
    hp: 1500,
    atk: 145,
    def: 80,
    exp: 1300,
    gold: 900,
    drops: [
      { itemId: 'pill_exp_medium', rate: 0.45 },
      { itemId: 'weapon_zhuji_2', rate: 0.05 }
    ],
    icon: '🧛'
  },
  {
    id: 'monster_zhuji_4',
    name: '金刚兽',
    realm: '筑基期',
    level: 4,
    hp: 2000,
    atk: 175,
    def: 105,
    exp: 1800,
    gold: 1200,
    drops: [
      { itemId: 'material_jade', rate: 0.2 },
      { itemId: 'armor_zhuji_2', rate: 0.05 }
    ],
    icon: '🦁'
  },
  {
    id: 'monster_zhuji_5',
    name: '蛟龙',
    realm: '筑基期',
    level: 5,
    hp: 2500,
    atk: 220,
    def: 120,
    exp: 2400,
    gold: 1600,
    drops: [
      { itemId: 'pill_exp_medium', rate: 0.5 },
      { itemId: 'accessory_zhuji_2', rate: 0.05 }
    ],
    icon: '🐲'
  },
  {
    id: 'monster_zhuji_6',
    name: '天魔',
    realm: '筑基期',
    level: 6,
    hp: 3200,
    atk: 280,
    def: 145,
    exp: 3200,
    gold: 2100,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.18 },
      { itemId: 'weapon_zhuji_3', rate: 0.04 }
    ],
    icon: '😈'
  },
  {
    id: 'monster_zhuji_7',
    name: '妖皇',
    realm: '筑基期',
    level: 7,
    hp: 4000,
    atk: 340,
    def: 175,
    exp: 4200,
    gold: 2700,
    drops: [
      { itemId: 'weapon_zhuji_3', rate: 0.05 },
      { itemId: 'armor_zhuji_3', rate: 0.05 }
    ],
    icon: '👑'
  },
  {
    id: 'monster_zhuji_8',
    name: '魔尊',
    realm: '筑基期',
    level: 8,
    hp: 4800,
    atk: 400,
    def: 210,
    exp: 5500,
    gold: 3500,
    drops: [
      { itemId: 'pill_exp_large', rate: 0.15 },
      { itemId: 'accessory_zhuji_3', rate: 0.05 }
    ],
    icon: '👿'
  },
  {
    id: 'monster_zhuji_9',
    name: '筑基巅峰妖王',
    realm: '筑基期',
    level: 9,
    hp: 6000,
    atk: 480,
    def: 240,
    exp: 7500,
    gold: 4500,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.22 },
      { itemId: 'weapon_zhuji_3', rate: 0.08 }
    ],
    icon: '👹'
  },
  // 金丹期怪物 - 降低难度
  {
    id: 'monster_jindan_1',
    name: '金丹妖王',
    realm: '金丹期',
    level: 1,
    hp: 8000,
    atk: 640,
    def: 320,
    exp: 12000,
    gold: 6500,
    drops: [
      { itemId: 'pill_exp_large', rate: 0.3 },
      { itemId: 'weapon_jindan_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_jindan_2',
    name: '散仙',
    realm: '金丹期',
    level: 2,
    hp: 10000,
    atk: 760,
    def: 385,
    exp: 15000,
    gold: 8500,
    drops: [
      { itemId: 'weapon_jindan_2', rate: 0.04 },
      { itemId: 'armor_jindan_1', rate: 0.04 }
    ],
    icon: '🧙'
  },
  {
    id: 'monster_jindan_3',
    name: '血海魔',
    realm: '金丹期',
    level: 3,
    hp: 12500,
    atk: 880,
    def: 440,
    exp: 19000,
    gold: 11000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.2 },
      { itemId: 'material_essence', rate: 0.15 }
    ],
    icon: '🧛'
  },
  {
    id: 'monster_jindan_4',
    name: '神兽',
    realm: '金丹期',
    level: 4,
    hp: 15500,
    atk: 1040,
    def: 520,
    exp: 25000,
    gold: 14500,
    drops: [
      { itemId: 'weapon_jindan_3', rate: 0.04 },
      { itemId: 'armor_jindan_2', rate: 0.04 }
    ],
    icon: '🦁'
  },
  {
    id: 'monster_jindan_5',
    name: '蛟龙王',
    realm: '金丹期',
    level: 5,
    hp: 19500,
    atk: 1200,
    def: 600,
    exp: 32000,
    gold: 18500,
    drops: [
      { itemId: 'pill_exp_large', rate: 0.35 },
      { itemId: 'accessory_jindan_2', rate: 0.04 }
    ],
    icon: '🐲'
  },
  {
    id: 'monster_jindan_6',
    name: '天魔王',
    realm: '金丹期',
    level: 6,
    hp: 24000,
    atk: 1440,
    def: 720,
    exp: 40000,
    gold: 24000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.25 },
      { itemId: 'weapon_jindan_3', rate: 0.05 }
    ],
    icon: '😈'
  },
  {
    id: 'monster_jindan_7',
    name: '妖帝',
    realm: '金丹期',
    level: 7,
    hp: 29500,
    atk: 1760,
    def: 880,
    exp: 50000,
    gold: 29000,
    drops: [
      { itemId: 'armor_jindan_3', rate: 0.04 },
      { itemId: 'material_soul', rate: 0.08 }
    ],
    icon: '👑'
  },
  {
    id: 'monster_jindan_8',
    name: '魔帝',
    realm: '金丹期',
    level: 8,
    hp: 35000,
    atk: 2080,
    def: 1040,
    exp: 60000,
    gold: 36000,
    drops: [
      { itemId: 'accessory_jindan_3', rate: 0.04 },
      { itemId: 'pill_exp_large', rate: 0.4 }
    ],
    icon: '👿'
  },
  {
    id: 'monster_jindan_9',
    name: '金丹巅峰妖圣',
    realm: '金丹期',
    level: 9,
    hp: 42000,
    atk: 2560,
    def: 1280,
    exp: 78000,
    gold: 45000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.28 },
      { itemId: 'weapon_jindan_3', rate: 0.06 }
    ],
    icon: '👹'
  },
  // 元婴期怪物 - 降低难度
  {
    id: 'monster_yuanying_1',
    name: '元婴妖圣',
    realm: '元婴期',
    level: 1,
    hp: 60000,
    atk: 3600,
    def: 1760,
    exp: 110000,
    gold: 65000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.28 },
      { itemId: 'weapon_yuanying_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_yuanying_2',
    name: '元婴散仙',
    realm: '元婴期',
    level: 2,
    hp: 75000,
    atk: 4400,
    def: 2240,
    exp: 145000,
    gold: 85000,
    drops: [
      { itemId: 'armor_yuanying_1', rate: 0.04 },
      { itemId: 'material_soul', rate: 0.12 }
    ],
    icon: '🧙'
  },
  {
    id: 'monster_yuanying_3',
    name: '血魔尊',
    realm: '元婴期',
    level: 3,
    hp: 95000,
    atk: 5600,
    def: 2800,
    exp: 200000,
    gold: 115000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.3 },
      { itemId: 'accessory_yuanying_1', rate: 0.04 }
    ],
    icon: '🧛'
  },
  {
    id: 'monster_yuanying_4',
    name: '上古神兽',
    realm: '元婴期',
    level: 4,
    hp: 120000,
    atk: 6800,
    def: 3360,
    exp: 260000,
    gold: 155000,
    drops: [
      { itemId: 'weapon_yuanying_2', rate: 0.04 },
      { itemId: 'material_soul', rate: 0.15 }
    ],
    icon: '🦁'
  },
  {
    id: 'monster_yuanying_5',
    name: '龙皇',
    realm: '元婴期',
    level: 5,
    hp: 150000,
    atk: 8000,
    def: 4000,
    exp: 340000,
    gold: 200000,
    drops: [
      { itemId: 'armor_yuanying_2', rate: 0.04 },
      { itemId: 'accessory_yuanying_2', rate: 0.04 }
    ],
    icon: '🐲'
  },
  {
    id: 'monster_yuanying_6',
    name: '天魔帝',
    realm: '元婴期',
    level: 6,
    hp: 185000,
    atk: 9600,
    def: 4800,
    exp: 420000,
    gold: 250000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.35 },
      { itemId: 'weapon_yuanying_2', rate: 0.05 }
    ],
    icon: '😈'
  },
  {
    id: 'monster_yuanying_7',
    name: '妖神',
    realm: '元婴期',
    level: 7,
    hp: 225000,
    atk: 12000,
    def: 6000,
    exp: 520000,
    gold: 310000,
    drops: [
      { itemId: 'material_soul', rate: 0.2 },
      { itemId: 'armor_yuanying_2', rate: 0.05 }
    ],
    icon: '👑'
  },
  {
    id: 'monster_yuanying_8',
    name: '魔神',
    realm: '元婴期',
    level: 8,
    hp: 270000,
    atk: 14400,
    def: 7200,
    exp: 650000,
    gold: 390000,
    drops: [
      { itemId: 'accessory_yuanying_2', rate: 0.05 },
      { itemId: 'tribulation_pill', rate: 0.38 }
    ],
    icon: '👿'
  },
  {
    id: 'monster_yuanying_9',
    name: '元婴巅峰妖祖',
    realm: '元婴期',
    level: 9,
    hp: 320000,
    atk: 17600,
    def: 8800,
    exp: 800000,
    gold: 500000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.4 },
      { itemId: 'weapon_yuanying_2', rate: 0.06 }
    ],
    icon: '👹'
  },
  // 化神期怪物 - 降低难度
  {
    id: 'monster_huashen_1',
    name: '化神妖祖',
    realm: '化神期',
    level: 1,
    hp: 420000,
    atk: 22400,
    def: 11200,
    exp: 1100000,
    gold: 650000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.4 },
      { itemId: 'weapon_huashen_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_huashen_3',
    name: '上古凶兽',
    realm: '化神期',
    level: 3,
    hp: 600000,
    atk: 32000,
    def: 16000,
    exp: 2000000,
    gold: 1200000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.45 },
      { itemId: 'armor_huashen_1', rate: 0.05 }
    ],
    icon: '🦁'
  },
  {
    id: 'monster_huashen_5',
    name: '神龙',
    realm: '化神期',
    level: 5,
    hp: 850000,
    atk: 44000,
    def: 22400,
    exp: 3200000,
    gold: 1900000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.48 },
      { itemId: 'accessory_huashen_1', rate: 0.05 }
    ],
    icon: '🐲'
  },
  {
    id: 'monster_huashen_7',
    name: '天神',
    realm: '化神期',
    level: 7,
    hp: 1100000,
    atk: 56000,
    def: 28000,
    exp: 4500000,
    gold: 2600000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.52 },
      { itemId: 'material_soul', rate: 0.25 }
    ],
    icon: '👑'
  },
  {
    id: 'monster_huashen_9',
    name: '化神巅峰神王',
    realm: '化神期',
    level: 9,
    hp: 1500000,
    atk: 72000,
    def: 36000,
    exp: 6500000,
    gold: 4000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.55 },
      { itemId: 'weapon_huashen_1', rate: 0.08 }
    ],
    icon: '👹'
  },
  // 合体期怪物 - 降低难度
  {
    id: 'monster_heti_1',
    name: '合体神王',
    realm: '合体期',
    level: 1,
    hp: 2200000,
    atk: 96000,
    def: 48000,
    exp: 12000000,
    gold: 6500000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.55 },
      { itemId: 'weapon_heti_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_heti_5',
    name: '仙兽',
    realm: '合体期',
    level: 5,
    hp: 3800000,
    atk: 160000,
    def: 80000,
    exp: 28000000,
    gold: 16000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.6 },
      { itemId: 'armor_heti_1', rate: 0.05 }
    ],
    icon: '🦄'
  },
  {
    id: 'monster_heti_9',
    name: '合体巅峰仙尊',
    realm: '合体期',
    level: 9,
    hp: 6000000,
    atk: 256000,
    def: 128000,
    exp: 55000000,
    gold: 32000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.65 },
      { itemId: 'accessory_heti_1', rate: 0.08 }
    ],
    icon: '👹'
  },
  // 大乘期怪物 - 降低难度
  {
    id: 'monster_dacheng_1',
    name: '大乘仙尊',
    realm: '大乘期',
    level: 1,
    hp: 11000000,
    atk: 400000,
    def: 200000,
    exp: 120000000,
    gold: 65000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.65 },
      { itemId: 'weapon_dacheng_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_dacheng_5',
    name: '仙帝',
    realm: '大乘期',
    level: 5,
    hp: 18000000,
    atk: 640000,
    def: 320000,
    exp: 280000000,
    gold: 160000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.7 },
      { itemId: 'armor_dacheng_1', rate: 0.05 }
    ],
    icon: '👑'
  },
  {
    id: 'monster_dacheng_9',
    name: '大乘巅峰天帝',
    realm: '大乘期',
    level: 9,
    hp: 30000000,
    atk: 960000,
    def: 480000,
    exp: 550000000,
    gold: 320000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.75 },
      { itemId: 'accessory_dacheng_1', rate: 0.08 }
    ],
    icon: '🌟'
  },
  // 渡劫期怪物
  {
    id: 'monster_dujie_1',
    name: '渡劫妖圣',
    realm: '渡劫期',
    level: 1,
    hp: 50000000,
    atk: 1600000,
    def: 800000,
    exp: 1200000000,
    gold: 650000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.75 },
      { itemId: 'weapon_dacheng_1', rate: 0.05 }
    ],
    icon: '🐉'
  },
  {
    id: 'monster_dujie_2',
    name: '天魔至尊',
    realm: '渡劫期',
    level: 2,
    hp: 65000000,
    atk: 2000000,
    def: 1000000,
    exp: 1600000000,
    gold: 850000000,
    drops: [
      { itemId: 'pill_exp_large', rate: 0.5 },
      { itemId: 'armor_dacheng_1', rate: 0.05 }
    ],
    icon: '😈'
  },
  {
    id: 'monster_dujie_3',
    name: '上古神魔',
    realm: '渡劫期',
    level: 3,
    hp: 85000000,
    atk: 2500000,
    def: 1250000,
    exp: 2200000000,
    gold: 1150000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.8 },
      { itemId: 'material_soul', rate: 0.3 }
    ],
    icon: '👹'
  },
  {
    id: 'monster_dujie_4',
    name: '混沌神兽',
    realm: '渡劫期',
    level: 4,
    hp: 110000000,
    atk: 3200000,
    def: 1600000,
    exp: 3000000000,
    gold: 1550000000,
    drops: [
      { itemId: 'weapon_dacheng_1', rate: 0.05 },
      { itemId: 'material_soul', rate: 0.35 }
    ],
    icon: '🦁'
  },
  {
    id: 'monster_dujie_5',
    name: '祖龙',
    realm: '渡劫期',
    level: 5,
    hp: 140000000,
    atk: 4000000,
    def: 2000000,
    exp: 4000000000,
    gold: 2000000000,
    drops: [
      { itemId: 'armor_dacheng_1', rate: 0.05 },
      { itemId: 'accessory_dacheng_1', rate: 0.05 }
    ],
    icon: '🐲'
  },
  {
    id: 'monster_dujie_6',
    name: '大道天魔',
    realm: '渡劫期',
    level: 6,
    hp: 175000000,
    atk: 4800000,
    def: 2400000,
    exp: 5200000000,
    gold: 2500000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.85 },
      { itemId: 'weapon_dacheng_1', rate: 0.06 }
    ],
    icon: '👿'
  },
  {
    id: 'monster_dujie_7',
    name: '大道妖神',
    realm: '渡劫期',
    level: 7,
    hp: 215000000,
    atk: 5600000,
    def: 2800000,
    exp: 6500000000,
    gold: 3100000000,
    drops: [
      { itemId: 'material_soul', rate: 0.4 },
      { itemId: 'armor_dacheng_1', rate: 0.06 }
    ],
    icon: '👑'
  },
  {
    id: 'monster_dujie_8',
    name: '大道魔神',
    realm: '渡劫期',
    level: 8,
    hp: 260000000,
    atk: 6400000,
    def: 3200000,
    exp: 8000000000,
    gold: 3900000000,
    drops: [
      { itemId: 'accessory_dacheng_1', rate: 0.06 },
      { itemId: 'tribulation_pill', rate: 0.9 }
    ],
    icon: '🔥'
  },
  {
    id: 'monster_dujie_9',
    name: '渡劫巅峰道祖',
    realm: '渡劫期',
    level: 9,
    hp: 320000000,
    atk: 8000000,
    def: 4000000,
    exp: 10000000000,
    gold: 5000000000,
    drops: [
      { itemId: 'tribulation_pill', rate: 0.95 },
      { itemId: 'weapon_dacheng_1', rate: 0.08 }
    ],
    icon: '🌟'
  }
];

// 根据境界获取怪物列表
export function getMonstersByRealm(realm: RealmType): Monster[] {
  return MONSTERS.filter(m => m.realm === realm);
}

// 根据境界和层数获取推荐的怪物
export function getRecommendedMonster(realm: RealmType, level: number): Monster | undefined {
  const monsters = getMonstersByRealm(realm);
  // 找到最接近当前等级的怪物
  return monsters.find(m => m.level === Math.min(level, 9)) || monsters[0];
}
