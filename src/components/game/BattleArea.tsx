'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character, Monster, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMonstersByRealm, getRecommendedMonster } from '@/lib/game/gameData';
import { 
  Swords, 
  Skull, 
  Sparkles,
  Zap,
  ChevronRight,
  SwordsIcon,
  Heart,
  Shield,
  Star
} from 'lucide-react';

interface BattleAreaProps {
  character: Character;
  battleLogs: GameLogEntry[];
  onQuickBattle: () => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  isGodMode?: boolean;
}

// 战斗回合数据
interface BattleRound {
  playerDamage: number;
  monsterDamage: number;
  playerHp: number;
  monsterHp: number;
}

export function BattleArea({ character, battleLogs, onQuickBattle, addLog, isGodMode = false }: BattleAreaProps) {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [battleCount, setBattleCount] = useState(0);
  const [isQuickBattle, setIsQuickBattle] = useState(false);
  
  // 战斗动画状态（仅用于挑战战斗）
  const [battlePhase, setBattlePhase] = useState<'idle' | 'player_attack' | 'monster_attack' | 'damage' | 'result'>('idle');
  const [currentRound, setCurrentRound] = useState(0);
  const [playerCurrentHp, setPlayerCurrentHp] = useState(0);
  const [monsterCurrentHp, setMonsterCurrentHp] = useState(0);
  const [showSlashEffect, setShowSlashEffect] = useState(false);
  const [showImpactEffect, setShowImpactEffect] = useState(false);
  const [monsterShake, setMonsterShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [damageText, setDamageText] = useState<{player: number; monster: number}>({player: 0, monster: 0});
  
  const monsters = getMonstersByRealm(character.realm);
  const maxMonsterHp = selectedMonster?.hp || 1;
  
  // 模拟战斗回合
  const simulateBattle = useCallback((monster: Monster) => {
    const rounds: BattleRound[] = [];
    let playerHp = character.stats.hp;
    let monsterHp = monster.hp;
    
    const playerAtk = character.stats.atk;
    const playerDef = character.stats.def;
    
    while (playerHp > 0 && monsterHp > 0) {
      const playerDamage = Math.max(1, Math.floor(playerAtk * (1 - monster.def / (monster.def + 100))));
      monsterHp -= playerDamage;
      
      if (monsterHp <= 0) {
        rounds.push({
          playerDamage,
          monsterDamage: 0,
          playerHp,
          monsterHp: 0
        });
        break;
      }
      
      // 无敌模式下不受伤
      const monsterDamage = isGodMode ? 0 : Math.max(1, Math.floor(monster.atk * (1 - playerDef / (playerDef + 100))));
      playerHp -= monsterDamage;
      
      rounds.push({
        playerDamage,
        monsterDamage,
        playerHp: Math.max(0, playerHp),
        monsterHp: Math.max(0, monsterHp)
      });
    }
    
    return rounds;
  }, [character, isGodMode]);
  
  // 执行战斗动画序列（优化版 - 更快速流畅）
  useEffect(() => {
    if (isQuickBattle || !isBattling || !selectedMonster) return;
    
    const rounds = simulateBattle(selectedMonster);
    setCurrentRound(0);
    setPlayerCurrentHp(character.stats.hp);
    setMonsterCurrentHp(selectedMonster.hp);
    setComboCount(0);
    setDamageText({player: 0, monster: 0});
    
    let roundIndex = 0;
    
    const executeRound = () => {
      if (roundIndex >= rounds.length) {
        const result = rounds[rounds.length - 1]?.playerHp > 0 ? 'win' : 'lose';
        setBattleResult(result);
        setBattlePhase('result');
        setShowResult(true);
        
        setTimeout(() => {
          setIsBattling(false);
          setBattlePhase('idle');
          onQuickBattle();
          setTimeout(() => setShowResult(false), 1000);
        }, 250);
        return;
      }
      
      const round = rounds[roundIndex];
      setCurrentRound(roundIndex + 1);
      setComboCount(roundIndex + 1);
      
      // 玩家攻击
      setBattlePhase('player_attack');
      setShowSlashEffect(true);
      setDamageText(prev => ({...prev, monster: round.playerDamage}));
      
      setTimeout(() => {
        setMonsterCurrentHp(round.monsterHp);
        setMonsterShake(true);
        
        setTimeout(() => {
          setShowSlashEffect(false);
          setMonsterShake(false);
          
          if (round.monsterHp <= 0) {
            roundIndex++;
            executeRound();
            return;
          }
          
          // 怪物攻击
          setBattlePhase('monster_attack');
          setShowImpactEffect(true);
          setDamageText(prev => ({...prev, player: round.monsterDamage}));
          
          setTimeout(() => {
            setPlayerCurrentHp(round.playerHp);
            setPlayerShake(true);
            
            setTimeout(() => {
              setShowImpactEffect(false);
              setPlayerShake(false);
              setBattlePhase('damage');
              
              setTimeout(() => {
                roundIndex++;
                executeRound();
              }, 60);
            }, 60);
          }, 80);
        }, 80);
      }, 100);
    };
    
    const startTimer = setTimeout(executeRound, 150);
    return () => clearTimeout(startTimer);
  }, [isBattling, isQuickBattle, selectedMonster, character, simulateBattle, onQuickBattle]);

  // 快速战斗 - 直接出结果
  const handleQuickBattle = () => {
    if (character.stats.hp <= 0) {
      addLog('battle', '气血不足，请先恢复！');
      return;
    }
    
    const monster = getRecommendedMonster(character.realm, character.level);
    if (monster) {
      setSelectedMonster(monster);
      setIsQuickBattle(true);
      setBattleCount(prev => prev + 1);
      
      // 直接执行战斗并显示结果
      setTimeout(() => {
        onQuickBattle();
        setBattleResult('win');
        setShowResult(true);
        setTimeout(() => {
          setShowResult(false);
          setIsQuickBattle(false);
        }, 600);
      }, 80);
    }
  };

  // 挑战战斗 - 带动画
  const handleBattle = (monster: Monster) => {
    if (character.stats.hp <= 0) {
      addLog('battle', '气血不足，请先恢复！');
      return;
    }
    setSelectedMonster(monster);
    setIsBattling(true);
    setIsQuickBattle(false);
    setBattleResult(null);
    setBattlePhase('idle');
    setBattleCount(prev => prev + 1);
  };

  // 境界难度提示
  const getDifficultyLabel = (monster: Monster) => {
    const levelDiff = monster.level - character.level;
    if (levelDiff <= -2) return { text: '简单', color: 'text-green-500', bg: 'bg-green-100' };
    if (levelDiff <= 1) return { text: '普通', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (levelDiff <= 3) return { text: '困难', color: 'text-orange-500', bg: 'bg-orange-100' };
    return { text: '极难', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const isAnyBattleActive = isBattling || isQuickBattle;
  
  return (
    <div className="space-y-4">
      {/* 战斗结果提示 */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className={`text-4xl font-bold px-10 py-6 rounded-2xl shadow-2xl animate-bounce ${
            battleResult === 'win' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
          }`}>
            {battleResult === 'win' ? (
              <span className="flex items-center gap-3">
                <Star className="w-8 h-8" />
                战斗胜利！
                <Star className="w-8 h-8" />
              </span>
            ) : (
              <span className="flex items-center gap-3">
                💀 战败... 💀
              </span>
            )}
          </div>
        </div>
      )}

      {/* 当前状态概览 */}
      <Card className="bg-gradient-to-b from-indigo-500 to-purple-600 border-indigo-300 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">{character.realm}</div>
                <div className="text-sm text-indigo-100">{character.level}层</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-200" />
                  <span className="text-sm text-white font-medium">{character.stats.hp}/{character.stats.maxHp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <SwordsIcon className="w-4 h-4 text-orange-200" />
                  <span className="text-sm text-white font-medium">{character.stats.atk}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-cyan-200" />
                  <span className="text-sm text-white font-medium">{character.stats.def}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-100">战斗次数</div>
              <div className="text-xl font-bold text-yellow-200">{battleCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 战斗舞台 - 优化动画效果 */}
      {isBattling && !isQuickBattle && selectedMonster && (
        <Card className="bg-gradient-to-b from-slate-800 via-slate-900 to-black border-2 border-red-500/50 text-white shadow-2xl overflow-hidden relative">
          <CardContent className="p-0">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
              {/* 动态背景效果 */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_70%)]" />
              </div>
            </div>
            
            <div className="relative h-56 p-4">
              {/* 回合信息 */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-black/70 px-4 py-1.5 rounded-full border border-yellow-500/50 shadow-lg shadow-yellow-500/20">
                  <span className="text-yellow-300 font-bold">第 {currentRound} 回合</span>
                  {comboCount > 1 && (
                    <span className="ml-2 text-orange-400 font-bold">连击 x{comboCount}</span>
                  )}
                </div>
              </div>
              
              {/* 斩击特效 - 更炫酷 */}
              {showSlashEffect && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="relative">
                    <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-ping rounded-full" />
                    <div className="absolute inset-0 w-40 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
                  </div>
                  {/* 伤害数字 */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                    <span className="text-3xl font-bold text-yellow-300 drop-shadow-lg">-{damageText.monster}</span>
                  </div>
                </div>
              )}
              
              {/* 冲击特效 - 更炫酷 */}
              {showImpactEffect && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-red-500 animate-ping opacity-60" />
                    <div className="absolute inset-0 w-28 h-28 rounded-full bg-red-500/30 animate-pulse" />
                  </div>
                  {/* 伤害数字 */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                    <span className="text-3xl font-bold text-red-400 drop-shadow-lg">-{damageText.player}</span>
                  </div>
                </div>
              )}
              
              {/* 玩家角色 */}
              <div className={`absolute left-6 top-1/2 transform -translate-y-1/2 transition-all duration-100 ${
                playerShake ? 'scale-95' : ''
              }`}>
                <div className={`relative transition-transform duration-100 ${battlePhase === 'player_attack' ? 'translate-x-10' : ''}`}>
                  <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-100 ${playerShake ? 'bg-red-500/40' : 'bg-blue-500/30'}`} />
                  <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-xl transition-all duration-100 ${
                    playerShake 
                      ? 'bg-gradient-to-b from-red-500 to-red-800 border-red-400 shadow-red-500/50' 
                      : 'bg-gradient-to-b from-blue-500 to-blue-800 border-blue-400 shadow-blue-500/50'
                  }`}>
                    <span className="text-3xl">🧑‍🦱</span>
                  </div>
                  {/* 血量条 */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-xs font-bold text-blue-200">{character.name}</div>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden mt-0.5 border border-blue-400/50">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-300 transition-all duration-100 rounded-full"
                          style={{ width: `${(playerCurrentHp / character.stats.maxHp) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-blue-300">{playerCurrentHp}/{character.stats.maxHp}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 怪物 */}
              <div className={`absolute right-6 top-1/2 transform -translate-y-1/2 transition-all duration-100 ${
                monsterShake ? 'scale-95' : ''
              }`}>
                <div className="relative transition-transform duration-100">
                  <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-100 ${monsterShake ? 'bg-yellow-500/40' : 'bg-red-500/30'}`} />
                  <div className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-xl transition-all duration-100 ${
                    monsterShake 
                      ? 'bg-gradient-to-b from-yellow-500 to-yellow-800 border-yellow-400 shadow-yellow-500/50 scale-90' 
                      : 'bg-gradient-to-b from-red-500 to-red-800 border-red-400 shadow-red-500/50'
                  }`}>
                    <span className="text-4xl">{selectedMonster.icon}</span>
                  </div>
                  {/* 血量条 */}
                  <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-xs font-bold text-red-200">{selectedMonster.name}</div>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mt-0.5 border border-red-400/50">
                        <div 
                          className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-100 rounded-full"
                          style={{ width: `${Math.max(0, (monsterCurrentHp / maxMonsterHp) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-red-300">{Math.max(0, monsterCurrentHp)}/{maxMonsterHp}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* VS 标志 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="text-3xl font-black text-white drop-shadow-lg">
                    ⚔️
                  </div>
                  <div className="absolute inset-0 text-3xl font-black text-yellow-500/50 blur-sm">
                    ⚔️
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 怪物选择区 */}
      <Card className="bg-white border-red-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-red-500 flex items-center gap-2">
            <Skull className="w-5 h-5" />
            {character.realm}妖兽
            {isAnyBattleActive && selectedMonster && (
              <Badge className="ml-2 bg-red-500 animate-pulse text-white">
                战斗中...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {monsters.map(monster => {
                const difficulty = getDifficultyLabel(monster);
                return (
                  <div 
                    key={monster.id}
                    className={`
                      p-3 rounded-lg border transition-all cursor-pointer
                      ${selectedMonster?.id === monster.id 
                        ? 'bg-red-50 border-red-400 scale-[1.02] shadow-md' 
                        : 'bg-slate-50 border-slate-200 hover:border-red-300 hover:scale-[1.01]'
                      }
                    `}
                    onClick={() => !isAnyBattleActive && setSelectedMonster(monster)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{monster.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{monster.name}</span>
                          <Badge variant="outline" className={`${difficulty.color} ${difficulty.bg} border-current text-[10px] font-medium`}>
                            {difficulty.text}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-medium">
                          <span className="text-red-500">❤️{monster.hp.toLocaleString()}</span>
                          {' | '}
                          <span className="text-orange-500">⚔️{monster.atk}</span>
                          {' | '}
                          <span className="text-cyan-500">🛡️{monster.def}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          经验: <span className="text-amber-600">{monster.exp.toLocaleString()}</span>
                          {' | '}
                          金币: <span className="text-amber-600">{monster.gold.toLocaleString()}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 战斗按钮区 */}
      <div className="flex gap-3">
        <Button
          onClick={handleQuickBattle}
          disabled={isAnyBattleActive || character.stats.hp <= 0}
          className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg disabled:opacity-50 transition-all active:scale-95"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            快速战斗
          </span>
        </Button>
        
        {selectedMonster && (
          <Button
            onClick={() => handleBattle(selectedMonster)}
            disabled={isAnyBattleActive || character.stats.hp <= 0}
            className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              挑战 {selectedMonster.name}
            </span>
          </Button>
        )}
      </div>

      {/* 战斗提示 */}
      {character.stats.hp <= 0 && (
        <Card className="bg-red-50 border-red-200 text-red-600 animate-pulse shadow-md">
          <CardContent className="p-4 text-center">
            <span className="text-2xl">💀</span>
            <p className="mt-2 font-medium">气血耗尽，无法战斗！</p>
            <p className="text-sm text-red-500 mt-1">请点击「修炼」或使用丹药恢复气血</p>
          </CardContent>
        </Card>
      )}

      {/* 选中怪物信息 */}
      {selectedMonster && !isAnyBattleActive && (
        <Card className="bg-white border-purple-200 text-slate-800 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedMonster.icon}</span>
                <div>
                  <div className="font-bold text-slate-800">{selectedMonster.name}</div>
                  <div className="text-sm text-slate-500">{character.realm} {selectedMonster.level}层怪物</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-amber-600">+{selectedMonster.exp.toLocaleString()} 经验</div>
                <div className="text-sm text-amber-600">+{selectedMonster.gold.toLocaleString()} 金币</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
