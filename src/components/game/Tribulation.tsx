'use client';

import { useState } from 'react';
import { Character } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { REALMS, getNextRealm, getRealmConfig } from '@/types/game';
import { 
  Zap, 
  Star, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flame
} from 'lucide-react';

interface TribulationProps {
  character: Character;
  onTribulation: () => void;
}

export function Tribulation({ character, onTribulation }: TribulationProps) {
  const [isAttempting, setIsAttempting] = useState(false);
  
  const currentRealmIndex = REALMS.findIndex(r => r.name === character.realm);
  const nextRealm = getNextRealm(character.realm);
  const canTribulate = character.level === 9;
  const realmConfig = getRealmConfig(character.realm);
  
  // 计算成功率
  const baseSuccessRate = realmConfig.tribulationSuccessBase;
  const bonusRate = Math.min(0.5, character.tribulationPills * 0.1);
  const totalSuccessRate = Math.min(1, baseSuccessRate + bonusRate);
  
  // 是否为最终境界
  const isFinalRealm = !nextRealm;

  const handleTribulation = () => {
    setIsAttempting(true);
    setTimeout(() => {
      onTribulation();
      setIsAttempting(false);
    }, 1500);
  };

  // 境界图标
  const getRealmIcon = (index: number) => {
    const icons = ['🌱', '🌿', '🌸', '💫', '✨', '🔥', '⭐', '👑'];
    return icons[index] || '🌟';
  };

  return (
    <div className="space-y-4">
      {/* 当前状态 */}
      <Card className="bg-gradient-to-b from-purple-100 to-purple-50 border-purple-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-purple-600 flex items-center gap-2">
            <Flame className="w-5 h-5" />
            渡劫境界
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {REALMS.map((realm, index) => {
              const isCurrentRealm = realm.name === character.realm;
              const isPassed = index < currentRealmIndex;
              const isNext = index === currentRealmIndex + 1;
              
              return (
                <div 
                  key={realm.name}
                  className={`
                    p-2 rounded-lg text-center border transition-all
                    ${isCurrentRealm 
                      ? 'bg-purple-200 border-purple-400 shadow-md' 
                      : isPassed 
                        ? 'bg-green-50 border-green-300'
                        : isNext && canTribulate
                          ? 'bg-amber-50 border-amber-300 animate-pulse'
                          : 'bg-slate-50 border-slate-200'
                    }
                  `}
                >
                  <div className="text-xl">{getRealmIcon(index)}</div>
                  <div className={`text-xs mt-1 ${isCurrentRealm ? 'text-purple-600 font-bold' : isPassed ? 'text-green-600' : 'text-slate-400'}`}>
                    {realm.name.replace('期', '')}
                  </div>
                  {isCurrentRealm && (
                    <div className="text-[10px] text-purple-500">{character.level}层</div>
                  )}
                  {isPassed && (
                    <CheckCircle className="w-3 h-3 text-green-500 mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 渡劫信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 当前境界 */}
        <Card className="bg-white border-slate-200 text-slate-800 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getRealmIcon(currentRealmIndex)}</div>
              <div>
                <div className="text-slate-500 text-sm">当前境界</div>
                <div className="text-xl font-bold text-purple-600">
                  {character.realm} {character.level}层
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-slate-500 mb-1">修为进度</div>
              <Progress 
                value={(character.level / 9) * 100} 
                className="h-2 bg-purple-100 [&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-pink-500" 
              />
              <div className="text-xs text-slate-400 mt-1 text-right">
                {character.level}/9 层
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 下一境界 */}
        <Card className={`bg-white border-slate-200 text-slate-800 shadow-md ${canTribulate && nextRealm ? 'ring-2 ring-amber-300' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {nextRealm ? getRealmIcon(currentRealmIndex + 1) : '🏆'}
              </div>
              <div>
                <div className="text-slate-500 text-sm">
                  {isFinalRealm ? '最终境界' : '下一境界'}
                </div>
                <div className="text-xl font-bold text-amber-600">
                  {nextRealm || '已达巅峰'}
                </div>
              </div>
            </div>
            {!isFinalRealm && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">基础成功率</span>
                  <span className="text-purple-600">{(baseSuccessRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">渡劫丹加成</span>
                  <span className="text-green-600">+{(bonusRate * 100).toFixed(0)}%</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">总成功率</span>
                  <span className="text-amber-600 text-lg">
                    {(totalSuccessRate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 渡劫操作 */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-slate-800 shadow-lg">
        <CardContent className="p-6">
          {isFinalRealm ? (
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto text-amber-500 mb-3" />
              <div className="text-xl font-bold text-amber-600">
                恭喜！已达修仙巅峰！
              </div>
              <div className="text-slate-500 mt-2">
                你已成功渡劫成仙，超越了凡人的极限
              </div>
            </div>
          ) : canTribulate ? (
            <div className="text-center">
              <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
              <div className="text-lg font-medium text-slate-800 mb-2">
                准备渡劫 {character.realm} → {nextRealm}
              </div>
              <div className="text-slate-500 mb-4 text-sm">
                渡劫失败将跌落至当前境界1层，并损失一颗渡劫丹
              </div>
              
              {/* 渡劫丹信息 */}
              <div className="bg-white rounded-lg p-3 mb-4 inline-block border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600">
                  <span>📿</span>
                  <span>渡劫丹: {character.tribulationPills} 颗</span>
                  {character.tribulationPills < 5 && (
                    <span className="text-xs text-slate-400">
                      (可增加{(Math.min(5, character.tribulationPills) * 10)}%成功率)
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleTribulation}
                disabled={isAttempting}
                className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                {isAttempting ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 animate-pulse" />
                    渡劫中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    开始渡劫
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <div className="text-lg font-medium text-slate-500">
                尚未达到渡劫条件
              </div>
              <div className="text-slate-400 mt-2 text-sm">
                需要达到 {character.realm} 9层才能尝试渡劫
              </div>
              <Progress 
                value={(character.level / 9) * 100} 
                className="h-2 bg-slate-200 [&>div]:bg-slate-400 mt-3 max-w-xs mx-auto" 
              />
              <div className="text-sm text-slate-400 mt-2">
                当前：{character.level}/9 层
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 渡劫说明 */}
      <Card className="bg-slate-50 border-slate-200 text-slate-700 shadow-md">
        <CardContent className="p-4">
          <div className="text-sm text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              渡劫说明
            </div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>每个大境界有9层，达到9层后可尝试渡劫进入下一境界</li>
              <li>境界越高，渡劫基础成功率越低</li>
              <li>使用渡劫丹可提升成功率，每颗+10%，最多叠加5颗</li>
              <li>渡劫失败将跌落至当前境界1层</li>
              <li>渡劫成功将进入下一境界1层，并获得1000金币奖励</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
