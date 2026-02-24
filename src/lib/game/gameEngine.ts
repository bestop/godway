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
  TribulationPillItem,
  PlayerPet,
  PetSkill,
  SKILLS,
  getSamsaraRequirement,
  getSamsaraBonuses
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
  
  // 初始化技能
  const initialSkills = SKILLS.map(skill => ({
    skillId: skill.id,
    level: 1,
    unlocked: false,
    currentCooldown: 0
  }));
  
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
    },
  
    // 宠物系统
    pets: [],
    
    // 技能系统
    skills: initialSkills,
    
    // 轮回系统
    samsara: {
      currentCycle: 0,
      totalCycles: 0,
      cycleBonuses: getSamsaraBonuses(0),
      cycleRequirements: {
        exp: getSamsaraRequirement(0)
      },
      canSamsara: false
    },
    
    // 总累计经验
    totalExp: 0
  };
}

// 计算宠物属性加成
export function calculatePetBonus(character: Character): { hp: number; mp: number; atk: number; def: number } {
  let bonusHp = 0;
  let bonusMp = 0;
  let bonusAtk = 0;
  let bonusDef = 0;
  
  // 只计算激活状态的宠物
  const activePets = character.pets?.filter(pet => pet.isActive) || [];
  
  activePets.forEach(pet => {
    bonusHp += pet.pet.stats.hp || 0;
    bonusMp += 0; // 宠物没有MP属性
    bonusAtk += pet.pet.stats.atk || 0;
    bonusDef += pet.pet.stats.def || 0;
  });
  
  return { hp: bonusHp, mp: bonusMp, atk: bonusAtk, def: bonusDef };
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
  
  // 计算宠物加成
  const petBonus = calculatePetBonus(character);
  bonusHp += petBonus.hp;
  bonusMp += petBonus.mp;
  bonusAtk += petBonus.atk;
  bonusDef += petBonus.def;
  
  // 计算轮回加成
  const samsaraBonuses = character.samsara?.cycleBonuses || {
    atk: 0, def: 0, hp: 0, mp: 0, expRate: 1, goldRate: 1
  };
  bonusHp += samsaraBonuses.hp;
  bonusMp += samsaraBonuses.mp;
  bonusAtk += samsaraBonuses.atk;
  bonusDef += samsaraBonuses.def;
  
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
  monster: Monster,
  isGodMode: boolean = false
): { logs: BattleLogEntry[]; result: 'win' | 'lose'; finalHp: number } {
  const logs: BattleLogEntry[] = [];
  let playerHp = character.stats.hp;
  let monsterHp = monster.hp;
  let round = 0;
  
  const playerStats = calculateStatsWithEquipment(character);
  const playerAtk = playerStats.atk;
  const playerDef = playerStats.def;
  
  if (isGodMode) {
    logs.push({
      id: generateId(),
      round: 0,
      type: 'player_attack',
      message: '🛡️ 无敌模式激活！你不会受到任何伤害！'
    });
  }
  
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
    
    // 宠物攻击
    const activePets = character.pets?.filter(pet => pet.isActive) || [];
    activePets.forEach(pet => {
      if (monsterHp > 0) {
        const petAtk = pet.pet.stats.atk || 0;
        const petDamage = Math.max(1, Math.floor(petAtk * 0.8 * (1 - monster.def / (monster.def + 150))));
        monsterHp -= petDamage;
        logs.push({
          id: generateId(),
          round,
          type: 'player_attack',
          message: `${pet.pet.name}对${monster.name}造成了${petDamage}点伤害`,
          damage: petDamage
        });
      }
    });
    
    if (monsterHp <= 0) break;
    
    // 怪物攻击 - 无敌模式下不受伤害
    if (isGodMode) {
      logs.push({
        id: generateId(),
        round,
        type: 'monster_attack',
        message: `${monster.name}的攻击被无敌护盾完全抵挡！`,
        damage: 0
      });
    } else {
      playerHp -= monsterDamage;
      logs.push({
        id: generateId(),
        round,
        type: 'monster_attack',
        message: `${monster.name}对你造成了${monsterDamage}点伤害`,
        damage: monsterDamage
      });
    }
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
  
  // 更新总累计经验
  const newTotalExp = (character.totalExp || 0) + exp;
  
  // 检查是否升级
  while (currentExp >= character.expToNext && currentLevel < 9) {
    currentExp -= character.expToNext;
    currentLevel++;
    leveledUp = true;
    
    // 更新下一级所需经验
    character = {
      ...character,
      level: currentLevel,
      exp: currentExp,
      expToNext: calculateExpToNext(currentRealm, currentLevel)
    };
  }
  
  // 9层时经验可以继续累积，但需要渡劫才能升级
  // 不再重置经验，让玩家可以累积超过上限的经验
  
  return {
    character: {
      ...character,
      exp: currentExp,
      level: currentLevel,
      expToNext: calculateExpToNext(currentRealm, currentLevel),
      totalExp: newTotalExp
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
  inventory: InventoryItem[],
  quantity: number = 1
): { character: Character; inventory: InventoryItem[]; message: string } {
  let message = '';
  let updatedCharacter = { ...character };
  let updatedInventory = [...inventory];
  
  // 检查背包中物品数量是否足够
  const invItem = inventory.find(i => i.item.id === item.id);
  const actualQuantity = invItem ? Math.min(quantity, invItem.quantity) : 0;
  if (actualQuantity <= 0) {
    return { character: updatedCharacter, inventory: updatedInventory, message: '物品数量不足' };
  }
  
  if (item.type === 'pill') {
    const pill = item as PillItem;
    const totalValue = pill.value * actualQuantity;
    
    if (pill.effect === 'hp') {
      const newHp = Math.min(
        updatedCharacter.stats.maxHp,
        updatedCharacter.stats.hp + totalValue
      );
      const actualHeal = newHp - updatedCharacter.stats.hp;
      updatedCharacter.stats.hp = newHp;
      message = `使用了${actualQuantity}个${pill.name}，恢复了${actualHeal}点气血`;
    } else if (pill.effect === 'mp') {
      const newMp = Math.min(
        updatedCharacter.stats.maxMp,
        updatedCharacter.stats.mp + totalValue
      );
      const actualRestore = newMp - updatedCharacter.stats.mp;
      updatedCharacter.stats.mp = newMp;
      message = `使用了${actualQuantity}个${pill.name}，恢复了${actualRestore}点灵力`;
    } else if (pill.effect === 'exp') {
      const result = addExperience(updatedCharacter, totalValue);
      updatedCharacter = result.character;
      message = `使用了${actualQuantity}个${pill.name}，获得了${totalValue}点经验`;
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
          maxHp: currentBonus + totalValue,
          maxMp: updatedCharacter.permanentBonuses?.maxMp || 0
        }
      };
      // 重新计算属性
      const newStats = calculateStatsWithEquipment(updatedCharacter);
      updatedCharacter.stats = { ...newStats, hp: newStats.maxHp };
      message = `使用了${actualQuantity}个${pill.name}，永久增加了${totalValue}点最大气血！`;
    } else if (pill.effect === 'maxMp') {
      // 永久增加最大灵力
      const currentBonus = updatedCharacter.permanentBonuses?.maxMp || 0;
      updatedCharacter = {
        ...updatedCharacter,
        permanentBonuses: {
          ...updatedCharacter.permanentBonuses,
          maxHp: updatedCharacter.permanentBonuses?.maxHp || 0,
          maxMp: currentBonus + totalValue
        }
      };
      // 重新计算属性
      const newStats = calculateStatsWithEquipment(updatedCharacter);
      updatedCharacter.stats = { ...newStats, mp: newStats.maxMp };
      message = `使用了${actualQuantity}个${pill.name}，永久增加了${totalValue}点最大灵力！`;
    } else if (pill.effect === 'skill') {
      // 技能升级 - 需要选择技能，这里先默认升级第一个解锁的技能
      const firstUnlockedSkillIndex = updatedCharacter.skills.findIndex(s => s.unlocked);
      if (firstUnlockedSkillIndex >= 0) {
        const skillToUpgrade = updatedCharacter.skills[firstUnlockedSkillIndex];
        const newLevel = skillToUpgrade.level + totalValue;
        updatedCharacter.skills = [...updatedCharacter.skills];
        updatedCharacter.skills[firstUnlockedSkillIndex] = {
          ...skillToUpgrade,
          level: newLevel
        };
        message = `使用了${actualQuantity}个${pill.name}，技能等级提升${totalValue}级！`;
      } else {
        message = `没有解锁的技能可以升级！`;
      }
    }
  } else if (item.type === 'tribulation_pill') {
    updatedCharacter.tribulationPills += actualQuantity;
    message = `使用了${actualQuantity}个${item.name}，渡劫时将增加${actualQuantity * 10}%成功率`;
  } else if (item.type === 'equipment') {
    const equipment = item as EquipmentItem;
    const result = equipItem(updatedCharacter, equipment);
    message = result.message;
    if (result.success) {
      updatedCharacter = result.character;
      // 从背包移除新装备
      updatedInventory = removeFromInventory(updatedInventory, item.id, 1);
      // 将旧装备放回背包
      if (result.oldEquipment) {
        updatedInventory = addToInventory(updatedInventory, result.oldEquipment, 1);
      }
    }
    return { character: updatedCharacter, inventory: updatedInventory, message };
  }
  
  // 减少物品数量（装备物品已经处理，不执行这里）
  if (item.type !== 'equipment') {
    updatedInventory = removeFromInventory(updatedInventory, item.id, actualQuantity);
  }
  
  return { character: updatedCharacter, inventory: updatedInventory, message };
}

// 装备物品
export function equipItem(character: Character, equipment: EquipmentItem): { success: boolean; message: string; character: Character; oldEquipment: EquipmentItem | null } {
  const slot = equipment.equipmentType;
  const oldEquipment = character.equipment[slot];
  
  // 检查需求境界
  if (equipment.requiredRealm) {
    const currentIndex = REALMS.findIndex(r => r.name === character.realm);
    const requiredIndex = REALMS.findIndex(r => r.name === equipment.requiredRealm);
    if (currentIndex < requiredIndex) {
      return { 
        success: false, 
        message: `境界不足，需要${equipment.requiredRealm}才能装备`, 
        character,
        oldEquipment: null
      };
    }
  }
  
  const updatedCharacter = {
    ...character,
    equipment: {
      ...character.equipment,
      [slot]: equipment
    }
  };
  
  // 更新属性
  const newStats = calculateStatsWithEquipment(updatedCharacter);
  updatedCharacter.stats = newStats;
  
  let message = `装备了${equipment.name}`;
  if (oldEquipment) {
    message += `，${oldEquipment.name}已放回背包`;
  }
  
  return { success: true, message, character: updatedCharacter, oldEquipment };
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

// 升级指定技能
export function upgradeSkill(character: Character, skillId: string, levels: number = 1): { character: Character; message: string; success: boolean } {
  const skillIndex = character.skills.findIndex(s => s.skillId === skillId);
  
  if (skillIndex === -1) {
    return { character, message: '未找到该技能', success: false };
  }
  
  const skillToUpgrade = character.skills[skillIndex];
  
  if (!skillToUpgrade.unlocked) {
    return { character, message: '技能尚未解锁', success: false };
  }
  
  const newLevel = skillToUpgrade.level + levels;
  
  const updatedSkills = [...character.skills];
  updatedSkills[skillIndex] = {
    ...skillToUpgrade,
    level: newLevel
  };
  
  const updatedCharacter = {
    ...character,
    skills: updatedSkills
  };
  
  return { 
    character: updatedCharacter, 
    message: `技能升级成功！当前等级: ${newLevel}`, 
    success: true 
  };
}

// 计算技能效果（考虑技能等级加成）
export function calculateSkillEffect(skill: any, skillLevel: number = 1) {
  const levelMultiplier = 1 + (skillLevel - 1) * 0.1; // 每级增加10%效果
  
  return {
    damage: skill.effect.damage ? Math.floor(skill.effect.damage * levelMultiplier) : undefined,
    damageMultiplier: skill.effect.damageMultiplier ? skill.effect.damageMultiplier * levelMultiplier : undefined,
    heal: skill.effect.heal ? Math.floor(skill.effect.heal * levelMultiplier) : undefined,
    healMultiplier: skill.effect.healMultiplier ? skill.effect.healMultiplier * levelMultiplier : undefined
  };
}
