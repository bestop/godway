'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Character,
  InventoryItem,
  BattleState,
  GameLogEntry,
  GameItem,
  Monster,
  MarketListing,
} from '@/types/game';
import {
  createNewCharacter,
  executeBattle,
  calculateDrops,
  addExperience,
  applyItem,
  equipItem,
  unequipItem,
  addToInventory,
  removeFromInventory,
  attemptTribulation,
  meditate,
  fullRestore,
  generateId,
  calculateStatsWithEquipment,
} from '@/lib/game/gameEngine';
import {
  saveCharacter,
  loadCharacter,
  saveInventory,
  loadInventory,
  saveLogs,
  loadLogs,
  saveMarket,
  loadMarket,
  getPlayerId,
  clearAllData,
} from '@/lib/game/storage';
import { getRecommendedMonster, getItemById } from '@/lib/game/gameData';

export type GameTab = 'battle' | 'cultivation' | 'tribulation' | 'inventory' | 'market' | 'map' | 'quest' | 'achievement' | 'dungeon' | 'daily';

interface UseGameStateReturn {
  // 状态
  character: Character | null;
  inventory: InventoryItem[];
  battle: BattleState;
  logs: GameLogEntry[];
  market: MarketListing[];
  currentTab: GameTab;
  isLoading: boolean;
  playerId: string;
  
  // 操作
  initGame: (name: string) => void;
  resetGame: () => void;
  setTab: (tab: GameTab) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  setCharacter: (character: Character) => void;
  setInventory: (inventory: InventoryItem[]) => void;
  
  // 战斗相关
  startBattle: (monster: Monster, isGodMode?: boolean) => void;
  quickBattle: (isGodMode?: boolean) => void;
  endBattle: () => void;
  mapEncounter: (monster: Monster, isGodMode?: boolean) => void;
  
  // 物品相关
  useItem: (item: GameItem) => void;
  equip: (item: GameItem) => void;
  unequip: (slot: 'weapon' | 'armor' | 'accessory') => void;
  sellItem: (item: GameItem, price: number) => void;
  buyFromMarket: (listingId: string) => void;
  buyNpcItem: (item: GameItem, price: number) => void;
  
  // 其他操作
  doMeditate: () => void;
  doTribulation: () => { success: boolean; message: string };
  restore: () => void;
}

// 惰性初始化函数
function getInitialState() {
  return {
    character: loadCharacter(),
    inventory: loadInventory(),
    logs: loadLogs(),
    market: loadMarket(),
    playerId: getPlayerId()
  };
}

export function useGameState(): UseGameStateReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [battle, setBattle] = useState<BattleState>({
    inBattle: false,
    monster: null,
    playerHp: 0,
    monsterHp: 0,
    battleLog: [],
    isAuto: false,
    result: null
  });
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [market, setMarket] = useState<MarketListing[]>([]);
  const [currentTab, setCurrentTab] = useState<GameTab>('battle');
  const [isLoading, setIsLoading] = useState(true);
  const [playerId, setPlayerId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 客户端挂载后初始化数据 - 使用回调形式避免同步setState警告
  useEffect(() => {
    // 使用函数式更新，React会正确处理
    const loadGameData = () => {
      const initialState = getInitialState();
      setCharacter(initialState.character);
      setInventory(initialState.inventory);
      setLogs(initialState.logs);
      setMarket(initialState.market);
      setPlayerId(initialState.playerId);
      setIsLoading(false);
      setIsInitialized(true);
    };
    
    // 使用 setTimeout 0 确保在渲染完成后执行
    const timer = setTimeout(loadGameData, 0);
    return () => clearTimeout(timer);
  }, []);

  // 自动保存 - 只在初始化完成后保存
  useEffect(() => {
    if (isInitialized && character) {
      saveCharacter(character);
    }
  }, [character, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveInventory(inventory);
    }
  }, [inventory, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveLogs(logs);
    }
  }, [logs, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveMarket(market);
    }
  }, [market, isInitialized]);

  // 添加日志
  const addLog = useCallback((type: GameLogEntry['type'], message: string) => {
    const newLog: GameLogEntry = {
      id: generateId(),
      timestamp: Date.now(),
      type,
      message
    };
    setLogs(prev => [...prev.slice(-99), newLog]);
  }, []);

  // 初始化游戏
  const initGame = useCallback((name: string) => {
    const newCharacter = createNewCharacter(name);
    setCharacter(newCharacter);
    setInventory([]);
    setLogs([]);
    addLog('system', `${name}踏上了修仙之路...`);
  }, [addLog]);

  // 重置游戏
  const resetGame = useCallback(() => {
    clearAllData();
    setCharacter(null);
    setInventory([]);
    setLogs([]);
    setMarket([]);
    setBattle({
      inBattle: false,
      monster: null,
      playerHp: 0,
      monsterHp: 0,
      battleLog: [],
      isAuto: false,
      result: null
    });
    setPlayerId(getPlayerId());
  }, []);

  // 设置标签页
  const setTab = useCallback((tab: GameTab) => {
    setCurrentTab(tab);
  }, []);

  // 开始战斗
  const startBattle = useCallback((monster: Monster) => {
    if (!character) return;
    
    setBattle({
      inBattle: true,
      monster,
      playerHp: character.stats.hp,
      monsterHp: monster.hp,
      battleLog: [],
      isAuto: false,
      result: null
    });
    
    addLog('battle', `开始与${monster.name}战斗！`);
  }, [character, addLog]);

  // 快速战斗
  const quickBattle = useCallback((isGodMode: boolean = false) => {
    if (!character || battle.inBattle) return;
    
    const monster = getRecommendedMonster(character.realm, character.level);
    if (!monster) return;
    
    // 执行战斗
    const { logs: battleLogs, result, finalHp } = executeBattle(character, monster, isGodMode);
    
    // 更新角色状态
    let updatedCharacter = { ...character };
    updatedCharacter.stats.hp = finalHp;
    
    // 处理战斗结果
    if (result === 'win') {
      // 获得经验和金币
      const expResult = addExperience(updatedCharacter, monster.exp);
      updatedCharacter = expResult.character;
      updatedCharacter.gold += monster.gold;
      
      // 获得掉落物
      const drops = calculateDrops(monster);
      let newInventory = [...inventory];
      drops.forEach(item => {
        newInventory = addToInventory(newInventory, item, 1);
        addLog('item', `获得了${item.name}！`);
      });
      setInventory(newInventory);
      
      addLog('battle', `击败了${monster.name}，获得${monster.exp}经验和${monster.gold}金币`);
      
      if (expResult.leveledUp) {
        addLog('level_up', `恭喜！升级到了${updatedCharacter.realm}${expResult.newLevel}层！`);
      }
    } else {
      addLog('battle', `被${monster.name}击败了...`);
    }
    
    // 更新血量
    const stats = calculateStatsWithEquipment(updatedCharacter);
    updatedCharacter.stats = { ...updatedCharacter.stats, maxHp: stats.maxHp, maxMp: stats.maxMp };
    
    setCharacter(updatedCharacter);
    setBattle({
      inBattle: false,
      monster,
      playerHp: finalHp,
      monsterHp: 0,
      battleLog: battleLogs,
      isAuto: false,
      result
    });
  }, [character, battle.inBattle, inventory, addLog]);

  // 地图遇怪战斗
  const mapEncounter = useCallback((monster: Monster, isGodMode: boolean = false) => {
    if (!character) return;
    
    // 执行战斗
    const { logs: battleLogs, result, finalHp } = executeBattle(character, monster, isGodMode);
    
    // 更新角色状态
    let updatedCharacter = { ...character };
    updatedCharacter.stats.hp = finalHp;
    
    // 处理战斗结果
    if (result === 'win') {
      // 获得经验和金币（地图怪物奖励+20%）
      const bonusExp = Math.floor(monster.exp * 1.2);
      const bonusGold = Math.floor(monster.gold * 1.2);
      
      const expResult = addExperience(updatedCharacter, bonusExp);
      updatedCharacter = expResult.character;
      updatedCharacter.gold += bonusGold;
      
      // 获得掉落物
      const drops = calculateDrops(monster);
      let newInventory = [...inventory];
      drops.forEach(item => {
        newInventory = addToInventory(newInventory, item, 1);
        addLog('item', `获得了${item.name}！`);
      });
      setInventory(newInventory);
      
      addLog('battle', `击败了${monster.name}，获得${bonusExp}经验和${bonusGold}金币（地图奖励+20%）`);
      
      if (expResult.leveledUp) {
        addLog('level_up', `恭喜！升级到了${updatedCharacter.realm}${expResult.newLevel}层！`);
      }
    } else {
      addLog('battle', `被${monster.name}击败了...`);
    }
    
    // 更新血量
    const stats = calculateStatsWithEquipment(updatedCharacter);
    updatedCharacter.stats = { ...updatedCharacter.stats, maxHp: stats.maxHp, maxMp: stats.maxMp };
    
    setCharacter(updatedCharacter);
    setBattle({
      inBattle: false,
      monster,
      playerHp: finalHp,
      monsterHp: 0,
      battleLog: battleLogs,
      isAuto: false,
      result
    });
  }, [character, inventory, addLog]);

  // 从NPC商店购买物品
  const buyNpcItem = useCallback((item: GameItem, price: number) => {
    if (!character || character.gold < price) return;
    
    // 扣除金币
    const updatedCharacter = {
      ...character,
      gold: character.gold - price
    };
    
    // 添加物品到背包
    const newInventory = addToInventory(inventory, item, 1);
    
    setCharacter(updatedCharacter);
    setInventory(newInventory);
    addLog('market', `从NPC商店购买了${item.name}，花费${price}金币`);
  }, [character, inventory, addLog]);

  // 结束战斗
  const endBattle = useCallback(() => {
    setBattle({
      inBattle: false,
      monster: null,
      playerHp: 0,
      monsterHp: 0,
      battleLog: [],
      isAuto: false,
      result: null
    });
  }, []);

  // 使用物品
  const useItem = useCallback((item: GameItem) => {
    if (!character) return;
    
    const { character: updatedCharacter, inventory: updatedInventory, message } = applyItem(character, item, inventory);
    setCharacter(updatedCharacter);
    setInventory(updatedInventory);
    addLog('item', message);
  }, [character, inventory, addLog]);

  // 装备物品
  const equip = useCallback((item: GameItem) => {
    if (!character || item.type !== 'equipment') return;
    
    const equipment = item as any;
    const result = equipItem(character, equipment);
    addLog('item', result.message);
    
    if (!result.success) {
      return;
    }
    
    // 更新角色状态
    setCharacter(result.character);
    
    // 从背包移除
    setInventory(prev => removeFromInventory(prev, item.id, 1));
  }, [character, addLog]);

  // 卸下装备
  const unequip = useCallback((slot: 'weapon' | 'armor' | 'accessory') => {
    if (!character) return;
    
    const equipment = character.equipment[slot];
    if (equipment) {
      setCharacter(prev => {
        if (!prev) return prev;
        const newEquipment = unequipItem(prev, slot);
        const stats = calculateStatsWithEquipment(prev);
        return { ...prev, stats };
      });
      
      // 添加到背包
      setInventory(prev => addToInventory(prev, equipment, 1));
      addLog('item', `卸下了${equipment.name}`);
    }
  }, [character, addLog]);

  // 出售物品到市场
  const sellItem = useCallback((item: GameItem, price: number) => {
    if (!character) return;
    
    // 从背包移除
    setInventory(prev => removeFromInventory(prev, item.id, 1));
    
    // 添加到市场
    const listing: MarketListing = {
      id: generateId(),
      sellerId: playerId,
      sellerName: character.name,
      item,
      price,
      listedAt: Date.now()
    };
    
    setMarket(prev => [...prev, listing]);
    addLog('market', `将${item.name}以${price}金币上架出售`);
  }, [character, playerId, addLog]);

  // 从市场购买
  const buyFromMarket = useCallback((listingId: string) => {
    if (!character) return;
    
    const listing = market.find(l => l.id === listingId);
    if (!listing) return;
    
    if (character.gold < listing.price) {
      addLog('market', '金币不足！');
      return;
    }
    
    // 扣除金币
    setCharacter(prev => {
      if (!prev) return prev;
      return { ...prev, gold: prev.gold - listing.price };
    });
    
    // 添加物品
    setInventory(prev => addToInventory(prev, listing.item, 1));
    
    // 从市场移除
    setMarket(prev => prev.filter(l => l.id !== listingId));
    
    addLog('market', `以${listing.price}金币购买了${listing.item.name}`);
  }, [character, market, addLog]);

  // 修炼
  const doMeditate = useCallback(() => {
    if (!character) return;
    
    const { character: updatedCharacter, message } = meditate(character);
    setCharacter(updatedCharacter);
    addLog('system', message);
  }, [character, addLog]);

  // 渡劫
  const doTribulation = useCallback(() => {
    if (!character) return { success: false, message: '角色不存在' };
    
    const { success, message, character: updatedCharacter } = attemptTribulation(character);
    setCharacter(updatedCharacter);
    addLog('tribulation', message);
    
    if (success) {
      // 更新属性
      const stats = calculateStatsWithEquipment(updatedCharacter);
      setCharacter(prev => prev ? { ...prev, stats } : prev);
    }
    
    return { success, message };
  }, [character, addLog]);

  // 使用回血丹恢复
  const restore = useCallback(() => {
    if (!character) return;
    
    // 找到背包中的回血丹，按效果值排序，选择效果最好的
    const hpPills = inventory
      .filter(i => i.item.type === 'pill' && (i.item as any).effect === 'hp')
      .sort((a, b) => ((b.item as any).value || 0) - ((a.item as any).value || 0));
    
    if (hpPills.length === 0) {
      addLog('item', '没有回血丹了！打怪可获得回血丹');
      return;
    }
    
    const bestPill = hpPills[0];
    const healValue = (bestPill.item as any).value;
    
    // 使用丹药
    const newHp = Math.min(character.stats.maxHp, character.stats.hp + healValue);
    const actualHeal = newHp - character.stats.hp;
    
    setCharacter(prev => prev ? {
      ...prev,
      stats: { ...prev.stats, hp: newHp }
    } : prev);
    
    // 减少丹药数量
    setInventory(prev => removeFromInventory(prev, bestPill.item.id, 1));
    
    addLog('item', `使用${bestPill.item.name}恢复了${actualHeal}点气血`);
  }, [character, inventory, addLog]);

  return {
    character,
    inventory,
    battle,
    logs,
    market,
    currentTab,
    isLoading,
    playerId,
    initGame,
    resetGame,
    setTab,
    addLog,
    setCharacter,
    setInventory,
    startBattle,
    quickBattle,
    mapEncounter,
    endBattle,
    useItem,
    equip,
    unequip,
    sellItem,
    buyFromMarket,
    buyNpcItem,
    doMeditate,
    doTribulation,
    restore
  };
}
