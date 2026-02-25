'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameState, GameTab } from '@/hooks/useGameState';
import { CharacterPanel } from '@/components/game/CharacterPanel';
import { BattleArea } from '@/components/game/BattleArea';
import { Inventory } from '@/components/game/Inventory';
import { Tribulation } from '@/components/game/Tribulation';
import { Market } from '@/components/game/Market';
import { MapArea } from '@/components/game/MapArea';
import { GameLog } from '@/components/game/GameLog';
import { StartScreen } from '@/components/game/StartScreen';
import { QuestPanel } from '@/components/game/QuestPanel';
import { AchievementPanel } from '@/components/game/AchievementPanel';
import { RandomEventModal, EventResultModal } from '@/components/game/RandomEventModal';
import { DailySignInPanel } from '@/components/game/DailySignInPanel';
import { DungeonPanel } from '@/components/game/DungeonPanel';
import { CheatCodeDialog } from '@/components/game/CheatCodeDialog';
import { PetPanel } from '@/components/game/PetPanel';
import { PetShop } from '@/components/game/PetShop';
import { SkillPanel } from '@/components/game/SkillPanel';
import { SamsaraPanel } from '@/components/game/SamsaraPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Swords, 
  Package, 
  Zap, 
  Store,
  RotateCcw,
  Mountain,
  Sparkles,
  Map,
  Scroll,
  Trophy,
  Calendar,
  Castle,
  Terminal,
  PawPrint,
  ShoppingBag,
  Infinity
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  QuestProgress, 
  AchievementProgress, 
  DungeonProgress, 
  IdleReward, 
  DailySignIn, 
  GameLogEntry,
  RandomEvent,
  RandomEventChoice,
  RandomEventOutcome,
  Monster,
  ActiveCheatEffect
} from '@/types/game';
import { 
  saveQuestProgress, 
  loadQuestProgress,
  saveAchievementProgress,
  loadAchievementProgress,
  saveDungeonProgress,
  loadDungeonProgress,
  saveIdleReward,
  loadIdleReward,
  saveDailySignIn,
  loadDailySignIn,
  saveStatistics,
  loadStatistics,
  GameStatistics
} from '@/lib/game/storage';
import { getRandomEvent } from '@/lib/game/gameFeatures';
import { executeBattle, calculateDrops, addExperience, addToInventory, generateId, calculateStatsWithEquipment } from '@/lib/game/gameEngine';
import { getItemById } from '@/lib/game/gameData';
import { isGodModeActive, cleanExpiredEffects } from '@/lib/game/cheatCodes';

export default function Home() {
  const {
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
    quickBattle,
    mapEncounter,
    useItem,
    equip,
    unequip,
    sellItem,
    buyFromMarket,
    buyNpcItem,
    craftItem,
    doMeditate,
    doTribulation,
    restore,
    buyPet,
    activatePet,
    deactivatePet,
    renamePet,
    evolvePet,
    levelUpPet,
    unlockSkill,
    useSkill,
    upgradeSkill,
    doSamsara
  } = useGameState();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [dungeonProgress, setDungeonProgress] = useState<DungeonProgress[]>([]);
  const [idleReward, setIdleReward] = useState<IdleReward>({
    lastClaimTime: Date.now(),
    accumulatedExp: 0,
    accumulatedGold: 0,
    maxAccumulationHours: 12
  });
  const [dailySignIn, setDailySignIn] = useState<DailySignIn>({
    lastSignInDate: '',
    consecutiveDays: 0,
    totalDays: 0,
    rewards: []
  });
  const [statistics, setStatistics] = useState<GameStatistics>({
    totalBattles: 0,
    totalWins: 0,
    totalGoldEarned: 0,
    totalExpEarned: 0,
    monstersKilled: {},
    tribulationSuccesses: 0,
    tribulationAttempts: 0,
    itemsUsed: 0,
    lastPlayTime: Date.now(),
    totalPlayTime: 0
  });
  
  const [randomEvent, setRandomEvent] = useState<RandomEvent | null>(null);
  const [eventOutcome, setEventOutcome] = useState<RandomEventOutcome | null>(null);
  const [activeCheatEffects, setActiveCheatEffects] = useState<ActiveCheatEffect[]>([]);
  const [showCheatDialog, setShowCheatDialog] = useState(false);

  useEffect(() => {
    setQuestProgress(loadQuestProgress());
    setAchievementProgress(loadAchievementProgress());
    setDungeonProgress(loadDungeonProgress());
    setIdleReward(loadIdleReward());
    setDailySignIn(loadDailySignIn());
    setStatistics(loadStatistics());
    
    const savedEffects = localStorage.getItem('xiuxian_cheat_effects');
    if (savedEffects) {
      const effects = JSON.parse(savedEffects);
      setActiveCheatEffects(cleanExpiredEffects(effects));
    }
  }, []);

  useEffect(() => {
    saveQuestProgress(questProgress);
  }, [questProgress]);

  useEffect(() => {
    saveAchievementProgress(achievementProgress);
  }, [achievementProgress]);

  useEffect(() => {
    saveDungeonProgress(dungeonProgress);
  }, [dungeonProgress]);

  useEffect(() => {
    saveIdleReward(idleReward);
  }, [idleReward]);

  useEffect(() => {
    saveDailySignIn(dailySignIn);
  }, [dailySignIn]);

  useEffect(() => {
    saveStatistics(statistics);
  }, [statistics]);

  useEffect(() => {
    localStorage.setItem('xiuxian_cheat_effects', JSON.stringify(activeCheatEffects));
  }, [activeCheatEffects]);

  // 监听气血恢复事件
  useEffect(() => {
    const handleRestoreHp = () => {
      doMeditate();
    };

    window.addEventListener('restoreHp', handleRestoreHp);
    return () => {
      window.removeEventListener('restoreHp', handleRestoreHp);
    };
  }, [doMeditate]);

  const handleReward = useCallback((exp: number, gold: number, items: string[]) => {
    if (!character) return;
    
    let updatedCharacter = { ...character };
    
    // 增加金币
    if (gold > 0) {
      updatedCharacter.gold += gold;
    }
    
    // 增加经验
    if (exp > 0) {
      const expResult = addExperience(updatedCharacter, exp);
      updatedCharacter = expResult.character;
      
      if (expResult.leveledUp) {
        addLog('level_up', `恭喜！升级到了${updatedCharacter.realm}${expResult.newLevel}层！`);
      }
    }
    
    // 处理物品
    if (items.length > 0) {
      let newInventory = [...inventory];
      items.forEach(itemId => {
        const item = getItemById(itemId);
        if (item) {
          newInventory = addToInventory(newInventory, item, 1);
          addLog('item', `获得了${item.name}！`);
        }
      });
      setInventory(newInventory);
    }
    
    // 更新统计信息
    if (exp > 0 || gold > 0 || items.length > 0) {
      setStatistics(prev => ({
        ...prev,
        totalGoldEarned: prev.totalGoldEarned + gold,
        totalExpEarned: prev.totalExpEarned + exp
      }));
    }
    
    // 更新角色状态
    const stats = calculateStatsWithEquipment(updatedCharacter);
    updatedCharacter.stats = { ...updatedCharacter.stats, maxHp: stats.maxHp, maxMp: stats.maxMp };
    setCharacter(updatedCharacter);
  }, [character, inventory, addLog, setCharacter, setInventory]);

  const handleQuestProgressUpdate = useCallback((progress: QuestProgress[]) => {
    setQuestProgress(progress);
  }, []);

  const handleAchievementProgressUpdate = useCallback((progress: AchievementProgress[]) => {
    setAchievementProgress(progress);
  }, []);

  const handleDungeonProgressUpdate = useCallback((progress: DungeonProgress[]) => {
    setDungeonProgress(progress);
  }, []);

  const handleIdleRewardUpdate = useCallback((reward: IdleReward) => {
    setIdleReward(reward);
  }, []);

  const handleSignInUpdate = useCallback((signIn: DailySignIn) => {
    setDailySignIn(signIn);
  }, []);

  const handleAchievementReward = useCallback((exp: number, gold: number, title?: string) => {
    handleReward(exp, gold, []);
    if (title) {
      addLog('achievement', `获得称号：${title}！`);
    }
  }, [handleReward, addLog]);

  const handleRandomEventChoice = useCallback((choice: RandomEventChoice, outcome: RandomEventOutcome) => {
    setRandomEvent(null);
    setEventOutcome(outcome);
    
    const effects = outcome.effects;
    
    if (character) {
      setCharacter(prev => {
        if (!prev) return prev;
        let updated = { ...prev };
        
        if (effects.hp) {
          const newHp = Math.max(1, Math.min(updated.stats.maxHp, updated.stats.hp + effects.hp));
          updated = {
            ...updated,
            stats: { ...updated.stats, hp: newHp }
          };
        }
        if (effects.mp) {
          const newMp = Math.max(0, Math.min(updated.stats.maxMp, updated.stats.mp + effects.mp));
          updated = {
            ...updated,
            stats: { ...updated.stats, mp: newMp }
          };
        }
        if (effects.gold) {
          updated = { ...updated, gold: updated.gold + effects.gold };
        }
        if (effects.exp) {
          const expResult = addExperience(updated, effects.exp);
          updated = expResult.character;
        }
        
        return updated;
      });
      
      if (effects.item) {
        const item = getItemById(effects.item);
        if (item) {
          setInventory(prev => addToInventory(prev, item, 1));
        }
      }
    }
  }, [character, setCharacter, setInventory]);

  const handleDungeonBattle = useCallback((monsters: Monster[]): { won: boolean; exp: number; gold: number } => {
    if (!character) return { won: false, exp: 0, gold: 0 };

    const godMode = isGodModeActive(activeCheatEffects);
    let totalExp = 0;
    let totalGold = 0;
    let playerHp = character.stats.hp;
    let allWon = true;

    for (const monster of monsters) {
      const { result, finalHp } = executeBattle(character, monster, godMode);
      
      if (result === 'win') {
        totalExp += monster.exp;
        totalGold += monster.gold;
        playerHp = finalHp;
      } else {
        allWon = false;
        playerHp = 0;
        break;
      }
    }

    setCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        stats: { ...prev.stats, hp: playerHp }
      };
    });

    setStatistics(prev => ({
      ...prev,
      totalBattles: prev.totalBattles + monsters.length,
      totalWins: allWon ? prev.totalWins + monsters.length : prev.totalWins,
      totalExpEarned: prev.totalExpEarned + totalExp,
      totalGoldEarned: prev.totalGoldEarned + totalGold
    }));

    return { won: allWon, exp: totalExp, gold: totalGold };
  }, [character, activeCheatEffects]);

  const extendedQuickBattle = useCallback((selectedMonster?: Monster) => {
    const godMode = isGodModeActive(activeCheatEffects);
    quickBattle(godMode, selectedMonster);
    
    setStatistics(prev => ({
      ...prev,
      totalBattles: prev.totalBattles + 1,
      totalWins: prev.totalWins + 1
    }));

    if (character && Math.random() < 0.1) {
      const event = getRandomEvent(character.realm);
      if (event) {
        setTimeout(() => setRandomEvent(event), 500);
      }
    }
  }, [quickBattle, character, activeCheatEffects]);

  if (isLoading) {
    return (
      <div className="game-bg flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto animate-pulse text-amber-500 mb-4" />
          <div className="text-xl text-slate-700 font-medium">加载中...</div>
        </div>
      </div>
    );
  }

  if (!character) {
    return <StartScreen onStart={initGame} />;
  }

  return (
    <div className="game-bg text-slate-800">
      <RandomEventModal
        event={randomEvent}
        character={character}
        onClose={() => setRandomEvent(null)}
        onChoose={handleRandomEventChoice}
      />
      
      <EventResultModal
        outcome={eventOutcome}
        onClose={() => setEventOutcome(null)}
      />

      <CheatCodeDialog
        open={showCheatDialog}
        onOpenChange={setShowCheatDialog}
        character={character}
        inventory={inventory}
        activeEffects={activeCheatEffects}
        onUpdateCharacter={setCharacter}
        onUpdateInventory={setInventory}
        onUpdateEffects={setActiveCheatEffects}
        addLog={addLog}
      />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-amber-300/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                修仙之路
              </h1>
              <Badge variant="outline" className="ml-2 text-xs border-amber-300 text-amber-600">
                v2.0
              </Badge>
              {isGodModeActive(activeCheatEffects) && (
                <Badge className="bg-green-500 text-white text-xs animate-pulse">
                  🛡️ 无敌模式
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCheatDialog(true)}
                className="text-slate-500 hover:text-green-500 hover:bg-green-50"
              >
                <Terminal className="w-4 h-4 mr-1" />
                控制台
              </Button>
              <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    重置
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-slate-200 text-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认重置游戏？</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                      这将删除所有游戏数据，包括角色、背包、任务、成就等。此操作不可撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-100 border-slate-200 text-slate-700">取消</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        resetGame();
                        setQuestProgress([]);
                        setAchievementProgress([]);
                        setDungeonProgress([]);
                        setDailySignIn({
                          lastSignInDate: '',
                          consecutiveDays: 0,
                          totalDays: 0,
                          rewards: []
                        });
                        setActiveCheatEffects([]);
                        setShowResetConfirm(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      确认重置
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <CharacterPanel 
              character={character} 
              inventory={inventory}
              onRestore={restore}
              onMeditate={doMeditate}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Tabs value={currentTab} onValueChange={(v) => setTab(v as GameTab)} className="w-full">
              <TabsList className="flex flex-wrap gap-1 bg-white border border-slate-200 shadow-sm h-auto p-1">
                <TabsTrigger value="map" className="text-xs sm:text-sm data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 py-2">
                  <Map className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">地图</span>
                </TabsTrigger>
                <TabsTrigger value="battle" className="text-xs sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 py-2">
                  <Swords className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">战斗</span>
                </TabsTrigger>
                <TabsTrigger value="skill" className="text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 py-2">
                  <Sparkles className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">技能</span>
                </TabsTrigger>
                <TabsTrigger value="samsara" className="text-xs sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 py-2">
                  <Infinity className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">轮回</span>
                </TabsTrigger>
                <TabsTrigger value="dungeon" className="text-xs sm:text-sm data-[state=active]:bg-slate-200 data-[state=active]:text-slate-700 py-2">
                  <Castle className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">副本</span>
                </TabsTrigger>
                <TabsTrigger value="quest" className="text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 py-2">
                  <Scroll className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">任务</span>
                </TabsTrigger>
                <TabsTrigger value="achievement" className="text-xs sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 py-2">
                  <Trophy className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">成就</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 py-2">
                  <Package className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">背包</span>
                </TabsTrigger>
                <TabsTrigger value="market" className="text-xs sm:text-sm data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 py-2">
                  <Store className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">市场</span>
                </TabsTrigger>
                <TabsTrigger value="tribulation" className="text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 py-2">
                  <Zap className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">渡劫</span>
                </TabsTrigger>
                <TabsTrigger value="pet" className="text-xs sm:text-sm data-[state=active]:bg-green-100 data-[state=active]:text-green-700 py-2">
                  <PawPrint className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">宠物</span>
                </TabsTrigger>
                <TabsTrigger value="petshop" className="text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 py-2">
                  <ShoppingBag className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">宠物商店</span>
                </TabsTrigger>
                <TabsTrigger value="daily" className="text-xs sm:text-sm data-[state=active]:bg-green-100 data-[state=active]:text-green-700 py-2">
                  <Calendar className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">签到</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-4">
                <MapArea 
                  character={character}
                  onEncounter={(monster) => mapEncounter(monster, isGodModeActive(activeCheatEffects))}
                  addLog={addLog}
                />
              </TabsContent>

              <TabsContent value="battle" className="mt-4">
                <BattleArea 
                  character={character}
                  battle={battle}
                  onQuickBattle={extendedQuickBattle}
                  addLog={addLog}
                  isGodMode={isGodModeActive(activeCheatEffects)}
                  setCharacter={setCharacter}
                  setInventory={setInventory}
                  inventory={inventory}
                />
              </TabsContent>

              <TabsContent value="skill" className="mt-4">
                <SkillPanel 
                  character={character}
                  inventory={inventory}
                  onUnlockSkill={unlockSkill}
                  onUseSkill={useSkill}
                  onUpgradeSkill={upgradeSkill}
                  onUseItem={useItem}
                />
              </TabsContent>

              <TabsContent value="samsara" className="mt-4">
                <SamsaraPanel 
                  character={character}
                  onSamsara={doSamsara}
                />
              </TabsContent>

              <TabsContent value="dungeon" className="mt-4">
                <DungeonPanel
                  character={character}
                  dungeonProgress={dungeonProgress}
                  onUpdateProgress={handleDungeonProgressUpdate}
                  addLog={addLog}
                  onBattle={handleDungeonBattle}
                  onReward={handleReward}
                />
              </TabsContent>

              <TabsContent value="quest" className="mt-4">
                <QuestPanel
                  character={character}
                  questProgress={questProgress}
                  onUpdateProgress={handleQuestProgressUpdate}
                  addLog={addLog}
                  onReward={handleReward}
                />
              </TabsContent>

              <TabsContent value="achievement" className="mt-4">
                <AchievementPanel
                  character={character}
                  achievementProgress={achievementProgress}
                  statistics={{
                    totalWins: statistics.totalWins,
                    totalGoldEarned: statistics.totalGoldEarned,
                    tribulationSuccesses: statistics.tribulationSuccesses
                  }}
                  onUpdateProgress={handleAchievementProgressUpdate}
                  addLog={addLog}
                  onReward={handleAchievementReward}
                />
              </TabsContent>

              <TabsContent value="inventory" className="mt-4">
                <Inventory 
                  character={character}
                  inventory={inventory}
                  onUseItem={useItem}
                  onEquip={equip}
                  onUnequip={unequip}
                  onSellItem={sellItem}
                  onCraftItem={craftItem}
                />
              </TabsContent>

              <TabsContent value="market" className="mt-4">
                <Market 
                  character={character}
                  market={market}
                  playerId={playerId}
                  onBuy={buyFromMarket}
                  onBuyNpcItem={buyNpcItem}
                />
              </TabsContent>

              <TabsContent value="tribulation" className="mt-4">
                <Tribulation 
                  character={character}
                  onTribulation={() => {
                    const result = doTribulation();
                    if (result.success) {
                      setStatistics(prev => ({
                        ...prev,
                        tribulationSuccesses: prev.tribulationSuccesses + 1
                      }));
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="pet" className="mt-4">
                <PetPanel
                  character={character}
                  onActivatePet={activatePet}
                  onDeactivatePet={deactivatePet}
                  onRenamePet={renamePet}
                  onEvolvePet={evolvePet}
                  onLevelUpPet={levelUpPet}
                  addLog={addLog}
                />
              </TabsContent>

              <TabsContent value="petshop" className="mt-4">
                <PetShop
                  character={character}
                  onBuyPet={buyPet}
                  addLog={addLog}
                />
              </TabsContent>

              <TabsContent value="daily" className="mt-4">
                <DailySignInPanel
                  character={character}
                  dailySignIn={dailySignIn}
                  idleReward={idleReward}
                  onUpdateSignIn={handleSignInUpdate}
                  onUpdateIdleReward={handleIdleRewardUpdate}
                  addLog={addLog}
                  onReward={handleReward}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <GameLog logs={logs} />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-200 bg-white/50">
        <p>修仙之路 v2.0 — 新增任务、成就、副本、签到等系统</p>
      </footer>
    </div>
  );
}
