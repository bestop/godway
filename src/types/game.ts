// 游戏类型定义

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
  effect: 'hp' | 'mp' | 'exp' | 'maxHp' | 'maxMp';  // 新增永久提升类型
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

// 游戏日志
export interface GameLogEntry {
  id: string;
  timestamp: number;
  type: 'battle' | 'level_up' | 'tribulation' | 'item' | 'market' | 'system';
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
