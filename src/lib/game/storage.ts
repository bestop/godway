// 本地存储管理
import { GameState, Character, InventoryItem, GameLogEntry, MarketListing, GameItem } from '@/types/game';
import { PILLS, TRIBULATION_PILLS, WEAPONS, ARMORS, ACCESSORIES, MATERIALS, ALL_ITEMS } from './gameData';

const STORAGE_KEYS = {
  CHARACTER: 'xiuxian_character',
  INVENTORY: 'xiuxian_inventory',
  LOGS: 'xiuxian_logs',
  MARKET: 'xiuxian_market',
  PLAYER_ID: 'xiuxian_player_id'
};

// NPC商店名称
const NPC_NAMES = [
  '丹药宗师',
  '神兵阁',
  '天材地宝',
  '灵药阁',
  '修仙联盟',
  '法宝轩',
  '聚宝楼',
  '仙缘阁',
  '神丹堂',
  '百宝斋'
];

// 生成NPC出售的市场商品
function generateNPCMarketListings(): MarketListing[] {
  const listings: MarketListing[] = [];
  const now = Date.now();
  let idCounter = 1;
  
  // 添加各种丹药
  PILLS.forEach(pill => {
    const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    const basePrice = pill.effect === 'hp' ? pill.value * 3 : 
                      pill.effect === 'mp' ? pill.value * 4 : 
                      pill.value * 2;
    listings.push({
      id: `npc_market_${idCounter++}`,
      sellerId: 'npc_shop',
      sellerName: npcName,
      item: pill,
      price: basePrice + Math.floor(Math.random() * basePrice * 0.3),
      listedAt: now - Math.floor(Math.random() * 86400000) // 随机时间
    });
  });
  
  // 添加渡劫丹
  TRIBULATION_PILLS.forEach(pill => {
    const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    listings.push({
      id: `npc_market_${idCounter++}`,
      sellerId: 'npc_shop',
      sellerName: npcName,
      item: pill,
      price: 5000 + Math.floor(Math.random() * 2000),
      listedAt: now - Math.floor(Math.random() * 86400000)
    });
  });
  
  // 添加武器 - 每种境界添加多把
  WEAPONS.forEach(weapon => {
    const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    const qualityMultiplier: Record<string, number> = {
      'common': 1,
      'fine': 2,
      'rare': 4,
      'epic': 8,
      'legendary': 20
    };
    const basePrice = (weapon.stats.atk || 0) * 10 * (qualityMultiplier[weapon.quality] || 1);
    listings.push({
      id: `npc_market_${idCounter++}`,
      sellerId: 'npc_shop',
      sellerName: npcName,
      item: weapon,
      price: basePrice + Math.floor(Math.random() * basePrice * 0.5),
      listedAt: now - Math.floor(Math.random() * 86400000)
    });
  });
  
  // 添加防具
  ARMORS.forEach(armor => {
    const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    const qualityMultiplier: Record<string, number> = {
      'common': 1,
      'fine': 2,
      'rare': 4,
      'epic': 8,
      'legendary': 20
    };
    const basePrice = ((armor.stats.def || 0) + (armor.stats.hp || 0) / 10) * 8 * (qualityMultiplier[armor.quality] || 1);
    listings.push({
      id: `npc_market_${idCounter++}`,
      sellerId: 'npc_shop',
      sellerName: npcName,
      item: armor,
      price: basePrice + Math.floor(Math.random() * basePrice * 0.5),
      listedAt: now - Math.floor(Math.random() * 86400000)
    });
  });
  
  // 添加饰品
  ACCESSORIES.forEach(accessory => {
    const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    const qualityMultiplier: Record<string, number> = {
      'common': 1,
      'fine': 2,
      'rare': 4,
      'epic': 8,
      'legendary': 20
    };
    const basePrice = ((accessory.stats.hp || 0) + (accessory.stats.mp || 0)) / 10 * 6 * (qualityMultiplier[accessory.quality] || 1);
    listings.push({
      id: `npc_market_${idCounter++}`,
      sellerId: 'npc_shop',
      sellerName: npcName,
      item: accessory,
      price: Math.max(50, basePrice + Math.floor(Math.random() * basePrice * 0.5)),
      listedAt: now - Math.floor(Math.random() * 86400000)
    });
  });
  
  // 添加材料
  MATERIALS.forEach(material => {
    const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    const rarityMultiplier: Record<string, number> = {
      'common': 1,
      'fine': 2,
      'rare': 5,
      'epic': 15,
      'legendary': 50
    };
    const basePrice = 50 * (rarityMultiplier[material.rarity] || 1);
    // 每种材料添加多个
    for (let i = 0; i < 3; i++) {
      listings.push({
        id: `npc_market_${idCounter++}`,
        sellerId: 'npc_shop',
        sellerName: npcName,
        item: material,
        price: basePrice + Math.floor(Math.random() * basePrice * 0.3),
        listedAt: now - Math.floor(Math.random() * 86400000)
      });
    }
  });
  
  // 添加额外的丹药库存
  PILLS.forEach(pill => {
    for (let i = 0; i < 2; i++) {
      const npcName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
      const basePrice = pill.effect === 'hp' ? pill.value * 3 : 
                        pill.effect === 'mp' ? pill.value * 4 : 
                        pill.value * 2;
      listings.push({
        id: `npc_market_${idCounter++}`,
        sellerId: 'npc_shop',
        sellerName: npcName,
        item: pill,
        price: basePrice + Math.floor(Math.random() * basePrice * 0.3),
        listedAt: now - Math.floor(Math.random() * 86400000)
      });
    }
  });
  
  return listings;
}

// 生成玩家ID
export function getPlayerId(): string {
  let playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
  if (!playerId) {
    playerId = 'player_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    localStorage.setItem(STORAGE_KEYS.PLAYER_ID, playerId);
  }
  return playerId;
}

// 保存角色数据
export function saveCharacter(character: Character): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
  } catch (error) {
    console.error('保存角色数据失败:', error);
  }
}

// 加载角色数据
export function loadCharacter(): Character | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTER);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载角色数据失败:', error);
  }
  return null;
}

// 保存背包数据
export function saveInventory(inventory: InventoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  } catch (error) {
    console.error('保存背包数据失败:', error);
  }
}

// 加载背包数据
export function loadInventory(): InventoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载背包数据失败:', error);
  }
  return [];
}

// 保存日志数据
export function saveLogs(logs: GameLogEntry[]): void {
  try {
    // 只保存最近100条日志
    const recentLogs = logs.slice(-100);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(recentLogs));
  } catch (error) {
    console.error('保存日志数据失败:', error);
  }
}

// 加载日志数据
export function loadLogs(): GameLogEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载日志数据失败:', error);
  }
  return [];
}

// 保存市场数据
export function saveMarket(listings: MarketListing[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MARKET, JSON.stringify(listings));
  } catch (error) {
    console.error('保存市场数据失败:', error);
  }
}

// 加载市场数据
export function loadMarket(): MarketListing[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MARKET);
    if (data) {
      const existingListings = JSON.parse(data);
      // 如果已有数据，合并NPC商品（过滤掉已不存在的NPC商品，重新生成）
      const playerListings = existingListings.filter((l: MarketListing) => l.sellerId !== 'npc_shop');
      const npcListings = generateNPCMarketListings();
      return [...playerListings, ...npcListings];
    }
    // 如果没有市场数据，生成初始NPC商品
    return generateNPCMarketListings();
  } catch (error) {
    console.error('加载市场数据失败:', error);
    return generateNPCMarketListings();
  }
}

// 清除所有数据
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// 导出游戏数据
export function exportGameData(): string {
  const data = {
    character: loadCharacter(),
    inventory: loadInventory(),
    logs: loadLogs(),
    market: loadMarket(),
    playerId: getPlayerId(),
    exportTime: Date.now()
  };
  return JSON.stringify(data);
}

// 导入游戏数据
export function importGameData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.character) saveCharacter(data.character);
    if (data.inventory) saveInventory(data.inventory);
    if (data.logs) saveLogs(data.logs);
    if (data.market) saveMarket(data.market);
    return true;
  } catch (error) {
    console.error('导入游戏数据失败:', error);
    return false;
  }
}
