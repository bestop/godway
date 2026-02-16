'use client';

import { useState } from 'react';
import { Character, Dungeon, DungeonProgress, Monster, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DUNGEONS, getAvailableDungeons } from '@/lib/game/gameFeatures';
import { MONSTERS } from '@/lib/game/gameData';
import { 
  Castle, 
  Swords, 
  Trophy,
  Clock,
  Skull,
  ChevronRight,
  Star
} from 'lucide-react';

interface DungeonPanelProps {
  character: Character;
  dungeonProgress: DungeonProgress[];
  onUpdateProgress: (progress: DungeonProgress[]) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  onBattle: (monsters: Monster[]) => { won: boolean; exp: number; gold: number };
  onReward: (exp: number, gold: number, items: string[]) => void;
}

export function DungeonPanel({ 
  character, 
  dungeonProgress, 
  onUpdateProgress, 
  addLog, 
  onBattle,
  onReward 
}: DungeonPanelProps) {
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [isChallenging, setIsChallenging] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const availableDungeons = getAvailableDungeons(character.realm);

  const getDungeonProgress = (dungeonId: string): DungeonProgress | undefined => {
    return dungeonProgress.find(p => p.dungeonId === dungeonId);
  };

  const canChallenge = (dungeon: Dungeon): boolean => {
    const progress = getDungeonProgress(dungeon.id);
    if (!progress) return true;
    
    const now = Date.now();
    const elapsed = now - progress.lastAttempt;
    return elapsed >= dungeon.cooldown;
  };

  const getCooldownRemaining = (dungeon: Dungeon): number => {
    const progress = getDungeonProgress(dungeon.id);
    if (!progress) return 0;
    
    const now = Date.now();
    const elapsed = now - progress.lastAttempt;
    const remaining = dungeon.cooldown - elapsed;
    return Math.max(0, remaining);
  };

  const formatCooldown = (ms: number): string => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) return `${hours}小时${minutes}分钟`;
    return `${minutes}分钟`;
  };

  const startDungeon = (dungeon: Dungeon) => {
    if (!canChallenge(dungeon)) return;
    
    setSelectedDungeon(dungeon);
    setCurrentFloor(0);
    setBattleResult(null);
    setIsChallenging(true);
    addLog('battle', `开始挑战副本：${dungeon.name}`);
  };

  const challengeFloor = () => {
    if (!selectedDungeon) return;
    
    const floor = selectedDungeon.floors[currentFloor];
    if (!floor) return;

    const monsters: Monster[] = [];
    floor.monsters.forEach(monsterId => {
      const monster = MONSTERS.find(m => m.id === monsterId);
      if (monster) monsters.push(monster);
    });
    
    if (floor.boss) {
      const boss = MONSTERS.find(m => m.id === floor.boss);
      if (boss) monsters.push(boss);
    }

    const result = onBattle(monsters);
    
    if (result.won) {
      if (currentFloor >= selectedDungeon.floors.length - 1) {
        setBattleResult('win');
        setShowResult(true);
        completeDungeon(selectedDungeon);
      } else {
        setCurrentFloor(prev => prev + 1);
      }
    } else {
      setBattleResult('lose');
      setShowResult(true);
      failDungeon(selectedDungeon);
    }
  };

  const completeDungeon = (dungeon: Dungeon) => {
    const rewards = dungeon.rewards;
    
    const existingProgress = getDungeonProgress(dungeon.id);
    const newProgress: DungeonProgress = {
      dungeonId: dungeon.id,
      currentFloor: dungeon.floors.length,
      completed: true,
      lastAttempt: Date.now()
    };

    const updatedProgress = existingProgress
      ? dungeonProgress.map(p => p.dungeonId === dungeon.id ? newProgress : p)
      : [...dungeonProgress, newProgress];

    onUpdateProgress(updatedProgress);
    onReward(rewards.exp, rewards.gold, rewards.items);
    addLog('battle', `通关副本：${dungeon.name}！获得${rewards.exp}经验，${rewards.gold}金币`);
  };

  const failDungeon = (dungeon: Dungeon) => {
    const existingProgress = getDungeonProgress(dungeon.id);
    const newProgress: DungeonProgress = {
      dungeonId: dungeon.id,
      currentFloor: 0,
      completed: false,
      lastAttempt: Date.now()
    };

    const updatedProgress = existingProgress
      ? dungeonProgress.map(p => p.dungeonId === dungeon.id ? newProgress : p)
      : [...dungeonProgress, newProgress];

    onUpdateProgress(updatedProgress);
    addLog('battle', `副本挑战失败：${dungeon.name}`);
  };

  const closeDungeon = () => {
    setSelectedDungeon(null);
    setIsChallenging(false);
    setShowResult(false);
    setBattleResult(null);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Castle className="w-8 h-8" />
              <div>
                <div className="text-lg font-bold">副本挑战</div>
                <div className="text-sm text-slate-300">
                  可挑战: {availableDungeons.length}个副本
                </div>
              </div>
            </div>
            <Skull className="w-6 h-6 text-red-400" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {availableDungeons.map(dungeon => {
          const progress = getDungeonProgress(dungeon.id);
          const canDo = canChallenge(dungeon);
          const cooldown = getCooldownRemaining(dungeon);
          
          return (
            <Card 
              key={dungeon.id} 
              className={`bg-white border-slate-200 shadow-md transition-all ${
                canDo ? 'hover:border-slate-400 cursor-pointer' : 'opacity-75'
              }`}
              onClick={() => canDo && startDungeon(dungeon)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{dungeon.icon}</div>
                    <div>
                      <div className="font-bold text-slate-800">{dungeon.name}</div>
                      <div className="text-sm text-slate-500">{dungeon.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {dungeon.floors.length}层
                        </Badge>
                        <Badge variant="outline" className="text-xs text-purple-500">
                          {dungeon.requiredRealm}
                        </Badge>
                        {progress?.completed && (
                          <Badge className="bg-green-500 text-white text-xs">
                            已通关
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {canDo ? (
                      <Button className="bg-slate-700 hover:bg-slate-800 text-white">
                        挑战
                      </Button>
                    ) : (
                      <div className="text-sm text-red-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatCooldown(cooldown)}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-2">
                      <Star className="w-3 h-3 inline text-amber-500" /> {dungeon.rewards.exp.toLocaleString()} 经验
                      {' | '}
                      💰 {dungeon.rewards.gold.toLocaleString()} 金币
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isChallenging} onOpenChange={() => !showResult && closeDungeon()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Castle className="w-5 h-5 text-slate-600" />
              {selectedDungeon?.name}
            </DialogTitle>
            <DialogDescription>
              第 {currentFloor + 1} 层 / 共 {selectedDungeon?.floors.length} 层
            </DialogDescription>
          </DialogHeader>

          {!showResult && selectedDungeon && (
            <div className="py-4">
              <div className="mb-4">
                <Progress 
                  value={((currentFloor + 1) / selectedDungeon.floors.length) * 100} 
                  className="h-2"
                />
              </div>

              <div className="bg-slate-100 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">本层敌人</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {selectedDungeon.floors[currentFloor]?.monsters.map((monsterId, i) => {
                      const monster = MONSTERS.find(m => m.id === monsterId);
                      return monster ? (
                        <div key={i} className="text-center">
                          <div className="text-2xl">{monster.icon}</div>
                          <div className="text-xs text-slate-600">{monster.name}</div>
                        </div>
                      ) : null;
                    })}
                    {selectedDungeon.floors[currentFloor]?.boss && (
                      <div className="text-center ml-2">
                        <div className="text-3xl">
                          {MONSTERS.find(m => m.id === selectedDungeon.floors[currentFloor].boss)?.icon}
                        </div>
                        <div className="text-xs text-red-500 font-bold">
                          BOSS: {MONSTERS.find(m => m.id === selectedDungeon.floors[currentFloor].boss)?.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                onClick={challengeFloor}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                <Swords className="w-4 h-4 mr-2" />
                开始战斗
              </Button>
            </div>
          )}

          {showResult && (
            <div className="py-4 text-center">
              {battleResult === 'win' ? (
                <div>
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-xl font-bold text-green-500 mb-2">副本通关！</div>
                  <div className="text-slate-600 mb-4">
                    获得 {selectedDungeon?.rewards.exp.toLocaleString()} 经验
                    <br />
                    获得 {selectedDungeon?.rewards.gold.toLocaleString()} 金币
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">💀</div>
                  <div className="text-xl font-bold text-red-500 mb-2">挑战失败</div>
                  <div className="text-slate-600 mb-4">
                    修为不足，继续努力吧！
                  </div>
                </div>
              )}
              <Button onClick={closeDungeon} className="bg-slate-500 hover:bg-slate-600 text-white">
                返回
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="bg-slate-50 border-slate-200 text-slate-700 shadow-md">
        <CardContent className="p-4">
          <div className="text-sm">
            <div className="font-bold text-slate-800 mb-2">💡 副本说明</div>
            <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
              <li>副本有多层，每层都有强力怪物</li>
              <li>通关副本可获得丰厚奖励</li>
              <li>每个副本有冷却时间，通关后需等待</li>
              <li>失败也会进入冷却，请做好准备</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
