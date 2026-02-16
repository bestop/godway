'use client';

import { useState } from 'react';
import { useGameState, GameTab } from '@/hooks/useGameState';
import { CharacterPanel } from '@/components/game/CharacterPanel';
import { BattleArea } from '@/components/game/BattleArea';
import { Inventory } from '@/components/game/Inventory';
import { Tribulation } from '@/components/game/Tribulation';
import { Market } from '@/components/game/Market';
import { MapArea } from '@/components/game/MapArea';
import { GameLog } from '@/components/game/GameLog';
import { StartScreen } from '@/components/game/StartScreen';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Swords, 
  Package, 
  Zap, 
  Store,
  RotateCcw,
  Mountain,
  Sparkles,
  Map
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
    quickBattle,
    mapEncounter,
    useItem,
    equip,
    unequip,
    sellItem,
    buyFromMarket,
    buyNpcItem,
    doMeditate,
    doTribulation,
    restore
  } = useGameState();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 加载中
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

  // 开始界面
  if (!character) {
    return <StartScreen onStart={initGame} />;
  }

  // 主游戏界面
  return (
    <div className="game-bg text-slate-800">
      {/* 顶部标题栏 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-amber-300/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                修仙之路
              </h1>
            </div>
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
                    这将删除所有游戏数据，包括角色、背包、市场等。此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-100 border-slate-200 text-slate-700">取消</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      resetGame();
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
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* 左侧 - 角色信息 */}
          <div className="lg:col-span-1">
            <CharacterPanel 
              character={character} 
              inventory={inventory}
              onRestore={restore}
              onMeditate={doMeditate}
            />
          </div>

          {/* 中间 - 主游戏区域 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 标签页导航 */}
            <Tabs value={currentTab} onValueChange={(v) => setTab(v as GameTab)} className="w-full">
              <TabsList className="grid grid-cols-6 bg-white border border-slate-200 shadow-sm">
                <TabsTrigger value="map" className="text-xs sm:text-sm data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
                  <Map className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">地图</span>
                </TabsTrigger>
                <TabsTrigger value="battle" className="text-xs sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                  <Swords className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">战斗</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  <Package className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">背包</span>
                </TabsTrigger>
                <TabsTrigger value="tribulation" className="text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">渡劫</span>
                </TabsTrigger>
                <TabsTrigger value="market" className="text-xs sm:text-sm data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700">
                  <Store className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">市场</span>
                </TabsTrigger>
                <TabsTrigger value="cultivation" className="text-xs sm:text-sm data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">修炼</span>
                </TabsTrigger>
              </TabsList>

              {/* 地图页面 */}
              <TabsContent value="map" className="mt-4">
                <MapArea 
                  character={character}
                  onEncounter={mapEncounter}
                  addLog={addLog}
                />
              </TabsContent>

              {/* 战斗页面 */}
              <TabsContent value="battle" className="mt-4">
                <BattleArea 
                  character={character}
                  battleLogs={logs}
                  onQuickBattle={quickBattle}
                  addLog={addLog}
                />
              </TabsContent>

              {/* 背包页面 */}
              <TabsContent value="inventory" className="mt-4">
                <Inventory 
                  character={character}
                  inventory={inventory}
                  onUseItem={useItem}
                  onEquip={equip}
                  onUnequip={unequip}
                  onSellItem={sellItem}
                />
              </TabsContent>

              {/* 渡劫页面 */}
              <TabsContent value="tribulation" className="mt-4">
                <Tribulation 
                  character={character}
                  onTribulation={doTribulation}
                />
              </TabsContent>

              {/* 市场页面 */}
              <TabsContent value="market" className="mt-4">
                <Market 
                  character={character}
                  market={market}
                  playerId={playerId}
                  onBuy={buyFromMarket}
                  onBuyNpcItem={buyNpcItem}
                />
              </TabsContent>

              {/* 修炼页面 */}
              <TabsContent value="cultivation" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-blue-200 rounded-lg p-6 text-center shadow-md">
                    <div className="text-4xl mb-4">🧘</div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">修炼</h3>
                    <p className="text-slate-500 text-sm mb-4">
                      打坐修炼，恢复气血和灵力
                    </p>
                    <Button 
                      onClick={doMeditate}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      开始修炼
                    </Button>
                  </div>
                  
                  <div className="bg-white border border-green-200 rounded-lg p-6 text-center shadow-md">
                    <div className="text-4xl mb-4">💚</div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">完全恢复</h3>
                    <p className="text-slate-500 text-sm mb-4">
                      瞬间恢复全部气血和灵力
                    </p>
                    <Button 
                      onClick={restore}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      立即恢复
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* 游戏日志 */}
            <GameLog logs={logs} />
          </div>
        </div>
      </main>

      {/* 底部信息 */}
      <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-200 bg-white/50">
        <p>修仙之路 v1.0.0 — 数据保存在本地浏览器</p>
      </footer>
    </div>
  );
}
