'use client';

import { useState, useEffect, useRef } from 'react';
import { Character, Monster, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMonstersByRealm, getRecommendedMonster } from '@/lib/game/gameData';
import { 
  Map as MapIcon, 
  Swords,
  Navigation,
  Mountain,
  Trees,
  Castle,
  Skull,
  Sparkles,
  Footprints,
  AlertTriangle,
  Coins,
  Zap,
  Star,
  Compass,
  Wand2,
  ArrowLeft
} from 'lucide-react';

// 地图区域定义
interface MapRegion {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  encounterRate: number;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  particleColor: string;
}

const MAP_REGIONS: MapRegion[] = [
  {
    id: 'forest',
    name: '迷雾森林',
    description: '新手区域，有低级妖兽出没',
    icon: '🌲',
    level: 1,
    encounterRate: 0.25,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    particleColor: '#22c55e'
  },
  {
    id: 'cave',
    name: '幽暗洞穴',
    description: '阴暗潮湿，隐藏着中级怪物',
    icon: '🕳️',
    level: 2,
    encounterRate: 0.30,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 border-slate-300',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-gray-600',
    particleColor: '#64748b'
  },
  {
    id: 'mountain',
    name: '险峻山脉',
    description: '山高路险，妖兽实力强劲',
    icon: '⛰️',
    level: 3,
    encounterRate: 0.35,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
    particleColor: '#f59e0b'
  },
  {
    id: 'valley',
    name: '幽冥谷',
    description: '鬼气森森，凶险异常',
    icon: '💀',
    level: 4,
    encounterRate: 0.40,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-600',
    particleColor: '#a855f7'
  },
  {
    id: 'lava',
    name: '熔岩地狱',
    description: '烈火焚烧，只有强者才能生存',
    icon: '🔥',
    level: 5,
    encounterRate: 0.45,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-orange-600',
    particleColor: '#ef4444'
  },
  {
    id: 'abyss',
    name: '无尽深渊',
    description: '传说中的禁地，顶级妖兽栖息地',
    icon: '👁️',
    level: 6,
    encounterRate: 0.50,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-purple-600',
    particleColor: '#6366f1'
  },
  {
    id: 'heaven',
    name: '天界遗址',
    description: '上古仙人的遗迹，蕴含无尽宝藏',
    icon: '🏛️',
    level: 7,
    encounterRate: 0.55,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-500',
    particleColor: '#06b6d4'
  },
  {
    id: 'chaos',
    name: '混沌虚空',
    description: '天地初开的混沌，最强的挑战',
    icon: '🌀',
    level: 8,
    encounterRate: 0.60,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-200',
    gradientFrom: 'from-rose-400',
    gradientTo: 'to-pink-600',
    particleColor: '#f43f5e'
  }
];

// 粒子组件
function Particle({ color, delay, duration }: { color: string; delay: number; duration: number }) {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    backgroundColor: color,
  };
  
  return (
    <div 
      className="absolute w-2 h-2 rounded-full animate-float-up opacity-0"
      style={style}
    />
  );
}

// 波纹效果组件
function Ripple({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div
      className="absolute rounded-full animate-ripple pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 10,
        height: 10,
        marginLeft: -5,
        marginTop: -5,
        borderColor: color,
        borderWidth: 2,
      }}
    />
  );
}

interface MapAreaProps {
  character: Character;
  onEncounter: (monster: Monster) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
}

export function MapArea({ character, onEncounter, addLog }: MapAreaProps) {
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [showEncounter, setShowEncounter] = useState(false);
  const [encounterMonster, setEncounterMonster] = useState<Monster | null>(null);
  const [exploreProgress, setExploreProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardGold, setRewardGold] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [particles, setParticles] = useState<{ id: number; color: string; delay: number; duration: number }[]>([]);
  const [showDestination, setShowDestination] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  // 根据玩家境界获取可进入的地图区域
  const getAvailableRegions = () => {
    const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
    const currentIndex = realmOrder.indexOf(character.realm);
    return MAP_REGIONS.filter(region => region.level <= currentIndex + 2);
  };

  // 根据区域获取对应怪物
  const getMonsterForRegion = (region: MapRegion): Monster | null => {
    const monsters = getMonstersByRealm(character.realm);
    if (monsters.length === 0) return null;
    const adjustedLevel = Math.min(region.level, 9);
    const monster = monsters.find(m => m.level === adjustedLevel) || monsters[0];
    return monster;
  };

  // 添加波纹效果
  const addRipple = (e: React.MouseEvent, color: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleIdRef.current++;
    setRipples(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  };

  // 生成粒子
  const generateParticles = (color: string, count: number = 20) => {
    const newParticles = [...Array(count)].map((_, i) => ({
      id: Date.now() + i,
      color,
      delay: i * 50,
      duration: 1000 + Math.random() * 1000
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  // 探索区域 - 带动画效果
  const exploreRegion = (region: MapRegion, e: React.MouseEvent) => {
    if (character.stats.hp <= 0) {
      addLog('battle', '气血不足，无法探索！');
      return;
    }

    if (isMoving) return;

    // 添加波纹效果
    addRipple(e, region.particleColor);
    
    // 显示目的地动画
    setShowDestination(true);
    generateParticles(region.particleColor, 30);

    setTimeout(() => {
      setShowDestination(false);
      setSelectedRegion(region.id);
      setIsMoving(true);
      setExploreProgress(0);
      setMoveCount(prev => prev + 1);

      // 动画进度
      const duration = 2500;
      const interval = 50;
      const steps = duration / interval;
      let currentStep = 0;

      const progressTimer = setInterval(() => {
        currentStep++;
        setExploreProgress((currentStep / steps) * 100);
        
        if (currentStep >= steps) {
          clearInterval(progressTimer);
          completeExploration(region);
        }
      }, interval);
    }, 500);
  };

  // 完成探索
  const completeExploration = (region: MapRegion) => {
    setCurrentRegion(region.id);
    setIsMoving(false);
    setSelectedRegion(null);

    // 随机遇怪判定
    if (Math.random() < region.encounterRate) {
      const monster = getMonsterForRegion(region);
      if (monster) {
        setEncounterMonster(monster);
        setShowEncounter(true);
        addLog('battle', `在${region.name}遇到了${monster.name}！`);

        setTimeout(() => {
          setShowEncounter(false);
          onEncounter(monster);
        }, 2000);
      } else {
        // 没有找到怪物，给安全奖励
        const goldFound = Math.floor(Math.random() * 50 * region.level) + 10;
        setRewardGold(goldFound);
        setShowReward(true);
        addLog('system', `探索${region.name}，安全通过，发现${goldFound}金币！`);

        setTimeout(() => {
          setShowReward(false);
        }, 2500);
      }
    } else {
      // 安全探索，获得奖励
      const goldFound = Math.floor(Math.random() * 50 * region.level) + 10;
      setRewardGold(goldFound);
      setShowReward(true);
      addLog('system', `探索${region.name}，安全通过，发现${goldFound}金币！`);

      setTimeout(() => {
        setShowReward(false);
      }, 2500);
    }
  };

  // 获取当前区域信息
  const getCurrentRegion = () => {
    return MAP_REGIONS.find(r => r.id === currentRegion);
  };

  const currentRegionInfo = getCurrentRegion();
  const availableRegions = getAvailableRegions();
  const selectedRegionInfo = MAP_REGIONS.find(r => r.id === selectedRegion);

  return (
    <div className="space-y-4">
      {/* 目的地选择动画 */}
      {showDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center animate-slide-in-bounce">
            <div className="relative">
              {/* 外层光环 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping" />
              </div>
              {/* 旋转指南针 */}
              <Compass className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <div className="mt-4 text-xl font-bold text-white">选择目的地...</div>
          </div>
        </div>
      )}

      {/* 探索进度全屏遮罩 */}
      {isMoving && selectedRegion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-hidden">
          {/* 背景粒子 */}
          {particles.map(p => (
            <Particle key={p.id} color={p.color} delay={p.delay} duration={p.duration} />
          ))}
          
          {/* 返回按钮 - 随时可以取消探索 */}
          <Button
            onClick={() => {
              setIsMoving(false);
              setSelectedRegion(null);
              setExploreProgress(0);
              setParticles([]);
            }}
            className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-800 text-white z-10"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
          
          <div className="text-center relative z-10">
            {/* 目的地动画 */}
            <div className="relative mb-8">
              {/* 多层光环效果 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-48 h-48 rounded-full bg-gradient-to-r ${selectedRegionInfo?.gradientFrom} ${selectedRegionInfo?.gradientTo} opacity-20 animate-ping`} style={{ animationDuration: '1.5s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-40 h-40 rounded-full bg-gradient-to-r ${selectedRegionInfo?.gradientFrom} ${selectedRegionInfo?.gradientTo} opacity-30 animate-pulse`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${selectedRegionInfo?.gradientFrom} ${selectedRegionInfo?.gradientTo} opacity-40`} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
              </div>
              
              {/* 目的地图标 - 多重动画 */}
              <div className="relative">
                <span className="text-8xl block animate-bounce" style={{ animationDuration: '0.8s' }}>
                  {selectedRegionInfo?.icon}
                </span>
                {/* 光晕效果 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-50 blur-lg animate-pulse">
                    {selectedRegionInfo?.icon}
                  </span>
                </div>
              </div>
              
              {/* 旋转星星装饰 */}
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  className="absolute w-6 h-6 text-yellow-400 animate-spin"
                  style={{
                    top: `${20 + Math.cos(i * Math.PI / 2) * 60}px`,
                    left: `calc(50% + ${Math.sin(i * Math.PI / 2) * 60}px)`,
                    animationDuration: '3s',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>

            {/* 目的地名称 - 打字机效果 */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-2 animate-glow-pulse" style={{ color: selectedRegionInfo?.particleColor }}>
                {selectedRegionInfo?.name}
              </div>
              <div className="text-lg text-white/70">
                {selectedRegionInfo?.description}
              </div>
            </div>

            {/* 进度条 - 增强版 */}
            <div className="w-80 mx-auto mb-6">
              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                {/* 进度条背景光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                {/* 进度条填充 */}
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 transition-all duration-200 ease-out rounded-full relative overflow-hidden"
                  style={{ width: `${exploreProgress}%` }}
                >
                  {/* 进度条内部流动光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" style={{ animationDuration: '0.5s' }} />
                </div>
                {/* 进度条边缘光效 */}
                <div 
                  className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-sm"
                  style={{ left: `${exploreProgress - 5}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-white/60 text-sm">探索中...</span>
                <span className="text-white font-bold">{Math.round(exploreProgress)}%</span>
              </div>
            </div>

            {/* 移动的小人动画 - 增强 */}
            <div className="flex justify-center items-center gap-3">
              {[0, 1, 2, 3].map(i => (
                <Footprints 
                  key={i}
                  className="w-8 h-8 text-white animate-bounce" 
                  style={{ 
                    animationDelay: `${i * 150}ms`,
                    opacity: 1 - i * 0.2,
                    transform: `scale(${1 - i * 0.1})`
                  }} 
                />
              ))}
            </div>
            
            {/* 路径点动画 */}
            <div className="relative h-8 mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white/50 rounded-full animate-pulse"
                  style={{
                    left: `${15 + i * 20}%`,
                    animationDelay: `${i * 200}ms`
                  }}
                />
              ))}
            </div>

            {/* 魔法效果 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Wand2 className="w-96 h-96 text-white/5 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
        </div>
      )}

      {/* 遭遇怪物动画 - 增强 */}
      {showEncounter && encounterMonster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden">
          {/* 警告背景闪烁 */}
          <div className="absolute inset-0 bg-red-900/20 animate-pulse" />
          
          {/* 粒子效果 */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
          
          <div className="text-center relative z-10 animate-shake-alert">
            {/* 怪物出现动画 */}
            <div className="relative mb-8">
              {/* 多层光环 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 bg-red-600 rounded-full opacity-20 animate-ping" style={{ animationDuration: '1s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-orange-600 rounded-full opacity-30 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-red-500 rounded-full opacity-40 animate-ping" style={{ animationDuration: '0.8s' }} />
              </div>
              
              {/* 怪物图标 */}
              <div className="relative">
                <span className="text-9xl block animate-bounce" style={{ animationDuration: '0.6s' }}>
                  {encounterMonster.icon}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl opacity-60 blur-xl animate-pulse text-red-500">
                    {encounterMonster.icon}
                  </span>
                </div>
              </div>
              
              {/* 危险标记 */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
            </div>

            {/* 警告文字 - 增强动画 */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white px-10 py-5 rounded-2xl shadow-2xl border-2 border-red-400">
                <div className="text-4xl font-bold flex items-center gap-4">
                  <Swords className="w-10 h-10 animate-pulse" />
                  <span className="animate-pulse">遭遇 {encounterMonster.name}！</span>
                  <Swords className="w-10 h-10 animate-pulse" />
                </div>
              </div>
            </div>

            {/* 战斗提示 */}
            <div className="flex items-center justify-center gap-3 text-white">
              <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
              <span className="text-xl font-bold animate-pulse">准备战斗...</span>
              <Zap className="w-6 h-6 text-yellow-400 animate-bounce" style={{ animationDelay: '200ms' }} />
            </div>
            
            {/* 倒计时点 */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                  style={{ animationDelay: `${i * 300}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 安全探索奖励动画 - 增强 */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-none overflow-hidden">
          {/* 金币粒子 */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            >
              💰
            </div>
          ))}
          
          {/* 星星粒子 */}
          {[...Array(10)].map((_, i) => (
            <Star
              key={i}
              className="absolute w-6 h-6 text-yellow-300 animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 150}ms`
              }}
            />
          ))}
          
          <div className="text-center animate-slide-in-bounce">
            <div className="relative mb-6">
              {/* 光环 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-yellow-400 rounded-full opacity-30 animate-ping" />
              </div>
              
              <Coins className="w-24 h-24 text-yellow-400 animate-bounce relative z-10" />
              
              {/* 闪光效果 */}
              <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-yellow-300 animate-ping" />
              <Sparkles className="absolute -bottom-2 -left-2 w-8 h-8 text-yellow-300 animate-ping" style={{ animationDelay: '200ms' }} />
              <Sparkles className="absolute top-1/2 -right-4 w-6 h-6 text-yellow-200 animate-ping" style={{ animationDelay: '400ms' }} />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-8 py-4 rounded-2xl shadow-xl border-2 border-yellow-300">
                <div className="text-3xl font-bold">✨ 发现 {rewardGold} 金币！✨</div>
              </div>
            </div>
            
            <div className="mt-4 text-green-400 font-bold text-xl animate-pulse">🎉 安全通过~ 🎉</div>
          </div>
        </div>
      )}

      {/* 地图信息 */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300 text-white shadow-lg overflow-hidden relative">
        {/* 动态背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '500ms' }} />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        <CardContent className="p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MapIcon className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="text-lg font-bold">修仙世界</div>
                <div className="text-sm text-emerald-100">
                  当前位置: {currentRegionInfo ? currentRegionInfo.name : '选择目的地'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Footprints className="w-5 h-5" />
              <span className="font-bold text-xl">{moveCount}</span>
              <span className="text-sm">步</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 当前状态 */}
      {currentRegionInfo && (
        <Card className={`${currentRegionInfo.bgColor} border shadow-md overflow-hidden relative animate-slide-in-bounce`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${currentRegionInfo.gradientFrom} ${currentRegionInfo.gradientTo} opacity-10`} />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>{currentRegionInfo.icon}</span>
              <div className="flex-1">
                <div className={`font-bold text-lg ${currentRegionInfo.color}`}>
                  {currentRegionInfo.name}
                </div>
                <div className="text-sm text-slate-600">{currentRegionInfo.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    遇怪率: {Math.round(currentRegionInfo.encounterRate * 100)}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    推荐等级: {currentRegionInfo.level}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 地图区域列表 */}
      <Card className="bg-white border-slate-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-emerald-600 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            选择目的地
          </CardTitle>
        </CardHeader>
        <CardContent ref={cardRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            {/* 波纹效果 */}
            {ripples.map(ripple => (
              <Ripple key={ripple.id} x={ripple.x} y={ripple.y} color={ripple.color} />
            ))}
            
            {availableRegions.map((region, index) => {
              const isCurrentRegion = currentRegion === region.id;
              const isSelected = selectedRegion === region.id;
              return (
                <div
                  key={region.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 relative overflow-hidden
                    transform hover:scale-105 hover:shadow-xl
                    ${isCurrentRegion
                      ? `${region.bgColor} border-current ring-2 ring-offset-2`
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }
                    ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 scale-105' : ''}
                    ${isMoving && !isSelected ? 'opacity-50 pointer-events-none' : ''}
                  `}
                  onClick={(e) => {
                    if (character.stats.hp <= 0) {
                      addLog('battle', '气血不足，无法探索！');
                      return;
                    }
                    if (!isMoving) {
                      exploreRegion(region, e);
                    }
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* 悬停光效 */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${region.gradientFrom} ${region.gradientTo} opacity-0 hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="flex items-center gap-3 relative">
                    <span className="text-4xl transition-transform duration-300 hover:rotate-12 hover:scale-110">{region.icon}</span>
                    <div className="flex-1">
                      <div className={`font-bold ${region.color}`}>{region.name}</div>
                      <div className="text-xs text-slate-500">{region.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          遇怪 {Math.round(region.encounterRate * 100)}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Lv.{region.level}
                        </Badge>
                      </div>
                    </div>
                    {isCurrentRegion && (
                      <div className="text-amber-500">
                        <Footprints className="w-5 h-5 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 气血不足提示 */}
      {character.stats.hp <= 0 && (
        <Card className="bg-red-50 border-red-200 text-red-600 shadow-md overflow-hidden animate-shake-alert">
          <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse" />
          <CardContent className="p-4 text-center relative">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 animate-bounce" />
            <p className="font-bold text-lg">气血耗尽，无法探索！</p>
            <p className="text-sm text-red-500 mt-1">请先恢复气血</p>
            <div className="mt-4 space-y-2">
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回主页
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  // 触发修炼恢复
                  window.dispatchEvent(new CustomEvent('restoreHp'));
                }}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                修炼恢复
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 探索提示 */}
      <Card className="bg-slate-50 border-slate-200 text-slate-700 shadow-md">
        <CardContent className="p-4">
          <div className="text-sm text-slate-600">
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-emerald-500" />
              探索说明
            </div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>选择地图区域进行探索</li>
              <li>探索时有概率遇到怪物触发战斗</li>
              <li>高等级区域遇怪概率更高，但奖励更丰厚</li>
              <li>境界越高，可探索的区域越多</li>
              <li>安全探索可能发现金币奖励</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
