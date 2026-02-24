'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character, Monster, GameLogEntry, Skill, SKILLS } from '@/types/game';
import { calculateSkillEffect } from '@/lib/game/gameEngine';
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
  Flame,
  Shield,
  Star
} from 'lucide-react';

interface BattleAreaProps {
  character: Character;
  battle: {
    inBattle: boolean;
    monster: Monster | null;
    playerHp: number;
    monsterHp: number;
    battleLog: string[];
    isAuto: boolean;
    result: 'win' | 'lose' | null;
  };
  onQuickBattle: () => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  isGodMode?: boolean;
  setCharacter?: (character: Character) => void;
}

type SkillAnimationType = 'fire' | 'heal' | 'powerup' | 'lightning' | 'shield' | 'ultimate' | null;

export function BattleArea({ character, battle, onQuickBattle, addLog, isGodMode = false, setCharacter }: BattleAreaProps) {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [isQuickBattle, setIsQuickBattle] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [battleCount, setBattleCount] = useState(0);
  
  // 战斗动画状态（仅用于挑战战斗）
  const [battlePhase, setBattlePhase] = useState<'idle' | 'start' | 'player_turn' | 'player_attack' | 'monster_attack' | 'skill' | 'damage' | 'result'>('idle');
  const [playerCurrentHp, setPlayerCurrentHp] = useState(0);
  const [playerCurrentMp, setPlayerCurrentMp] = useState(0);
  const [monsterCurrentHp, setMonsterCurrentHp] = useState(0);
  const [showSlashEffect, setShowSlashEffect] = useState(false);
  const [showImpactEffect, setShowImpactEffect] = useState(false);
  const [monsterShake, setMonsterShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [damageText, setDamageText] = useState<{player: number; monster: number}>({player: 0, monster: 0});
  const [petAttackEffect, setPetAttackEffect] = useState(false);
  const [petDamageText, setPetDamageText] = useState(0);
  const [isCriticalHit, setIsCriticalHit] = useState(false);
  const [showStartAnimation, setShowStartAnimation] = useState(false);
  const [hasAttackedThisRound, setHasAttackedThisRound] = useState(false);
  const [skillAnimation, setSkillAnimation] = useState<SkillAnimationType>(null);
  const [showSkillEffect, setShowSkillEffect] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [skillDamageText, setSkillDamageText] = useState(0);
  const [isWaitingForSkill, setIsWaitingForSkill] = useState(false);
  
  const getAvailableSkills = useCallback(() => {
    return SKILLS.filter(skill => {
      const charSkill = character.skills?.find(s => s.skillId === skill.id);
      return charSkill?.unlocked === true;
    });
  }, [character.skills]);
  
  const monsters = getMonstersByRealm(character.realm);
  const maxMonsterHp = selectedMonster?.hp || 1;
  const availableSkills = getAvailableSkills();
  
  // 计算血量百分比
  const monsterHpPercent = maxMonsterHp > 0 ? Math.max(0, (monsterCurrentHp / maxMonsterHp) * 100) : 0;
  
  // 监控怪物血量变化
  useEffect(() => {
    if (isBattling && selectedMonster) {
      console.log('[Battle] 怪物血量更新:', monsterCurrentHp, '/', maxMonsterHp, '百分比:', monsterHpPercent + '%');
    }
  }, [monsterCurrentHp, maxMonsterHp, monsterHpPercent, isBattling, selectedMonster]);
   
  // 怪物攻击
  const monsterAttack = useCallback(() => {
    if (!selectedMonster) return;
    
    setBattlePhase('monster_attack');
    const monsterDamage = isGodMode ? 0 : Math.max(1, Math.floor(selectedMonster.atk * (1 - character.stats.def / (character.stats.def + 100))));
    
    setShowImpactEffect(true);
    setDamageText(prev => ({...prev, player: monsterDamage}));
    
    setTimeout(() => {
      setPlayerCurrentHp(prev => {
        const newHp = Math.max(0, prev - monsterDamage);
        if (newHp <= 0) {
          // 战败时更新 character 的气血
          if (setCharacter) {
            setCharacter({
              ...character,
              stats: {
                ...character.stats,
                hp: 0
              }
            });
          }
          setTimeout(() => {
            setBattleResult('lose');
            setBattlePhase('result');
            setShowResult(true);
            setTimeout(() => {
              setIsBattling(false);
              setBattlePhase('idle');
              setTimeout(() => setShowResult(false), 150);
            }, 500);
          }, 200);
        }
        return newHp;
      });
      setPlayerShake(true);
      
      setTimeout(() => {
        setShowImpactEffect(false);
        setPlayerShake(false);
        
        // 进入下一回合
        setTimeout(() => {
          if (playerCurrentHp - monsterDamage > 0) {
            setCurrentRound(prev => prev + 1);
            setHasAttackedThisRound(false);
            setBattlePhase('player_turn');
          }
        }, 100);
      }, 150);
    }, 200);
  }, [selectedMonster, character, isGodMode, playerCurrentHp, setCharacter]);
  
  // 普通攻击
  const handleNormalAttack = useCallback(() => {
    if (!isBattling || hasAttackedThisRound || battlePhase !== 'player_turn') return;
    
    setHasAttackedThisRound(true);
    setBattlePhase('player_attack');
    
    // 伤害倍数
    const damageMultiplier = 10;
    
    // 计算伤害
    const playerAtk = character.stats.atk;
    const playerDef = character.stats.def;
    const monsterDef = selectedMonster?.def || 0;
    
    // 获取激活的宠物
    const activePets = (character.pets || []).filter(pet => pet.isActive);
    
    // 随机暴击判定（15%概率暴击，双倍伤害）
    const isCritical = Math.random() < 0.15;
    const criticalMultiplier = isCritical ? 2 : 1;
    
    // 玩家攻击
    const playerDamage = Math.max(1, Math.floor(playerAtk * (1 - monsterDef / (monsterDef + 100)) * damageMultiplier * criticalMultiplier));
    let totalPlayerDamage = playerDamage;
    
    // 宠物攻击
    activePets.forEach(pet => {
      const petAtk = pet.pet.stats.atk || 0;
      const petDamage = Math.max(1, Math.floor(petAtk * 0.8 * (1 - monsterDef / (monsterDef + 150)) * damageMultiplier));
      totalPlayerDamage += petDamage;
      setPetDamageText(petDamage);
    });
    
    if (isCritical) {
      setIsCriticalHit(true);
      setTimeout(() => setIsCriticalHit(false), 500);
    }
    
    setShowSlashEffect(true);
    setDamageText(prev => ({...prev, monster: totalPlayerDamage}));
    
    console.log('[Battle] 普通攻击前怪物血量:', monsterCurrentHp, '总伤害:', totalPlayerDamage);
    
    // 使用函数式更新获取最新的怪物血量
    setMonsterCurrentHp(prevHp => {
      const newHp = Math.max(0, prevHp - totalPlayerDamage);
      console.log('[Battle] 普通攻击后怪物血量:', newHp);
      
      setMonsterShake(true);
      
      // 宠物攻击动画
      if (activePets.length > 0) {
        setPetAttackEffect(true);
        setTimeout(() => setPetAttackEffect(false), 30);
      }
      
      setTimeout(() => {
        setShowSlashEffect(false);
        setMonsterShake(false);
        
        // 检查怪物是否死亡
        if (newHp <= 0) {
          setBattleResult('win');
          setBattlePhase('result');
          setShowResult(true);
          
          setTimeout(() => {
            setIsBattling(false);
            setBattlePhase('idle');
            setTimeout(() => setShowResult(false), 150);
            // 注意：不要调用 onQuickBattle()，因为这是挑战战斗，不是快速战斗
          }, 800);
          return newHp;
        }
        
        // 怪物攻击
        setTimeout(() => {
          monsterAttack();
        }, 200);
      }, 200);
      
      return newHp;
    });
  }, [isBattling, hasAttackedThisRound, battlePhase, character, selectedMonster, onQuickBattle, addLog, monsterAttack, monsterCurrentHp]);
  
  // 使用技能
  const handleUseSkill = useCallback((skill: Skill) => {
    if (!isBattling || hasAttackedThisRound || battlePhase !== 'player_turn') return;
    if (playerCurrentMp < skill.mpCost) {
      addLog('battle', '灵力不足，无法使用技能！');
      return;
    }
    
    setHasAttackedThisRound(true);
    
    // 获取技能等级
    const charSkill = character.skills?.find(s => s.skillId === skill.id);
    const skillLevel = charSkill?.level || 1;
    const levelBonus = (skillLevel - 1) * 10; // 计算等级加成百分比
    
    setIsWaitingForSkill(true);
    setCurrentSkill(skill);
    
    // 确定技能动画类型
    let animType: SkillAnimationType = 'fire';
    switch (skill.id) {
      case 'skill_fireball':
        animType = 'fire';
        break;
      case 'skill_heal':
        animType = 'heal';
        break;
      case 'skill_powerup':
        animType = 'powerup';
        break;
      case 'skill_lightning':
        animType = 'lightning';
        break;
      case 'skill_shield':
        animType = 'shield';
        break;
      case 'skill_ultimate':
        animType = 'ultimate';
        break;
    }
    
    setSkillAnimation(animType);
    setShowSkillEffect(true);
    setBattlePhase('skill');
    
    // 消耗灵力
    setPlayerCurrentMp(prev => Math.max(0, prev - skill.mpCost));
    
    // 计算技能效果（包含等级加成）
    const skillEffect = calculateSkillEffect(skill, skillLevel);
    const skillDamage = skillEffect.damageMultiplier 
      ? Math.floor(character.stats.atk * skillEffect.damageMultiplier)
      : skillEffect.damage || 0;
      
    setSkillDamageText(skillDamage);
    
    // 添加战斗日志 - 显示技能等级和加成
    if (skillLevel > 1) {
      addLog('battle', `使用${skill.name}（Lv.${skillLevel}，效果+${levelBonus}%）！`);
    } else {
      addLog('battle', `使用${skill.name}！`);
    }
    
    // 播放技能动画
    setTimeout(() => {
      if (skill.type === 'attack' || skill.type === 'special') {
        console.log('[Battle] 技能攻击前怪物血量:', monsterCurrentHp, '技能伤害:', skillDamage);
        
        // 使用函数式更新获取最新的怪物血量
        setMonsterCurrentHp(prevHp => {
          const newHp = Math.max(0, prevHp - skillDamage);
          console.log('[Battle] 技能攻击后怪物血量:', newHp);
          
          setMonsterShake(true);
          addLog('battle', `${skill.name}对${selectedMonster?.name}造成了${skillDamage}点伤害！`);
          
          setTimeout(() => {
            setShowSkillEffect(false);
            setMonsterShake(false);
            setSkillAnimation(null);
            setCurrentSkill(null);
            setIsWaitingForSkill(false);
            
            // 检查怪物是否死亡
            if (newHp <= 0) {
              setBattleResult('win');
              setBattlePhase('result');
              setShowResult(true);
              
              setTimeout(() => {
                setIsBattling(false);
                setBattlePhase('idle');
                setTimeout(() => setShowResult(false), 150);
                // 注意：不要调用 onQuickBattle()，因为这是挑战战斗，不是快速战斗
              }, 800);
              return newHp;
            }
            
            // 怪物攻击
            setTimeout(() => {
              monsterAttack();
            }, 200);
          }, 300);
          
          return newHp;
        });
      } else if (skill.type === 'heal') {
        const healAmount = skillEffect.healMultiplier 
          ? Math.floor(character.stats.maxHp * skillEffect.healMultiplier)
          : skillEffect.heal || 0;
        setPlayerCurrentHp(prev => {
          const newHp = Math.min(character.stats.maxHp, prev + healAmount);
          // 治疗时同步更新 character 的气血
          if (setCharacter) {
            setCharacter({
              ...character,
              stats: {
                ...character.stats,
                hp: newHp
              }
            });
          }
          return newHp;
        });
        addLog('battle', `${skill.name}恢复了${healAmount}点气血！`);
        
        setTimeout(() => {
          setShowSkillEffect(false);
          setMonsterShake(false);
          setSkillAnimation(null);
          setCurrentSkill(null);
          setIsWaitingForSkill(false);
          
          // 怪物攻击
          setTimeout(() => {
            monsterAttack();
          }, 200);
        }, 300);
      } else if (skill.type === 'buff' || skill.type === 'debuff') {
        // 处理buff/debuff类型技能
        let message = '';
        if (skill.effect.buffAtk) {
          message = `${skill.name}提升了攻击力${skill.effect.buffAtk * 100}%！`;
        } else if (skill.effect.buffDef) {
          message = `${skill.name}提升了防御力${skill.effect.buffDef * 100}%！`;
        } else if (skill.effect.debuffAtk) {
          message = `${skill.name}降低了敌人攻击力${skill.effect.debuffAtk * 100}%！`;
        } else if (skill.effect.debuffDef) {
          message = `${skill.name}降低了敌人防御力${skill.effect.debuffDef * 100}%！`;
        } else {
          message = `使用了${skill.name}！`;
        }
        
        addLog('battle', message);
        
        setTimeout(() => {
          setShowSkillEffect(false);
          setMonsterShake(false);
          setSkillAnimation(null);
          setCurrentSkill(null);
          setIsWaitingForSkill(false);
          
          // 怪物攻击
          setTimeout(() => {
            monsterAttack();
          }, 200);
        }, 300);
      }
    }, 500);
  }, [isBattling, hasAttackedThisRound, battlePhase, playerCurrentMp, character, selectedMonster, onQuickBattle, addLog, setCharacter, monsterAttack, monsterCurrentHp]);
  
  // 模拟战斗回合 - 超快速版，增加伤害倍数
  const simulateBattle = useCallback((monster: Monster) => {
    const rounds: BattleRound[] = [];
    let playerHp = character.stats.hp;
    let monsterHp = monster.hp;
    
    const playerAtk = character.stats.atk;
    const playerDef = character.stats.def;
    
    // 获取激活的宠物
    const activePets = (character.pets || []).filter(pet => pet.isActive);
    
    // 伤害倍数 - 大幅加快战斗速度
    const damageMultiplier = 10;
    
    // 限制最大回合数，确保15秒内结束
    const maxRounds = 50;
    let roundCount = 0;
    
    while (playerHp > 0 && monsterHp > 0 && roundCount < maxRounds) {
      roundCount++;
      let totalPlayerDamage = 0;
      
      // 玩家攻击 - 增加伤害倍数
      const playerDamage = Math.max(1, Math.floor(playerAtk * (1 - monster.def / (monster.def + 100)) * damageMultiplier));
      totalPlayerDamage += playerDamage;
      
      // 宠物攻击 - 增加伤害倍数
      activePets.forEach(pet => {
        const petAtk = pet.pet.stats.atk || 0;
        const petDamage = Math.max(1, Math.floor(petAtk * 0.8 * (1 - monster.def / (monster.def + 150)) * damageMultiplier));
        totalPlayerDamage += petDamage;
        setPetDamageText(petDamage);
      });
      
      monsterHp -= totalPlayerDamage;
      
      if (monsterHp <= 0) {
        rounds.push({
          playerDamage: totalPlayerDamage,
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
        playerDamage: totalPlayerDamage,
        monsterDamage,
        playerHp: Math.max(0, playerHp),
        monsterHp: Math.max(0, monsterHp)
      });
    }
    
    // 如果达到最大回合数，直接判胜
    if (roundCount >= maxRounds && monsterHp > 0) {
      rounds.push({
        playerDamage: monsterHp,
        monsterDamage: 0,
        playerHp,
        monsterHp: 0
      });
    }
    
    return rounds;
  }, [character, isGodMode]);
  
  // 只在快速战斗时自动执行
  useEffect(() => {
    if (!isQuickBattle || !isBattling || !selectedMonster) return;
    
    const rounds = simulateBattle(selectedMonster);
    setCurrentRound(0);
    setPlayerCurrentHp(character.stats.hp);
    setPlayerCurrentMp(character.stats.mp);
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
          setTimeout(() => setShowResult(false), 150);
        }, 500);
        return;
      }
      
      const round = rounds[roundIndex];
      setCurrentRound(roundIndex + 1);
      setComboCount(roundIndex + 1);
      
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
              
              const activePets = (character.pets || []).filter(pet => pet.isActive);
              if (activePets.length > 0) {
                setPetAttackEffect(true);
                setTimeout(() => {
                  setPetAttackEffect(false);
                }, 30);
              }
              
              setTimeout(() => {
                roundIndex++;
                executeRound();
              }, 5);
            }, 10);
          }, 10);
        }, 15);
      }, 15);
    };
    
    const startTimer = setTimeout(executeRound, 0);
    return () => clearTimeout(startTimer);
  }, [isBattling, isQuickBattle, selectedMonster, character, simulateBattle, onQuickBattle]);

  // 快速战斗 - 直接调用父组件的快速战斗方法
  const handleQuickBattle = () => {
    if (character.stats.hp <= 0) {
      addLog('battle', '气血不足，请先恢复！');
      return;
    }
    
    setBattleCount(prev => prev + 1);
    onQuickBattle();
  };
  
  // 确保快速战斗后可以选择怪物 - 添加一个重置按钮或逻辑
  useEffect(() => {
    if (!isBattling && !isQuickBattle) {
      // 战斗结束后可以选择新的怪物
    }
  }, [isBattling, isQuickBattle]);

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
    setBattlePhase('start');
    setShowStartAnimation(true);
    setCurrentRound(1);
    setPlayerCurrentHp(character.stats.hp);
    setPlayerCurrentMp(character.stats.mp);
    setMonsterCurrentHp(monster.hp);
    setHasAttackedThisRound(false);
    setComboCount(0);
    setBattleCount(prev => prev + 1);
    
    setTimeout(() => {
      setShowStartAnimation(false);
      setBattlePhase('player_turn');
    }, 1500);
  };

  // 境界难度提示
  const getDifficultyLabel = (monster: Monster) => {
    const levelDiff = monster.level - character.level;
    if (levelDiff <= -2) return { text: '简单', color: 'text-green-500', bg: 'bg-green-100' };
    if (levelDiff <= 1) return { text: '普通', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (levelDiff <= 3) return { text: '困难', color: 'text-orange-500', bg: 'bg-orange-100' };
    return { text: '极难', color: 'text-red-500', bg: 'bg-red-100' };
  };

  // 只有真正的挑战战斗才算激活状态，快速战斗不算
  const isAnyBattleActive = isBattling;
  
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
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Skull className="w-8 h-8" />
                战斗失败
              </span>
            )}
          </div>
        </div>
      )}

      {/* 快速战斗 */}
      <Card className="bg-white border-green-200 text-slate-800 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-slate-600 mb-1">快速战斗</div>
              <div className="text-lg font-bold text-green-600 flex items-center gap-2">
                <SwordsIcon className="w-5 h-5" />
                推荐目标: {getRecommendedMonster(character.realm, character.level)?.name || '无'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                战斗次数: {battleCount}
              </div>
            </div>
            <Button 
              onClick={handleQuickBattle}
              disabled={isAnyBattleActive || character.stats.hp <= 0}
              className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg disabled:opacity-50 transition-all active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                快速战斗
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 战斗舞台 - 优化动画效果 */}
      {isBattling && !isQuickBattle && selectedMonster && (
        <Card className="bg-gradient-to-b from-slate-800 via-slate-900 to-black border-2 border-red-500/50 text-white shadow-2xl overflow-hidden relative">
          <CardContent className="p-0">
            {/* 动态背景 - 粒子效果 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400/50 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>
            
            {/* 战斗开始动画 */}
            {showStartAnimation && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70">
                <div className="text-center animate-startBattle">
                  <div className="text-6xl mb-4">⚔️</div>
                  <div className="text-4xl font-black text-yellow-400 drop-shadow-lg">
                    战斗开始！
                  </div>
                </div>
              </div>
            )}
            
            {/* 暴击特效 */}
            {isCriticalHit && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-screenShake">
                <div className="text-center">
                  <div className="absolute inset-0 bg-yellow-500/30 animate-criticalFlash" />
                  <div className="text-6xl font-black text-yellow-400 drop-shadow-2xl relative z-10">
                    暴击！
                  </div>
                </div>
              </div>
            )}

            {/* 战斗区域 */}
            <div className="relative h-72 flex items-center justify-between px-12 py-4">
              {/* 玩家角色和宠物容器 */}
              <div className="relative">
                {/* 激活的宠物 */}
                {character.pets && character.pets.length > 0 && (
                  (() => {
                    const activePet = character.pets.find(p => p.isActive);
                    if (activePet) {
                      return (
                        <div className={`absolute -left-16 -top-4 transition-all duration-300 ${petAttackEffect ? 'scale-125' : ''}`}>
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-purple-500 to-purple-800 border-2 border-purple-300 flex items-center justify-center shadow-lg">
                              <span className="text-3xl">{activePet.pet.icon}</span>
                            </div>
                            {petAttackEffect && (
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded">
                                +{petDamageText}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()
                )}
                
                {/* 玩家角色 */}
                <div className={`relative transition-all duration-100 ${playerShake ? 'scale-95' : ''}`}>
                  <div className={`relative transition-transform duration-200 ${battlePhase === 'player_attack' ? 'translate-x-16 scale-110 rotate-12' : ''} ${battlePhase === 'player_turn' ? 'animate-pulse' : ''}`}>
                    <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-300 ${
                      playerShake ? 'bg-red-500/40' : 
                      battlePhase === 'player_attack' ? 'bg-yellow-500/50' :
                      'bg-blue-500/30'
                    }`} />
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-xl transition-all duration-300 ${
                      playerShake 
                        ? 'bg-gradient-to-b from-red-500 to-red-800 border-red-400 shadow-red-500/50 scale-90' 
                        : battlePhase === 'player_attack'
                        ? 'bg-gradient-to-b from-yellow-500 to-yellow-800 border-yellow-400 shadow-yellow-500/50'
                        : 'bg-gradient-to-b from-blue-500 to-blue-800 border-blue-400 shadow-blue-500/50'
                    }`}>
                      <span className="text-4xl">{character.avatar || '🧑'}</span>
                    </div>
                  </div>
                  
                  {/* 玩家血量条 */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-xs font-bold text-blue-200">{character.name}</div>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mt-0.5 border border-blue-400/50">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 rounded-full"
                          style={{ width: `${Math.max(0, (playerCurrentHp / character.stats.maxHp) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-blue-300">{Math.max(0, playerCurrentHp)}/{character.stats.maxHp}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 怪物 */}
              <div className={`relative transition-all duration-100 ${
                monsterShake ? 'scale-95' : ''
              }`}>
                <div className={`relative transition-transform duration-200 ${battlePhase === 'monster_attack' ? '-translate-x-16 scale-110' : ''} ${battlePhase === 'monster_attack' ? 'animate-bounce' : ''}`}>
                  <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-300 ${
                    monsterShake ? 'bg-yellow-500/40' : 
                    battlePhase === 'monster_attack' ? 'bg-orange-500/50' :
                    'bg-red-500/30'
                  }`} />
                  <div className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-xl transition-all duration-300 ${
                    monsterShake 
                      ? 'bg-gradient-to-b from-yellow-500 to-yellow-800 border-yellow-400 shadow-yellow-500/50 scale-90' 
                      : battlePhase === 'monster_attack'
                      ? 'bg-gradient-to-b from-orange-500 to-red-700 border-orange-400 shadow-orange-500/50'
                      : 'bg-gradient-to-b from-red-500 to-red-800 border-red-400 shadow-red-500/50'
                  }`}>
                    <span className={`text-4xl transition-transform duration-100 ${battlePhase === 'monster_attack' ? '-rotate-12' : ''}`}>{selectedMonster.icon}</span>
                  </div>
                  {/* 血量条 */}
                  <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-xs font-bold text-red-200">{selectedMonster.name}</div>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mt-0.5 border border-red-400/50">
                        <div 
                          className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-300 rounded-full"
                          style={{ width: `${monsterHpPercent}%` }}
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
              
              {/* 宠物攻击动画 */}
              {petAttackEffect && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-4 border-purple-300 animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">⚡</span>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                        +{petDamageText}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 斩击特效 */}
              {showSlashEffect && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="relative">
                    <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-slash shadow-lg shadow-yellow-400/50" />
                    <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-slash-delay-1 absolute top-0" />
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-slash-delay-2 absolute top-0" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className={`font-black text-3xl ${isCriticalHit ? 'text-yellow-400 text-5xl' : 'text-white'} drop-shadow-lg animate-damageNumber`}>
                        {isCriticalHit ? '暴击！' : ''} -{damageText.monster}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 冲击特效 */}
              {showImpactEffect && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-yellow-400 rounded-full animate-impact" />
                    <div className="w-32 h-32 border-2 border-red-400 rounded-full animate-impact-delay absolute top-0" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="font-black text-3xl text-red-400 drop-shadow-lg animate-damageNumber">
                        -{damageText.player}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 技能特效 */}
              {showSkillEffect && skillAnimation && (
                <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
                  <div className="relative">
                    {/* 火焰技能 */}
                    {skillAnimation === 'fire' && (
                      <>
                        <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-ping border-4 border-orange-300" />
                        <div className="w-40 h-40 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full animate-ping border-4 border-red-300 opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl animate-bounce">🔥</span>
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/80 text-white font-bold text-2xl px-4 py-2 rounded-lg border-2 border-orange-400">
                            {currentSkill?.name} -{skillDamageText}
                          </div>
                        </div>
                        {/* 火焰粒子 */}
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-4 h-4 bg-orange-400 rounded-full animate-fireParticle"
                            style={{
                              left: '50%',
                              top: '50%',
                              animationDelay: `${i * 0.1}s`,
                              transform: `rotate(${i * 45}deg) translateY(-40px)`
                            }}
                          />
                        ))}
                      </>
                    )}
                    
                    {/* 治疗技能 */}
                    {skillAnimation === 'heal' && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl animate-bounce">💚</span>
                        </div>
                        {/* 治疗粒子 */}
                        {[...Array(12)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-3 h-3 bg-green-400 rounded-full animate-healParticle"
                            style={{
                              left: '50%',
                              top: '50%',
                              animationDelay: `${i * 0.1}s`,
                              transform: `rotate(${i * 30}deg) translateY(-50px)`
                            }}
                          />
                        ))}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/80 text-green-400 font-bold text-2xl px-4 py-2 rounded-lg border-2 border-green-400">
                            {currentSkill?.name}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* 增益技能 */}
                    {skillAnimation === 'powerup' && (
                      <>
                        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping border-4 border-yellow-300" />
                        <div className="w-28 h-28 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-ping-delay-1 border-4 border-orange-300" />
                        <div className="w-36 h-36 bg-gradient-to-r from-red-400 to-purple-500 rounded-full animate-ping-delay-2 border-4 border-red-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl animate-bounce">💪</span>
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/80 text-yellow-400 font-bold text-2xl px-4 py-2 rounded-lg border-2 border-yellow-400">
                            {currentSkill?.name}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* 雷电技能 */}
                    {skillAnimation === 'lightning' && (
                      <>
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-ping border-4 border-blue-300" />
                        <div className="w-40 h-40 bg-gradient-to-r from-purple-400 to-yellow-500 rounded-full animate-ping-delay-1 border-4 border-purple-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl animate-pulse">⚡</span>
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/80 text-blue-400 font-bold text-2xl px-4 py-2 rounded-lg border-2 border-blue-400">
                            {currentSkill?.name} -{skillDamageText}
                          </div>
                        </div>
                        {/* 闪电射线 */}
                        {[...Array(6)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-1 h-20 bg-yellow-400 animate-lightningRay"
                            style={{
                              left: '50%',
                              top: '50%',
                              animationDelay: `${i * 0.1}s`,
                              transform: `rotate(${i * 60}deg)`
                            }}
                          />
                        ))}
                      </>
                    )}
                    
                    {/* 护盾技能 */}
                    {skillAnimation === 'shield' && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full border-4 border-cyan-400 animate-pulse" />
                          <div className="absolute w-24 h-24 rounded-full border-4 border-cyan-300 animate-pulse-delay" />
                          <span className="text-5xl animate-bounce">🛡️</span>
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/80 text-cyan-400 font-bold text-2xl px-4 py-2 rounded-lg border-2 border-cyan-400">
                            {currentSkill?.name}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* 终极技能 */}
                    {skillAnimation === 'ultimate' && (
                      <>
                        <div className="w-40 h-40 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping border-4 border-purple-300" />
                        <div className="w-52 h-52 bg-gradient-to-r from-pink-600 to-yellow-500 rounded-full animate-ping-delay-1 border-4 border-pink-300" />
                        <div className="w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-ping-delay-2 border-4 border-yellow-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl animate-bounce">💥</span>
                        </div>
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/90 text-yellow-400 font-black text-3xl px-6 py-3 rounded-xl border-4 border-yellow-400 shadow-2xl">
                            终极技！ {currentSkill?.name} -{skillDamageText}
                          </div>
                        </div>
                        {/* 爆炸粒子 */}
                        {[...Array(16)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-6 h-6 rounded-full animate-explosion"
                            style={{
                              left: '50%',
                              top: '50%',
                              animationDelay: `${i * 0.05}s`,
                              backgroundColor: ['#ff6b6b', '#ffd93d', '#ff9f43', '#ee5a24', '#f368e0', '#ff9ff3'][i % 6],
                              transform: `rotate(${i * 22.5}deg) translateY(-60px)`
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* 战斗信息栏 */}
            <div className="bg-black/50 border-t border-white/10 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-500 text-white">
                    回合 {currentRound}
                  </Badge>
                  {comboCount > 1 && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                      连击 x{comboCount}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-white/70">
                  {battlePhase === 'idle' && '准备战斗'}
                  {battlePhase === 'start' && '战斗开始'}
                  {battlePhase === 'player_turn' && '你的回合'}
                  {battlePhase === 'player_attack' && '攻击中...'}
                  {battlePhase === 'skill' && '使用技能...'}
                  {battlePhase === 'monster_attack' && '怪物攻击...'}
                  {battlePhase === 'damage' && '结算中...'}
                  {battlePhase === 'result' && '战斗结束'}
                </div>
              </div>
            </div>
            
            {/* 操作按钮 - 仅在挑战战斗时显示 */}
            <div className="bg-black/60 border-t border-white/10 px-4 py-4">
              <div className="flex flex-col gap-3">
                {/* 攻击按钮 */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleNormalAttack}
                    disabled={hasAttackedThisRound || battlePhase !== 'player_turn'}
                    variant="outline"
                    className={`flex-1 h-12 text-lg font-bold transition-all active:scale-95 ${
                      !hasAttackedThisRound && battlePhase === 'player_turn'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg' 
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Swords className="w-5 h-5" />
                      普通攻击
                    </span>
                  </Button>
                </div>
                
                {/* 技能按钮 */}
                {availableSkills.length > 0 && (
                  <div>
                    <div className="text-sm text-slate-400 mb-2 font-medium">技能</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSkills.map((skill) => {
                        const charSkill = character.skills?.find(s => s.skillId === skill.id);
                        const skillLevel = charSkill?.level || 1;
                        const canUse = playerCurrentMp >= skill.mpCost && battlePhase === 'player_turn' && !hasAttackedThisRound;
                        return (
                          <Button
                            key={skill.id}
                            onClick={() => handleUseSkill(skill)}
                            disabled={!canUse}
                            className={`h-auto py-2 px-3 text-sm font-bold transition-all active:scale-95 ${
                              canUse 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg' 
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex flex-col items-center w-full">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xl">{skill.icon}</span>
                                <span className="text-[10px] bg-yellow-500/30 px-1.5 py-0.5 rounded text-yellow-300 font-medium">Lv.{skillLevel}</span>
                              </div>
                              <span className="text-xs mt-1 font-bold">{skill.name}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[10px] opacity-75">💫{skill.mpCost}</span>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* 未解锁技能提示 */}
                {availableSkills.length === 0 && (
                  <div className="text-center text-slate-400 text-sm py-2">
                    <span className="opacity-60">🔒 暂无可用技能，请先在「技能」页面解锁</span>
                  </div>
                )}
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
          <ScrollArea className="h-48">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
              {monsters.map((monster) => {
                const difficulty = getDifficultyLabel(monster);
                const isSelected = selectedMonster?.id === monster.id;
                return (
                  <Card 
                    key={monster.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                    onClick={() => !isAnyBattleActive && setSelectedMonster(monster)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{monster.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate">{monster.name}</span>
                            <Badge className={`${difficulty.bg} ${difficulty.color} text-xs flex-shrink-0`}>
                              {difficulty.text}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Lv.{monster.level} | 🩷{monster.hp} ⚔️{monster.atk} 🛡️{monster.def}
                          </div>
                          <div className="text-xs text-slate-400 truncate mt-0.5">
                            {monster.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
          
          {/* 挑战按钮 */}
          {selectedMonster && !isAnyBattleActive && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedMonster(null)}
                  variant="outline"
                  className="flex-1 h-14 text-lg font-bold"
                >
                  取消选择
                </Button>
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                  <div className="font-bold text-lg">{selectedMonster.name}</div>
                  <div className="text-sm text-slate-500">
                    Lv.{selectedMonster.level} | 🩷 {selectedMonster.hp} | ⚔️ {selectedMonster.atk} | 🛡️ {selectedMonster.def}
                  </div>
                </div>
              </div>
              <Badge className={`${getDifficultyLabel(selectedMonster).bg} ${getDifficultyLabel(selectedMonster).color}`}>
                {getDifficultyLabel(selectedMonster).text}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {selectedMonster.description}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface BattleRound {
  playerDamage: number;
  monsterDamage: number;
  playerHp: number;
  monsterHp: number;
}
