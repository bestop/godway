// 游戏类型定义

// 技能类型
export type SkillType = 'attack' | 'heal' | 'buff' | 'debuff' | 'special';
export type SkillTarget = 'self' | 'enemy' | 'all';

// 技能定义
export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: SkillType;
  target: SkillTarget;
  mpCost: number;
  cooldown: number;
  effect: {
    damage?: number;
    damageMultiplier?: number;
    heal?: number;
    healMultiplier?: number;
    buffAtk?: number;
    buffDef?: number;
    debuffAtk?: number;
    debuffDef?: number;
    duration?: number;
  };
  requiredRealm?: RealmType;
  unlockLevel?: number;
}

// 角色技能状态
export interface CharacterSkillState {
  skillId: string;
  currentCooldown: number;
}

// 境界枚举
export type RealmType = 
  | '练气期' 
  | '筑基期' 
  | '金丹期' 
  | '元婴期' 
  | '化神期' 
  | '合体期' 
  | '大乘期' 
  | '渡劫期';

// 境界配置
export interface RealmConfig {
  name: RealmType;
  index: number;
  coefficient: number; // 境界系数
  tribulationSuccessBase: number; // 渡劫基础成功率
}

// 装备品质
export type ItemQuality = 'common' | 'fine' | 'rare' | 'epic' | 'legendary';

// 装备品质中文名
export const QualityNames: Record<ItemQuality, string> = {
  common: '普通',
  fine: '精良',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
};

// 装备品质颜色
export const QualityColors: Record<ItemQuality, string> = {
  common: 'text-gray-400',
  fine: 'text-green-500',
  rare: 'text-blue-400',
  epic: 'text-purple-500',
  legendary: 'text-orange-400'
};

// 装备类型
export type EquipmentType = 'weapon' | 'armor' | 'accessory';

// 装备类型中文名
export const EquipmentTypeNames: Record<EquipmentType, string> = {
  weapon: '武器',
  armor: '防具',
  accessory: '饰品'
};

// 物品类型
export type ItemType = 'pill' | 'equipment' | 'material' | 'tribulation_pill';

// 物品类型中文名
export const ItemTypeNames: Record<ItemType, string> = {
  pill: '丹药',
  equipment: '装备',
  material: '材料',
  tribulation_pill: '渡劫丹'
};

// 基础物品接口
export interface BaseItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  icon: string;
}

// 丹药物品
export interface PillItem extends BaseItem {
  type: 'pill';
  effect: 'hp' | 'mp' | 'exp' | 'maxHp' | 'maxMp' | 'skill';  // 新增技能升级类型
  value: number; // 效果值
}

// 渡劫丹
export interface TribulationPillItem extends BaseItem {
  type: 'tribulation_pill';
  bonusRate: number; // 增加的成功率
}

// 装备物品
export interface EquipmentItem extends BaseItem {
  type: 'equipment';
  equipmentType: EquipmentType;
  quality: ItemQuality;
  stats: {
    hp?: number;
    atk?: number;
    def?: number;
    mp?: number;
  };
  requiredRealm?: RealmType; // 需求境界
}

// 材料物品
export interface MaterialItem extends BaseItem {
  type: 'material';
  rarity: ItemQuality;
}

// 物品联合类型
export type GameItem = PillItem | EquipmentItem | TribulationPillItem | MaterialItem;

// 背包物品（带数量）
export interface InventoryItem {
  item: GameItem;
  quantity: number;
}

// 装备槽位
export interface EquipmentSlots {
  weapon: EquipmentItem | null;
  armor: EquipmentItem | null;
  accessory: EquipmentItem | null;
}

// 怪物定义
export interface Monster {
  id: string;
  name: string;
  realm: RealmType; // 怪物所属境界
  level: number; // 怪物等级 (1-9)
  hp: number;
  atk: number;
  def: number;
  exp: number; // 击杀经验
  gold: number; // 击杀金币
  drops: MonsterDrop[]; // 掉落列表
  icon: string;
}

// 怪物掉落
export interface MonsterDrop {
  itemId: string;
  rate: number; // 掉落概率 (0-1)
}

// 角色属性
export interface CharacterStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
}

// 轮回系统
export interface SamsaraState {
  currentCycle: number; // 当前轮回次数
  totalCycles: number; // 总轮回次数
  cycleBonuses: {
    atk: number;
    def: number;
    hp: number;
    mp: number;
    expRate: number; // 经验获取倍率
    goldRate: number; // 金币获取倍率
  };
  cycleRequirements: {
    exp: number; // 轮回所需总经验
  };
  canSamsara: boolean; // 是否可以轮回
}

// 角色技能
export interface CharacterSkill {
  skillId: string;
  level: number;
  unlocked: boolean;
  currentCooldown: number;
}

// 角色状态
export interface Character {
  name: string;
  realm: RealmType;
  level: number; // 当前境界层数 (1-9)
  exp: number;
  expToNext: number; // 升级所需经验
  gold: number;
  stats: CharacterStats;
  equipment: EquipmentSlots;
  tribulationPills: number; // 渡劫丹数量
  permanentBonuses: {
    maxHp: number;  // 永久增加的最大气血
    maxMp: number;  // 永久增加的最大灵力
  };
  
  // 宠物系统
  pets: PlayerPet[];
  
  // 技能系统
  skills: CharacterSkill[];
  
  // 轮回系统
  samsara: SamsaraState;
  
  // 总累计经验（用于轮回）
  totalExp: number;
}

// 战斗状态
export interface BattleState {
  inBattle: boolean;
  monster: Monster | null;
  playerHp: number;
  monsterHp: number;
  battleLog: BattleLogEntry[];
  isAuto: boolean;
  result?: 'win' | 'lose' | null;
}

// 战斗日志条目
export interface BattleLogEntry {
  id: string;
  round: number;
  type: 'player_attack' | 'monster_attack' | 'player_skill' | 'info' | 'result';
  message: string;
  damage?: number;
}

// 任务类型
export type QuestType = 'kill' | 'collect' | 'reach_level' | 'reach_realm' | 'use_item' | 'win_battle';

// 任务定义
export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  target: string;
  requiredCount: number;
  rewards: {
    exp?: number;
    gold?: number;
    items?: string[];
  };
  requiredRealm?: RealmType;
  isDaily?: boolean;
}

// 任务进度
export interface QuestProgress {
  questId: string;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
}

// 成就类型
export type AchievementType = 'battle' | 'level' | 'collection' | 'exploration' | 'special';

// 成就定义
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  requirement: {
    type: string;
    target: number;
  };
  rewards: {
    exp?: number;
    gold?: number;
    title?: string;
  };
}

// 成就进度
export interface AchievementProgress {
  achievementId: string;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
}

// 随机事件类型
export type RandomEventType = 'treasure' | 'danger' | 'opportunity' | 'mystery';

// 随机事件定义
export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: RandomEventType;
  choices: RandomEventChoice[];
  minRealm?: RealmType;
}

// 随机事件选项
export interface RandomEventChoice {
  id: string;
  text: string;
  requirements?: {
    minHp?: number;
    minMp?: number;
    minGold?: number;
  };
  outcomes: RandomEventOutcome[];
}

// 随机事件结果
export interface RandomEventOutcome {
  probability: number;
  effects: {
    hp?: number;
    mp?: number;
    gold?: number;
    exp?: number;
    item?: string;
    message: string;
  };
}

// 副本定义
export interface Dungeon {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredRealm: RealmType;
  floors: DungeonFloor[];
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  cooldown: number;
}

// 副本层数
export interface DungeonFloor {
  level: number;
  monsters: string[];
  boss?: string;
}

// 副本进度
export interface DungeonProgress {
  dungeonId: string;
  currentFloor: number;
  completed: boolean;
  lastAttempt: number;
}

// 挂机收益
export interface IdleReward {
  lastClaimTime: number;
  accumulatedExp: number;
  accumulatedGold: number;
  maxAccumulationHours: number;
}

// 每日签到
export interface DailySignIn {
  lastSignInDate: string;
  consecutiveDays: number;
  totalDays: number;
  rewards: DailySignInReward[];
}

// 签到奖励
export interface DailySignInReward {
  day: number;
  rewards: {
    gold?: number;
    exp?: number;
    item?: string;
    itemQuantity?: number;
  };
}

// 作弊码类型
export type CheatCodeType = 'gold' | 'exp' | 'god_mode' | 'instant_level' | 'full_hp' | 'add_item' | 'tribulation_pill' | 'power_up';

// 作弊码定义
export interface CheatCode {
  code: string;
  name: string;
  description: string;
  type: CheatCodeType;
  params?: Record<string, any>;
  duration?: number;
}

// 激活的作弊效果
export interface ActiveCheatEffect {
  id: string;
  type: CheatCodeType;
  startTime: number;
  duration: number;
  params?: Record<string, any>;
}

// 作弊码结果
export interface CheatCodeResult {
  success: boolean;
  message: string;
  effect?: ActiveCheatEffect;
}

// 游戏日志
export interface GameLogEntry {
  id: string;
  timestamp: number;
  type: 'battle' | 'level_up' | 'tribulation' | 'item' | 'market' | 'system' | 'quest' | 'achievement' | 'event' | 'pet';
  message: string;
}

// 市场物品
export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  item: GameItem;
  price: number;
  listedAt: number;
}

// 游戏状态
export interface GameState {
  character: Character;
  inventory: InventoryItem[];
  battle: BattleState;
  logs: GameLogEntry[];
  currentTab: 'battle' | 'cultivation' | 'tribulation' | 'inventory' | 'market';
  isLoading: boolean;
}

// 境界列表 - 降低难度：提高渡劫成功率
export const REALMS: RealmConfig[] = [
  { name: '练气期', index: 0, coefficient: 1, tribulationSuccessBase: 0.85 },
  { name: '筑基期', index: 1, coefficient: 2, tribulationSuccessBase: 0.80 },
  { name: '金丹期', index: 2, coefficient: 3, tribulationSuccessBase: 0.75 },
  { name: '元婴期', index: 3, coefficient: 5, tribulationSuccessBase: 0.70 },
  { name: '化神期', index: 4, coefficient: 8, tribulationSuccessBase: 0.65 },
  { name: '合体期', index: 5, coefficient: 13, tribulationSuccessBase: 0.60 },
  { name: '大乘期', index: 6, coefficient: 21, tribulationSuccessBase: 0.55 },
  { name: '渡劫期', index: 7, coefficient: 34, tribulationSuccessBase: 0.50 },
];

// 获取境界配置
export function getRealmConfig(realm: RealmType): RealmConfig {
  return REALMS.find(r => r.name === realm) || REALMS[0];
}

// 获取下一个境界
export function getNextRealm(currentRealm: RealmType): RealmType | null {
  const index = REALMS.findIndex(r => r.name === currentRealm);
  if (index >= 0 && index < REALMS.length - 1) {
    return REALMS[index + 1].name;
  }
  return null;
}

// 计算升级所需经验
export function calculateExpToNext(realm: RealmType, level: number): number {
  const config = getRealmConfig(realm);
  return 100 * level * config.coefficient;
}

// 计算角色基础属性 - 降低难度：提高基础属性
export function calculateBaseStats(realm: RealmType, level: number): { baseHp: number; baseMp: number; atk: number; def: number } {
  const config = getRealmConfig(realm);
  const realmBonus = config.coefficient;
  
  return {
    baseHp: 150 + level * 20 * realmBonus,  // 提高50%基础HP和成长
    baseMp: 80 + level * 8 * realmBonus,     // 提高60%基础MP和成长
    atk: 15 + level * 3 * realmBonus,         // 提高50%基础攻击和成长
    def: 8 + level * 1.5 * realmBonus,        // 提高60%基础防御和成长
  };
}

// 宠物类型
export type PetType = 'beast' | 'spirit' | 'elemental' | 'divine' | 'demonic';

// 宠物品质
export type PetQuality = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 宠物技能
export interface PetSkill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'support' | 'special';
  power: number;
  cooldown: number; // 冷却回合
  effects: {
    damage?: number;
    heal?: number;
    buff?: {
      stat: 'atk' | 'def' | 'hp' | 'mp';
      value: number;
      duration: number;
    };
    debuff?: {
      stat: 'atk' | 'def';
      value: number;
      duration: number;
    };
  };
}

// 宠物
export interface Pet {
  id: string;
  name: string;
  type: PetType;
  quality: PetQuality;
  level: number;
  exp: number;
  maxExp: number;
  rarity: number; // 稀有度 0-1
  stats: {
    hp: number;
    atk: number;
    def: number;
    speed: number; // 速度，影响出手顺序
  };
  skills: PetSkill[];
  loyalty: number; // 忠诚度 0-100
  affection: number; // 亲密度 0-100
  icon: string;
  description: string;
  obtainedAt: number; // 获得时间戳
  evolvedFrom?: string; // 进化前的宠物ID
  canEvolve: boolean; // 是否可进化
  evolutionLevel?: number; // 进化所需等级
  evolutionPet?: string; // 进化后的宠物ID
}

// 玩家宠物
export interface PlayerPet {
  pet: Pet;
  isActive: boolean; // 是否出战
  nickname?: string; // 昵称
  battleCount: number; // 战斗次数
  winCount: number; // 胜利次数
  skillsLearned: string[]; // 已学习的技能ID
}

// 宠物商店物品
export interface PetShopItem {
  id: string;
  petId: string;
  price: number;
  stock: number;
  rarity: PetQuality;
  type: PetType;
}

// 宠物战斗结果
export interface PetBattleResult {
  success: boolean;
  message: string;
  petExp: number;
  playerExp: number;
  gold: number;
  items: GameItem[];
}

// 宠物配置
export interface PetConfig {
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    speed: number;
  };
  growthRate: {
    hp: number;
    atk: number;
    def: number;
    speed: number;
  };
  skills: PetSkill[];
  evolutionPath?: {
    level: number;
    petId: string;
  };
}

// 宠物数据
export interface PetData {
  id: string;
  name: string;
  type: PetType;
  quality: PetQuality;
  rarity: number;
  icon: string;
  description: string;
  config: PetConfig;
}

// ==========================================
// 技能系统数据
// ==========================================

export const SKILLS: Skill[] = [
  {
    id: 'skill_fireball',
    name: '火球术',
    description: '发射一颗火球，造成攻击力150%的伤害',
    icon: '🔥',
    type: 'attack',
    target: 'enemy',
    mpCost: 10,
    cooldown: 2,
    effect: {
      damageMultiplier: 1.5
    },
    requiredRealm: '练气期',
    unlockLevel: 1
  },
  {
    id: 'skill_heal',
    name: '回春术',
    description: '恢复自身最大气血20%的血量',
    icon: '💚',
    type: 'heal',
    target: 'self',
    mpCost: 15,
    cooldown: 3,
    effect: {
      healMultiplier: 0.2
    },
    requiredRealm: '练气期',
    unlockLevel: 3
  },
  {
    id: 'skill_powerup',
    name: '狂暴',
    description: '提升自身攻击力50%，持续3回合',
    icon: '⚡',
    type: 'buff',
    target: 'self',
    mpCost: 20,
    cooldown: 5,
    effect: {
      buffAtk: 0.5,
      duration: 3
    },
    requiredRealm: '筑基期',
    unlockLevel: 1
  },
  {
    id: 'skill_lightning',
    name: '雷暴术',
    description: '召唤雷电，造成攻击力200%的伤害',
    icon: '⚡',
    type: 'attack',
    target: 'enemy',
    mpCost: 25,
    cooldown: 3,
    effect: {
      damageMultiplier: 2.0
    },
    requiredRealm: '金丹期',
    unlockLevel: 1
  },
  {
    id: 'skill_shield',
    name: '金钟罩',
    description: '提升自身防御力80%，持续3回合',
    icon: '🛡️',
    type: 'buff',
    target: 'self',
    mpCost: 30,
    cooldown: 4,
    effect: {
      buffDef: 0.8,
      duration: 3
    },
    requiredRealm: '元婴期',
    unlockLevel: 1
  },
  {
    id: 'skill_ultimate',
    name: '天魔解体',
    description: '终极技能，造成攻击力500%的伤害，但消耗自身30%当前气血',
    icon: '💥',
    type: 'special',
    target: 'enemy',
    mpCost: 50,
    cooldown: 8,
    effect: {
      damageMultiplier: 5.0
    },
    requiredRealm: '化神期',
    unlockLevel: 1
  }
];

// ==========================================
// 轮回系统配置
// ==========================================

export function getSamsaraRequirement(cycle: number): number {
  const baseExp = 1000000; // 100万经验基础需求
  const multiplier = Math.pow(2, cycle); // 每次轮回需求翻倍
  return Math.floor(baseExp * multiplier);
}

export function getSamsaraBonuses(cycle: number): SamsaraState['cycleBonuses'] {
  return {
    atk: cycle * 50,
    def: cycle * 30,
    hp: cycle * 200,
    mp: cycle * 100,
    expRate: 1 + cycle * 0.1, // 每次轮回增加10%经验获取
    goldRate: 1 + cycle * 0.1 // 每次轮回增加10%金币获取
  };
}
