'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles,
  User,
  Mountain
} from 'lucide-react';

interface StartScreenProps {
  onStart: (name: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    if (name.trim()) {
      setIsStarting(true);
      setTimeout(() => {
        onStart(name.trim());
      }, 500);
    }
  };

  return (
    <div className="game-bg flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md bg-white/95 border-amber-300/50 text-slate-800 shadow-2xl shadow-amber-900/10 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Mountain className="w-16 h-16 text-amber-500" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-500 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            修仙之路
          </CardTitle>
          <p className="text-slate-500 mt-2">踏入仙途，追求永恒</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-amber-600 flex items-center gap-2">
              <User className="w-4 h-4" />
              道号
            </Label>
            <Input
              id="name"
              placeholder="请输入你的道号..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="bg-slate-50 border-amber-300 focus:border-amber-500 focus:ring-amber-200 text-slate-800 placeholder:text-slate-400"
              maxLength={12}
            />
            <p className="text-xs text-slate-400">道号最长12个字符</p>
          </div>

          <Button
            onClick={handleStart}
            disabled={!name.trim() || isStarting}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 disabled:opacity-50"
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                踏入仙途...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                开始修仙
              </span>
            )}
          </Button>

          {/* 游戏介绍 */}
          <div className="text-center text-sm text-slate-600 space-y-2 pt-4 border-t border-slate-200">
            <p>🗡️ 打怪升级 — 斩妖除魔获取经验</p>
            <p>📿 收集法宝 — 装备丹药助你修行</p>
            <p>⚡ 渡劫飞升 — 突破境界成就大道</p>
          </div>

          {/* 版本信息 */}
          <div className="text-center text-xs text-slate-400">
            v1.0.0 — 数据保存在本地浏览器
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
