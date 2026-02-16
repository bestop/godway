// 游戏引擎 - 核心逻辑
import {
  Character,
  CharacterStats,
  Monster,
  BattleState,
  BattleLogEntry,
  InventoryItem,
  EquipmentItem,
  GameItem,
  RealmType,
  REALMS,
  getRealmConfig,
  getNextRealm,
  calculateExpToNext,
  calculateBaseStats,
  PillItem,
  TribulationPillItem
} from '@/types/game';
import { getItemById } from './gameData';

// 生成唯一ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 创建新角色 - 降低难度：增加初始金币和丹药
export function createNewCharacter(name: string): Character {
  const realm: RealmType = '练气期';
  const level = 1;
  const baseStats = calculateBaseStats(realm, level);
  
  return {
    name,
    realm,
    level,
    exp: 0,
    expToNext: calculateExpToNext(realm, level),
    gold: 20000,  // 初始金币20000，方便玩家购买装备
    stats: {
      hp: baseStats.baseHp,
      maxHp: baseStats.baseHp,
      mp: baseStats.baseMp,
      maxMp: baseStats.baseMp,
      atk: baseStats.atk,
      def: baseStats.def
    },
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    tribulationPills: 3,  // 初始赠送3颗渡劫丹
    permanentBonuses: {
      maxHp: 0,
      maxMp: 0
    }
  };
}

// 计算装备加成后的属性
export function calculateStatsWithEquipment(character: Character): CharacterStats {
  const baseStats = calculateBaseStats(character.realm, character.level);
  
  let bonusHp = 0;
  let bonusMp = 0;
  let bonusAtk = 0;
  let bonusDef = 0;
  
  // 计算装备加成
  const equipmentSlots = ['weapon', 'armor', 'accessory'] as const;
  equipmentSlots.forEach(slot => {
    const item = character.equipment[slot];
    if (item) {
      bonusHp += item.stats.hp || 0;
      bonusMp += item.stats.mp || 0;
      bonusAtk += item.stats.atk || 0;
      bonusDef += item.stats.def || 0;
    }
  });
  
  // 加上永久加成
  const permanentHp = character.permanentBonuses?.maxHp || 0;
  const permanentMp = character.permanentBonuses?.maxMp || 0;
  
  return {
    hp: baseStats.baseHp + bonusHp + permanentHp,
    maxHp: baseStats.baseHp + bonusHp + permanentHp,
    mp: baseStats.baseMp + bonusMp + permanentMp,
    maxMp: baseStats.baseMp + bonusMp + permanentMp,
    atk: baseStats.atk + bonusAtk,
    def: baseStats.def + bonusDef
  };
}

// 战斗计算 - 单回合（大幅降低难度：玩家伤害提高50%，受到伤害减少35%）
export function calculateBattleRound(
  playerAtk: number,
  playerDef: number,
  monsterAtk: number,
  monsterDef: number
): { playerDamage: number; monsterDamage: number } {
  // 玩家对怪物造成的伤害 - 提高50%伤害
  const playerDamage = Math.max(1, Math.floor(playerAtk * 1.5 * (1 - monsterDef / (monsterDef + 200))));
  
  // 怪物对玩家造成的伤害 - 减少35%伤害
  const monsterDamage = Math.max(1, Math.floor(monsterAtk * 0.65 * (1 - playerDef / (playerDef + 100))));
  
  return { playerDamage, monsterDamage };
}

// 执行战斗
export function executeBattle(
  character: Character,
  monster: Monster
): { logs: BattleLogEntry[]; result: 'win' | 'lose'; finalHp: number } {
  const logs: BattleLogEntry[] = [];
  let playerHp = character.stats.hp;
  let monsterHp = monster.hp;
  let round = 0;
  
  const playerStats = calculateStatsWithEquipment(character);
  const playerAtk = playerStats.atk;
  const playerDef = playerStats.def;
  
  while (playerHp > 0 && monsterHp > 0) {
    round++;
    const { playerDamage, monsterDamage } = calculateBattleRound(
      playerAtk,
      playerDef,
      monster.atk,
      monster.def
    );
    
    // 玩家攻击
    monsterHp -= playerDamage;
    logs.push({
      id: generateId(),
      round,
      type: 'player_attack',
      message: `你对${monster.name}造成了${playerDamage}点伤害`,
      damage: playerDamage
    });
    
    if (monsterHp <= 0) break;
    
    // 怪物攻击
    playerHp -= monsterDamage;
    logs.push({
      id: generateId(),
      round,
      type: 'monster_attack',
      message: `${monster.name}对你造成了${monsterDamage}点伤害`,
      damage: monsterDamage
    });
  }
  
  const result = playerHp > 0 ? 'win' : 'lose';
  logs.push({
    id: generateId(),
    round,
    type: 'result',
    message: result === 'win' ? `你击败了${monster.name}！` : `你被${monster.name}击败了...`
  });
  
  return { logs, result, finalHp: Math.max(0, playerHp) };
}

// 计算掉落
export function calculateDrops(monster: Monster): GameItem[] {
  const drops: GameItem[] = [];
  
  monster.drops.forEach(drop => {
    if (Math.random() < drop.rate) {
      const item = getItemById(drop.itemId);
      if (item) {
        drops.push(item);
      }
    }
  });
  
  return drops;
}

// 添加经验并处理升级
export function addExperience(
  character: Character,
  exp: number
): { character: Character; leveledUp: boolean; newLevel: number; newRealm: boolean } {
  let currentExp = character.exp + exp;
  let currentLevel = character.level;
  let currentRealm = character.realm;
  let leveledUp = false;
  let newRealm = false;
  
  // 检查是否升级
  while (currentExp >= character.expToNext) {
    currentExp -= character.expToNext;
    currentLevel++;
    leveledUp = true;
    
    // 检查是否满层（需要渡劫）
    if (currentLevel > 9) {
      // 在渡劫之前保持在9层
      currentLevel = 9;
      currentExp = character.expToNext - 1; // 经验保持在满级前
      break;
    }
    
    // 更新下一级所需经验
    character = {
      ...character,
      level: currentLevel,
      exp: currentExp,
      expToNext: calculateExpToNext(currentRealm, currentLevel)
    };
  }
  
  return {
    character: {
      ...character,
      exp: currentExp,
      level: currentLevel,
      expToNext: calculateExpToNext(currentRealm, currentLevel)
    },
    leveledUp,
    newLevel: currentLevel,
    newRealm
  };
}

// 使用物品
export function applyItem(
  character: Character,
  item: GameItem,
  inventory: InventoryItem[]
): { character: Character; inventory: InventoryItem[]; message: string } {
  let message = '';
  let updatedCharacter = { ...character };
  let updatedInventory = [...inventory];
  
  if (item.type === 'pill') {
    const pill = item as PillItem;
    if (pill.effect === 'hp') {
      const newHp = Math.min(
        updatedCharacter.stats.maxHp,
        updatedCharacter.stats.hp + pill.value
      );
      updatedCharacter.stats.hp = newHp;
      message = `使用了${pill.name}，恢复了${pill.value}点气血`;
    } else if (pill.effect === 'mp') {
      const newMp = Math.min(
        updatedCharacter.stats.maxMp,
        updatedCharacter.stats.mp + pill.value
      );
      updatedCharacter.stats.mp = newMp;
      message = `使用了${pill.name}，恢复了${pill.value}点灵力`;
    } else if (pill.effect === 'exp') {
      const result = addExperience(updatedCharacter, pill.value);
      updatedCharacter = result.character;
      message = `使用了${pill.name}，获得了${pill.value}点经验`;
      if (result.leveledUp) {
        message += `，升级到了${updatedCharacter.realm}${result.newLevel}层！`;
      }
    } else if (pill.effect === 'maxHp') {
      // 永久增加最大气血
      const currentBonus = updatedCharacter.permanentBonuses?.maxHp || 0;
      updatedCharacter = {
        ...updatedCharacter,
        permanentBonuses: {
          ...updatedCharacter.permanentBonuses,
          maxHp: currentBonus + pill.value,
          maxMp: updatedCharacter.permanentBonuses?.maxMp || 0
        }
      };
      // 重新计算属性
      const newStats = calculateStatsWithEquipment(updatedCharacter);
      updatedCharacter.stats = { ...newStats, hp: newStats.maxHp };
      message = `使用了${pill.name}，永久增加了${pill.value}点最大气血！`;
    } else if (pill.effect === 'maxMp') {
      // 永久增加最大灵力
      const currentBonus = updatedCharacter.permanentBonuses?.maxMp || 0;
      updatedCharacter = {
        ...updatedCharacter,
        permanentBonuses: {
          ...updatedCharacter.permanentBonuses,
          maxHp: updatedCharacter.permanentBonuses?.maxHp || 0,
          maxMp: currentBonus + pill.value
        }
      };
      // 重新计算属性
      const newStats = calculateStatsWithEquipment(updatedCharacter);
      updatedCharacter.stats = { ...newStats, mp: newStats.maxMp };
      message = `使用了${pill.name}，永久增加了${pill.value}点最大灵力！`;
    }
  } else if (item.type === 'tribulation_pill') {
    updatedCharacter.tribulationPills++;
    message = `使用了${item.name}，渡劫时将增加10%成功率`;
  } else if (item.type === 'equipment') {
    const equipment = item as EquipmentItem;
    message = equipItem(updatedCharacter, equipment);
    // 不消耗装备
    return { character: updatedCharacter, inventory: updatedInventory, message };
  }
  
  // 减少物品数量
  updatedInventory = removeFromInventory(updatedInventory, item.id, 1);
  
  return { character: updatedCharacter, inventory: updatedInventory, message };
}

// 装备物品
export function equipItem(character: Character, equipment: EquipmentItem): string {
  const slot = equipment.equipmentType;
  const oldEquipment = character.equipment[slot];
  
  // 检查需求境界
  if (equipment.requiredRealm) {
    const currentIndex = REALMS.findIndex(r => r.name === character.realm);
    const requiredIndex = REALMS.findIndex(r => r.name === equipment.requiredRealm);
    if (currentIndex < requiredIndex) {
      return `境界不足，需要${equipment.requiredRealm}才能装备`;
    }
  }
  
  character.equipment[slot] = equipment;
  
  // 更新属性
  const newStats = calculateStatsWithEquipment(character);
  character.stats = newStats;
  
  let message = `装备了${equipment.name}`;
  if (oldEquipment) {
    message += `，替换了${oldEquipment.name}`;
  }
  
  return message;
}

// 卸下装备
export function unequipItem(character: Character, slot: keyof Character['equipment']): EquipmentItem | null {
  const equipment = character.equipment[slot];
  if (equipment) {
    character.equipment[slot] = null;
    // 更新属性
    const newStats = calculateStatsWithEquipment(character);
    character.stats = newStats;
  }
  return equipment;
}

// 添加物品到背包
export function addToInventory(inventory: InventoryItem[], item: GameItem, quantity: number = 1): InventoryItem[] {
  const existingIndex = inventory.findIndex(i => i.item.id === item.id);
  
  if (existingIndex >= 0) {
    const updated = [...inventory];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity
    };
    return updated;
  }
  
  return [...inventory, { item, quantity }];
}

// 从背包移除物品
export function removeFromInventory(inventory: InventoryItem[], itemId: string, quantity: number = 1): InventoryItem[] {
  const existingIndex = inventory.findIndex(i => i.item.id === itemId);
  
  if (existingIndex >= 0) {
    const updated = [...inventory];
    const newQuantity = updated[existingIndex].quantity - quantity;
    
    if (newQuantity <= 0) {
      return updated.filter((_, index) => index !== existingIndex);
    }
    
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: newQuantity
    };
    return updated;
  }
  
  return inventory;
}

// 渡劫
export function attemptTribulation(character: Character): { success: boolean; message: string; character: Character } {
  if (character.level < 9) {
    return {
      success: false,
      message: '需要达到当前境界9层才能渡劫',
      character
    };
  }
  
  const nextRealm = getNextRealm(character.realm);
  if (!nextRealm) {
    return {
      success: false,
      message: '已达最高境界，无法继续渡劫',
      character
    };
  }
  
  const realmConfig = getRealmConfig(character.realm);
  const baseSuccessRate = realmConfig.tribulationSuccessBase;
  const bonusRate = Math.min(0.5, character.tribulationPills * 0.1); // 最多50%加成
  const totalSuccessRate = baseSuccessRate + bonusRate;
  
  const roll = Math.random();
  const success = roll < totalSuccessRate;
  
  if (success) {
    // 渡劫成功
    const newCharacter: Character = {
      ...character,
      realm: nextRealm,
      level: 1,
      exp: 0,
      expToNext: calculateExpToNext(nextRealm, 1),
      tribulationPills: 0,
      gold: character.gold + 1000 // 渡劫奖励
    };
    
    // 更新属性
    const newStats = calculateStatsWithEquipment(newCharacter);
    newCharacter.stats = newStats;
    
    return {
      success: true,
      message: `恭喜！渡劫成功，晋升为${nextRealm}！获得1000金币奖励！`,
      character: newCharacter
    };
  } else {
    // 渡劫失败
    const newCharacter: Character = {
      ...character,
      level: 1,
      exp: 0,
      expToNext: calculateExpToNext(character.realm, 1),
      tribulationPills: Math.max(0, character.tribulationPills - 1) // 损失一颗渡劫丹
    };
    
    // 更新属性
    const newStats = calculateStatsWithEquipment(newCharacter);
    newCharacter.stats = newStats;
    
    return {
      success: false,
      message: `渡劫失败...修为跌落至${character.realm}1层`,
      character: newCharacter
    };
  }
}

// 修炼恢复 - 降低难度：恢复量提高到20%
export function meditate(character: Character): { character: Character; message: string } {
  const hpRecovery = Math.floor(character.stats.maxHp * 0.2);
  const mpRecovery = Math.floor(character.stats.maxMp * 0.2);
  
  const newHp = Math.min(character.stats.maxHp, character.stats.hp + hpRecovery);
  const newMp = Math.min(character.stats.maxMp, character.stats.mp + mpRecovery);
  
  const actualHpRecovery = newHp - character.stats.hp;
  const actualMpRecovery = newMp - character.stats.mp;
  
  const updatedCharacter: Character = {
    ...character,
    stats: {
      ...character.stats,
      hp: newHp,
      mp: newMp
    }
  };
  
  return {
    character: updatedCharacter,
    message: `修炼中...恢复了${actualHpRecovery}点气血和${actualMpRecovery}点灵力`
  };
}

// 完全恢复
export function fullRestore(character: Character): Character {
  const maxHp = character.stats.maxHp;
  const maxMp = character.stats.maxMp;
  
  return {
    ...character,
    stats: {
      ...character.stats,
      hp: maxHp,
      mp: maxMp
    }
  };
}
