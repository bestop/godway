'use client';

import { useState, useEffect } from 'react';
import { Character, DailySignIn, DailySignInReward, IdleReward, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DAILY_SIGN_IN_REWARDS, getDailySignInReward, getNextSignInReward } from '@/lib/game/gameFeatures';
import { getItemById } from '@/lib/game/gameData';
import { 
  Calendar, 
  Gift, 
  Clock,
  Coins,
  Star,
  ChevronRight
} from 'lucide-react';

interface DailySignInPanelProps {
  character: Character;
  dailySignIn: DailySignIn;
  idleReward: IdleReward;
  onUpdateSignIn: (signIn: DailySignIn) => void;
  onUpdateIdleReward: (reward: IdleReward) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  onReward: (exp: number, gold: number, items: string[]) => void;
}

export function DailySignInPanel({ 
  character, 
  dailySignIn, 
  idleReward,
  onUpdateSignIn, 
  onUpdateIdleReward,
  addLog, 
  onReward 
}: DailySignInPanelProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const canSignIn = dailySignIn.lastSignInDate !== today;

  const handleSignIn = () => {
    if (!canSignIn) return;

    let consecutiveDays = dailySignIn.consecutiveDays;
    
    const lastDate = new Date(dailySignIn.lastSignInDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutiveDays++;
    } else if (diffDays > 1) {
      consecutiveDays = 1;
    } else {
      consecutiveDays = 1;
    }

    const reward = getDailySignInReward(consecutiveDays);
    const newSignIn: DailySignIn = {
      lastSignInDate: today,
      consecutiveDays,
      totalDays: dailySignIn.totalDays + 1,
      rewards: [...dailySignIn.rewards, { day: consecutiveDays, rewards: reward?.rewards || {} }]
    };

    onUpdateSignIn(newSignIn);

    if (reward) {
      const rewards = reward.rewards;
      onReward(
        rewards.exp || 0, 
        rewards.gold || 0, 
        rewards.item ? [rewards.item] : []
      );
      addLog('system', `签到成功！连续签到${consecutiveDays}天，获得奖励！`);
    }
  };

  const calculateIdleReward = () => {
    const elapsed = now - idleReward.lastClaimTime;
    const maxTime = idleReward.maxAccumulationHours * 60 * 60 * 1000;
    const effectiveTime = Math.min(elapsed, maxTime);
    
    const hours = effectiveTime / (60 * 60 * 1000);
    const baseExpPerHour = 50 * (character.level + 1);
    const baseGoldPerHour = 30 * (character.level + 1);
    
    return {
      exp: Math.floor(hours * baseExpPerHour),
      gold: Math.floor(hours * baseGoldPerHour),
      hours: hours
    };
  };

  const handleClaimIdleReward = () => {
    const reward = calculateIdleReward();
    
    if (reward.exp <= 0 && reward.gold <= 0) return;

    const newIdleReward: IdleReward = {
      ...idleReward,
      lastClaimTime: now,
      accumulatedExp: 0,
      accumulatedGold: 0
    };

    onUpdateIdleReward(newIdleReward);
    onReward(reward.exp, reward.gold, []);
    addLog('system', `领取挂机收益：${reward.exp}经验，${reward.gold}金币`);
  };

  const idleRewardData = calculateIdleReward();
  const maxIdleTime = idleReward.maxAccumulationHours * 60 * 60 * 1000;
  const idleProgress = Math.min(100, ((now - idleReward.lastClaimTime) / maxIdleTime) * 100);

  const nextReward = getNextSignInReward(dailySignIn.consecutiveDays);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <div className="text-lg font-bold">每日签到</div>
                <div className="text-sm text-blue-100">
                  连续签到: {dailySignIn.consecutiveDays}天
                </div>
              </div>
            </div>
            <Button
              onClick={handleSignIn}
              disabled={!canSignIn}
              className={canSignIn 
                ? 'bg-white text-blue-600 hover:bg-blue-50' 
                : 'bg-blue-300 text-blue-600 cursor-not-allowed'
              }
            >
              {canSignIn ? '签到' : '已签到'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            签到奖励预览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAILY_SIGN_IN_REWARDS.slice(0, 7).map((reward, index) => {
              const isClaimed = dailySignIn.consecutiveDays > index;
              const isCurrent = dailySignIn.consecutiveDays === index;
              
              return (
                <div 
                  key={reward.day}
                  className={`p-2 rounded-lg text-center text-xs ${
                    isClaimed ? 'bg-green-100 border border-green-300' :
                    isCurrent ? 'bg-blue-100 border border-blue-300' :
                    'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-700">第{reward.day}天</div>
                  <div className="mt-1">
                    {reward.rewards.gold && <span>💰{reward.rewards.gold}</span>}
                  </div>
                  {isClaimed && <div className="text-green-500 mt-1">✓</div>}
                </div>
              );
            })}
          </div>

          {nextReward && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-amber-700">下一奖励</div>
                  <div className="font-bold text-amber-800">第{nextReward.day}天签到</div>
                </div>
                <div className="text-right">
                  {nextReward.rewards.gold && (
                    <Badge className="bg-amber-500 text-white mr-1">💰{nextReward.rewards.gold}</Badge>
                  )}
                  {nextReward.rewards.exp && (
                    <Badge className="bg-purple-500 text-white mr-1">⭐{nextReward.rewards.exp}</Badge>
                  )}
                  {nextReward.rewards.item && (
                    <Badge className="bg-indigo-500 text-white">🎁物品</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8" />
              <div>
                <div className="text-lg font-bold">挂机收益</div>
                <div className="text-sm text-emerald-100">
                  累计时间: {idleRewardData.hours.toFixed(1)}小时
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>累计进度</span>
              <span>{Math.round(idleProgress)}%</span>
            </div>
            <Progress value={idleProgress} className="h-2 bg-emerald-300" />
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {idleRewardData.exp.toLocaleString()} 经验
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {idleRewardData.gold.toLocaleString()} 金币
                </span>
              </div>
              <Button
                onClick={handleClaimIdleReward}
                disabled={idleRewardData.exp <= 0 && idleRewardData.gold <= 0}
                className="bg-white text-emerald-600 hover:bg-emerald-50"
                size="sm"
              >
                领取
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border-slate-200 text-slate-700 shadow-md">
        <CardContent className="p-4">
          <div className="text-sm">
            <div className="font-bold text-slate-800 mb-2">💡 挂机说明</div>
            <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
              <li>离线时自动累积经验和金币收益</li>
              <li>最多累积{idleReward.maxAccumulationHours}小时的收益</li>
              <li>收益随等级提升而增加</li>
              <li>记得定期领取收益哦！</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
