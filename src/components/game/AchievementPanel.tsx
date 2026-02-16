'use client';

import { useState } from 'react';
import { Character, Achievement, AchievementProgress, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { ACHIEVEMENTS } from '@/lib/game/gameFeatures';
import { 
  Trophy, 
  Star, 
  Gift,
  Crown,
  Swords,
  BookOpen,
  Coins,
  Sparkles
} from 'lucide-react';

interface AchievementPanelProps {
  character: Character;
  achievementProgress: AchievementProgress[];
  statistics: {
    totalWins: number;
    totalGoldEarned: number;
    tribulationSuccesses: number;
  };
  onUpdateProgress: (progress: AchievementProgress[]) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  onReward: (exp: number, gold: number, title?: string) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  battle: <Swords className="w-4 h-4" />,
  level: <BookOpen className="w-4 h-4" />,
  collection: <Coins className="w-4 h-4" />,
  exploration: <Sparkles className="w-4 h-4" />,
  special: <Star className="w-4 h-4" />
};

const typeColors: Record<string, string> = {
  battle: 'text-red-500',
  level: 'text-blue-500',
  collection: 'text-amber-500',
  exploration: 'text-green-500',
  special: 'text-purple-500'
};

export function AchievementPanel({ 
  character, 
  achievementProgress, 
  statistics,
  onUpdateProgress, 
  addLog, 
  onReward 
}: AchievementPanelProps) {
  const [activeType, setActiveType] = useState<string>('all');

  const getAchievementProgress = (achievementId: string): AchievementProgress | undefined => {
    return achievementProgress.find(p => p.achievementId === achievementId);
  };

  const getAchievementStatus = (achievement: Achievement): 'locked' | 'in_progress' | 'completed' | 'claimed' => {
    const progress = getAchievementProgress(achievement.id);
    if (!progress) return 'locked';
    if (progress.claimed) return 'claimed';
    if (progress.completed) return 'completed';
    return 'in_progress';
  };

  const getCurrentCount = (achievement: Achievement): number => {
    const req = achievement.requirement;
    switch (req.type) {
      case 'win_battle':
        return statistics.totalWins;
      case 'reach_level':
        return character.level;
      case 'reach_realm':
        const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
        return realmOrder.indexOf(character.realm) + 1;
      case 'total_gold':
        return statistics.totalGoldEarned;
      case 'tribulation_success':
        return statistics.tribulationSuccesses;
      default:
        const progress = getAchievementProgress(achievement.id);
        return progress?.currentCount || 0;
    }
  };

  const checkCompletion = (achievement: Achievement): boolean => {
    const currentCount = getCurrentCount(achievement);
    return currentCount >= achievement.requirement.target;
  };

  const claimReward = (achievement: Achievement) => {
    const progress = getAchievementProgress(achievement.id);
    if (!progress || !progress.completed || progress.claimed) return;
    
    const updatedProgress = achievementProgress.map(p => 
      p.achievementId === achievement.id ? { ...p, claimed: true } : p
    );
    
    onUpdateProgress(updatedProgress);
    
    const rewards = achievement.rewards;
    onReward(rewards.exp || 0, rewards.gold || 0, rewards.title);
    addLog('achievement', `达成成就：${achievement.name}！`);
  };

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (activeType === 'all') return true;
    return a.type === activeType;
  });

  const completedCount = achievementProgress.filter(p => p.claimed).length;
  const totalAchievements = ACHIEVEMENTS.length;

  const renderAchievementCard = (achievement: Achievement) => {
    const status = getAchievementStatus(achievement);
    const currentCount = getCurrentCount(achievement);
    const target = achievement.requirement.target;
    const progressPercent = Math.min(100, (currentCount / target) * 100);
    const isCompleted = checkCompletion(achievement);

    if (status === 'locked' && !isCompleted) {
      const updatedProgress = [...achievementProgress];
      const existingIndex = updatedProgress.findIndex(p => p.achievementId === achievement.id);
      if (existingIndex === -1) {
        updatedProgress.push({
          achievementId: achievement.id,
          currentCount,
          completed: false,
          claimed: false
        });
      }
    }

    if (status === 'locked' || status === 'in_progress') {
      if (isCompleted && !achievementProgress.find(p => p.achievementId === achievement.id)?.completed) {
        const updatedProgress = achievementProgress.map(p => 
          p.achievementId === achievement.id ? { ...p, completed: true } : p
        );
        if (!updatedProgress.find(p => p.achievementId === achievement.id)) {
          updatedProgress.push({
            achievementId: achievement.id,
            currentCount,
            completed: true,
            claimed: false
          });
        }
        onUpdateProgress(updatedProgress);
        addLog('achievement', `成就进度达成：${achievement.name}！`);
      }
    }

    return (
      <Card key={achievement.id} className={`mb-2 ${
        status === 'claimed' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300' :
        status === 'completed' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' :
        'bg-white border-slate-200'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${status === 'claimed' ? 'opacity-50' : ''}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${typeColors[achievement.type]}`}>
                    {achievement.name}
                  </span>
                  {achievement.rewards.title && (
                    <Badge className="bg-purple-500 text-white text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      {achievement.rewards.title}
                    </Badge>
                  )}
                  {status === 'claimed' && (
                    <Badge className="bg-amber-500 text-white">已领取</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">{achievement.description}</p>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>进度</span>
                    <span>{Math.min(currentCount, target)}/{target}</span>
                  </div>
                  <Progress 
                    value={progressPercent} 
                    className={`h-2 ${status === 'claimed' ? 'bg-amber-100' : ''}`}
                  />
                </div>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  {achievement.rewards.exp && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      {achievement.rewards.exp} 经验
                    </span>
                  )}
                  {achievement.rewards.gold && (
                    <span className="flex items-center gap-1">
                      💰 {achievement.rewards.gold} 金币
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="ml-3">
              {status === 'completed' && (
                <Button 
                  size="sm" 
                  onClick={() => claimReward(achievement)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  领取
                </Button>
              )}
              {status === 'claimed' && (
                <Trophy className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const types = ['all', 'battle', 'level', 'collection', 'exploration', 'special'];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <div>
                <div className="text-lg font-bold">成就系统</div>
                <div className="text-sm text-amber-100">
                  已完成: {completedCount}/{totalAchievements}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Progress 
                value={(completedCount / totalAchievements) * 100} 
                className="w-24 h-2 bg-amber-300"
              />
              <div className="text-xs mt-1 text-amber-100">
                {Math.round((completedCount / totalAchievements) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {types.map(type => (
          <Button 
            key={type}
            variant={activeType === type ? 'default' : 'outline'}
            onClick={() => setActiveType(type)}
            size="sm"
            className={activeType === type ? 'bg-amber-500 hover:bg-amber-600' : ''}
          >
            {type === 'all' ? '全部' : (
              <span className="flex items-center gap-1">
                {typeIcons[type]}
                {type === 'battle' ? '战斗' : 
                 type === 'level' ? '等级' : 
                 type === 'collection' ? '收集' : 
                 type === 'exploration' ? '探索' : '特殊'}
              </span>
            )}
          </Button>
        ))}
      </div>

      <Card className="bg-white border-slate-200 shadow-md">
        <CardContent className="p-4">
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {filteredAchievements.map(achievement => renderAchievementCard(achievement))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
