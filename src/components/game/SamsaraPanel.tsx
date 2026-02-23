'use client';

import { Character, getSamsaraRequirement, getSamsaraBonuses } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Infinity, 
  Sparkles, 
  Zap, 
  Shield, 
  Heart,
  Trophy,
  ArrowRight
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

interface SamsaraPanelProps {
  character: Character;
  onSamsara?: () => void;
}

export function SamsaraPanel({ character, onSamsara }: SamsaraPanelProps) {
  const samsara = character.samsara || {
    currentCycle: 0,
    totalCycles: 0,
    cycleBonuses: { atk: 0, def: 0, hp: 0, mp: 0, expRate: 1, goldRate: 1 },
    cycleRequirements: { exp: getSamsaraRequirement(0) },
    canSamsara: false
  };
  
  const totalExp = character.totalExp || 0;
  const requiredExp = samsara.cycleRequirements.exp;
  const progress = Math.min(100, (totalExp / requiredExp) * 100);
  const canSamsara = totalExp >= requiredExp;
  const nextCycleBonuses = getSamsaraBonuses(samsara.currentCycle + 1);
  
  return (
    <div className="space-y-4">
      {/* 轮回概览 */}
      <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-amber-300 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-3xl shadow-xl animate-pulse">
                  <Infinity className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {samsara.currentCycle}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">轮回系统</div>
                <div className="text-amber-100">
                  第 {samsara.currentCycle} 世 · 累计 {samsara.totalCycles} 世
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-200">
                +{Math.round((samsara.cycleBonuses.expRate - 1) * 100)}%
              </div>
              <div className="text-sm text-amber-100">经验加成</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 轮回进度 */}
      <Card className="bg-white border-amber-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-amber-600 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            下次轮回进度
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">累计经验</span>
              <span className="font-bold text-amber-600">
                {totalExp.toLocaleString()} / {requiredExp.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-4" />
            <div className="text-xs text-slate-500 text-right">
              {Math.round(progress)}%
            </div>
          </div>
          
          {/* 轮回按钮 */}
          {canSamsara && onSamsara && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2">
                    <Infinity className="w-6 h-6" />
                    开始轮回
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border-amber-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl text-amber-600 flex items-center gap-2">
                    <Infinity className="w-6 h-6" />
                    确认轮回？
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600">
                    轮回将重置你的境界、经验和金币，但会保留以下加成：
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                  <div className="text-sm font-medium text-amber-800">轮回后将获得：</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Zap className="w-4 h-4 text-amber-500" />
                      攻击力 +{nextCycleBonuses.atk}
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Shield className="w-4 h-4 text-amber-500" />
                      防御力 +{nextCycleBonuses.def}
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Heart className="w-4 h-4 text-amber-500" />
                      气血 +{nextCycleBonuses.hp}
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      灵力 +{nextCycleBonuses.mp}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-700 pt-2 border-t border-amber-200">
                    经验获取 +{Math.round((nextCycleBonuses.expRate - 1) * 100)}% · 
                    金币获取 +{Math.round((nextCycleBonuses.goldRate - 1) * 100)}%
                  </div>
                </div>
                
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    取消
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onSamsara}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  >
                    确认轮回
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {!canSamsara && (
            <div className="text-center py-4 text-slate-500">
              <div className="text-lg">继续积累经验以开启轮回</div>
              <div className="text-sm mt-1">还需要 {(requiredExp - totalExp).toLocaleString()} 经验</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 当前轮回加成 */}
      <Card className="bg-white border-amber-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-amber-600 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            当前轮回加成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-700">攻击力</span>
              </div>
              <div className="text-2xl font-bold text-red-600">+{samsara.cycleBonuses.atk}</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-blue-700">防御力</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">+{samsara.cycleBonuses.def}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-green-500" />
                <span className="font-bold text-green-700">气血</span>
              </div>
              <div className="text-2xl font-bold text-green-600">+{samsara.cycleBonuses.hp}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-purple-700">灵力</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">+{samsara.cycleBonuses.mp}</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm font-medium text-yellow-700 mb-1">经验获取</div>
              <div className="text-xl font-bold text-yellow-600">
                +{Math.round((samsara.cycleBonuses.expRate - 1) * 100)}%
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="text-sm font-medium text-amber-700 mb-1">金币获取</div>
              <div className="text-xl font-bold text-amber-600">
                +{Math.round((samsara.cycleBonuses.goldRate - 1) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 轮回说明 */}
      <Card className="bg-amber-50 border-amber-200 text-amber-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Infinity className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <div className="font-medium">轮回系统说明</div>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                <li>• 积累足够经验后可进行轮回</li>
                <li>• 轮回后境界、经验、金币重置，但保留轮回加成</li>
                <li>• 每次轮回获得永久属性加成和收益倍率提升</li>
                <li>• 轮回次数越多，下一次轮回所需经验越高</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
