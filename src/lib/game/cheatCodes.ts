import { 
  CheatCode, 
  CheatCodeResult, 
  CheatCodeType, 
  ActiveCheatEffect,
  Character,
  InventoryItem
} from '@/types/game';
import { getItemById, WEAPONS, ARMORS, ACCESSORIES } from './gameData';
import { addToInventory, addExperience, calculateStatsWithEquipment } from './gameEngine';

export const CHEAT_CODES: CheatCode[] = [
  {
    code: 'show me the money',
    name: '财富密码',
    description: '获得10000金币',
    type: 'gold',
    params: { amount: 10000 }
  },
  {
    code: 'greed is good',
    name: '贪婪之魂',
    description: '获得50000金币',
    type: 'gold',
    params: { amount: 50000 }
  },
  {
    code: 'power overwhelming',
    name: '无敌模式',
    description: '100分钟内无敌，不受任何伤害',
    type: 'god_mode',
    duration: 6000000
  },
  {
    code: 'god mode',
    name: '神之模式',
    description: '100分钟内无敌，不受任何伤害',
    type: 'god_mode',
    duration: 6000000
  },
  {
    code: 'level up',
    name: '快速升级',
    description: '立即获得10000经验',
    type: 'exp',
    params: { amount: 10000 }
  },
  {
    code: 'power level',
    name: '极速升级',
    description: '立即获得100000经验',
    type: 'exp',
    params: { amount: 100000 }
  },
  {
    code: 'heal me',
    name: '完全治愈',
    description: '立即恢复全部气血和灵力',
    type: 'full_hp'
  },
  {
    code: 'give me pill',
    name: '渡劫丹',
    description: '获得5颗渡劫丹',
    type: 'tribulation_pill',
    params: { amount: 5 }
  },
  {
    code: 'power up',
    name: '战力提升',
    description: '攻击力和防御力永久提升50%',
    type: 'power_up',
    params: { atkBonus: 50, defBonus: 50 }
  },
  {
    code: 'instant level',
    name: '直接升级',
    description: '直接升到当前境界9层',
    type: 'instant_level'
  },
  {
    code: 'give me equipment',
    name: '装备礼包',
    description: '获得当前境界的全套装备',
    type: 'add_item',
    params: { items: ['weapon', 'armor', 'accessory'] }
  },
  {
    code: 'i am rich',
    name: '超级富豪',
    description: '获得100000金币和50000经验',
    type: 'gold',
    params: { amount: 100000, exp: 50000 }
  }
];

export function findCheatCode(input: string): CheatCode | null {
  const normalizedInput = input.toLowerCase().trim();
  return CHEAT_CODES.find(cheat => 
    cheat.code.toLowerCase() === normalizedInput ||
    cheat.name === normalizedInput
  ) || null;
}

export function executeCheatCode(
  cheat: CheatCode,
  character: Character,
  inventory: InventoryItem[]
): { result: CheatCodeResult; character: Character; inventory: InventoryItem[] } {
  let updatedCharacter = { ...character };
  let updatedInventory = [...inventory];
  let effect: ActiveCheatEffect | undefined;

  switch (cheat.type) {
    case 'gold':
      const goldAmount = cheat.params?.amount || 10000;
      updatedCharacter.gold += goldAmount;
      let goldMessage = `💰 ${cheat.name}！获得 ${goldAmount.toLocaleString()} 金币！`;
      if (cheat.params?.exp) {
        const expResult = addExperience(updatedCharacter, cheat.params.exp);
        updatedCharacter = expResult.character;
        goldMessage += ` 获得 ${(cheat.params.exp as number).toLocaleString()} 经验！`;
        if (expResult.leveledUp) {
          goldMessage += '升级了！';
        }
      }
      return {
        result: {
          success: true,
          message: goldMessage,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'exp':
      const expAmount = cheat.params?.amount || 10000;
      const expResult = addExperience(updatedCharacter, expAmount);
      updatedCharacter = expResult.character;
      return {
        result: {
          success: true,
          message: `⭐ ${cheat.name}！获得 ${expAmount.toLocaleString()} 经验！${expResult.leveledUp ? '升级了！' : ''}`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'god_mode':
      effect = {
        id: `cheat_${Date.now()}`,
        type: 'god_mode',
        startTime: Date.now(),
        duration: cheat.duration || 6000000
      };
      return {
        result: {
          success: true,
          message: `🛡️ ${cheat.name}！${Math.floor((cheat.duration || 6000000) / 60000)}分钟内无敌！`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'full_hp':
      const stats = calculateStatsWithEquipment(updatedCharacter);
      updatedCharacter.stats = {
        ...updatedCharacter.stats,
        hp: stats.maxHp,
        maxHp: stats.maxHp,
        mp: stats.maxMp,
        maxMp: stats.maxMp
      };
      return {
        result: {
          success: true,
          message: `💚 ${cheat.name}！气血和灵力已完全恢复！`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'tribulation_pill':
      const pillAmount = cheat.params?.amount || 5;
      updatedCharacter.tribulationPills += pillAmount;
      return {
        result: {
          success: true,
          message: `🔮 ${cheat.name}！获得 ${pillAmount} 颗渡劫丹！`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'power_up':
      const atkBonus = cheat.params?.atkBonus || 50;
      const defBonus = cheat.params?.defBonus || 50;
      const currentAtk = updatedCharacter.stats.atk;
      const currentDef = updatedCharacter.stats.def;
      updatedCharacter.stats.atk = Math.floor(currentAtk * (1 + atkBonus / 100));
      updatedCharacter.stats.def = Math.floor(currentDef * (1 + defBonus / 100));
      return {
        result: {
          success: true,
          message: `⚔️ ${cheat.name}！攻击力+${atkBonus}%，防御力+${defBonus}%！`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'instant_level':
      updatedCharacter.level = 9;
      updatedCharacter.exp = 0;
      return {
        result: {
          success: true,
          message: `📈 ${cheat.name}！已升至${updatedCharacter.realm}9层！`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    case 'add_item':
      const itemTypes = cheat.params?.items || [];
      const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
      const realmIndex = Math.max(0, realmOrder.indexOf(character.realm));
      const actualRealmIndex = Math.min(realmIndex, 6); // 装备最多到大乘期
      
      itemTypes.forEach((type: string) => {
        let equipmentList;
        if (type === 'weapon') {
          equipmentList = WEAPONS;
        } else if (type === 'armor') {
          equipmentList = ARMORS;
        } else if (type === 'accessory') {
          equipmentList = ACCESSORIES;
        } else {
          return;
        }
        
        // 获取对应境界的装备
        const realmNames = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期'];
        const targetRealm = realmNames[actualRealmIndex];
        const realmEquipments = equipmentList.filter(e => e.requiredRealm === targetRealm);
        
        if (realmEquipments.length > 0) {
          // 优先选择传说品质，否则选史诗，否则选稀有
          let selectedEquip = realmEquipments.find(e => e.quality === 'legendary');
          if (!selectedEquip) {
            selectedEquip = realmEquipments.find(e => e.quality === 'epic');
          }
          if (!selectedEquip) {
            selectedEquip = realmEquipments.find(e => e.quality === 'rare');
          }
          if (!selectedEquip) {
            selectedEquip = realmEquipments[realmEquipments.length - 1]; // 选最后一个
          }
          
          if (selectedEquip) {
            updatedInventory = addToInventory(updatedInventory, selectedEquip, 1);
          }
        }
      });
      
      return {
        result: {
          success: true,
          message: `🎁 ${cheat.name}！获得当前境界全套装备！`,
          effect
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };

    default:
      return {
        result: {
          success: false,
          message: '未知的作弊码效果'
        },
        character: updatedCharacter,
        inventory: updatedInventory
      };
  }
}

export function isGodModeActive(effects: ActiveCheatEffect[]): boolean {
  const now = Date.now();
  return effects.some(e => 
    e.type === 'god_mode' && 
    now < e.startTime + e.duration
  );
}

export function getRemainingGodModeTime(effects: ActiveCheatEffect[]): number {
  const now = Date.now();
  const godModeEffect = effects.find(e => 
    e.type === 'god_mode' && 
    now < e.startTime + e.duration
  );
  if (!godModeEffect) return 0;
  return Math.max(0, godModeEffect.startTime + godModeEffect.duration - now);
}

export function cleanExpiredEffects(effects: ActiveCheatEffect[]): ActiveCheatEffect[] {
  const now = Date.now();
  return effects.filter(e => now < e.startTime + e.duration);
}
