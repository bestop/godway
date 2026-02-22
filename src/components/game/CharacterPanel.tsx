'use client';

import { Character, InventoryItem, EquipmentItem, QualityColors } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Coins,
  TrendingUp,
  Star,
  Package
} from 'lucide-react';

interface CharacterPanelProps {
  character: Character;
  inventory: InventoryItem[];
  onRestore: () => void;
  onMeditate: () => void;
}

export function CharacterPanel({ character, inventory, onRestore, onMeditate }: CharacterPanelProps) {
  const expPercent = (character.exp / character.expToNext) * 100;
  const hpPercent = (character.stats.hp / character.stats.maxHp) * 100;
  const mpPercent = (character.stats.mp / character.stats.maxMp) * 100;
  
  // 计算回血丹数量
  const hpPills = inventory.filter(i => 
    i && i.item && i.item.type === 'pill' && (i.item as any).effect === 'hp'
  ).reduce((sum, i) => sum + (i.quantity || 0), 0);
  
  // 渡劫丹数量（从角色属性中获取，因为使用后会转移到角色身上）
  const tribulationPillsInBag = character.tribulationPills;
  
  // 境界颜色
  const getRealmColor = () => {
    const colors: Record<string, string> = {
      '练气期': 'from-green-500 to-green-600',
      '筑基期': 'from-blue-500 to-blue-600',
      '金丹期': 'from-yellow-500 to-yellow-600',
      '元婴期': 'from-purple-500 to-purple-600',
      '化神期': 'from-pink-500 to-pink-600',
      '合体期': 'from-red-500 to-red-600',
      '大乘期': 'from-orange-500 to-orange-600',
      '渡劫期': 'from-slate-100 to-white'
    };
    return colors[character.realm] || 'from-slate-400 to-slate-600';
  };

  // 获取装备属性描述
  const getEquipmentStats = (equipment: EquipmentItem): string => {
    const stats: string[] = [];
    if (equipment.stats.atk) stats.push(`攻+${equipment.stats.atk}`);
    if (equipment.stats.def) stats.push(`防+${equipment.stats.def}`);
    if (equipment.stats.hp) stats.push(`血+${equipment.stats.hp}`);
    if (equipment.stats.mp) stats.push(`灵+${equipment.stats.mp}`);
    return stats.join(' ');
  };

  return (
    <Card className="bg-white/95 border-amber-200 text-slate-800 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-amber-600 flex items-center gap-2">
            <Star className="w-5 h-5" />
            {character.name}
          </CardTitle>
          <Badge className={`bg-gradient-to-r ${getRealmColor()} text-white border-0 shadow-sm`}>
            {character.realm} {character.level}层
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 9层渡劫提示 */}
        {character.level >= 9 && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-3 text-center animate-pulse">
            <div className="text-sm font-bold">⚡ 境界已满，请前往渡劫！</div>
            <div className="text-xs mt-1 text-purple-100">渡劫成功后可进入下一境界</div>
          </div>
        )}
        
        {/* 经验条 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-amber-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              经验
            </span>
            <span className="text-slate-600">
              {character.exp.toLocaleString()} / {character.expToNext.toLocaleString()}
              {character.level >= 9 && character.exp >= character.expToNext && (
                <span className="text-purple-500 ml-1">(已满)</span>
              )}
            </span>
          </div>
          <Progress 
            value={Math.min(100, expPercent)} 
            className={`h-2 bg-amber-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-500 ${character.level >= 9 && character.exp >= character.expToNext ? '[&>div]:from-purple-400 [&>div]:to-purple-500' : ''}`} 
          />
        </div>

        {/* 气血条 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-red-500 flex items-center gap-1">
              <Heart className="w-4 h-4" />
              气血
            </span>
            <span className="text-slate-600">
              {character.stats.hp.toLocaleString()} / {character.stats.maxHp.toLocaleString()}
            </span>
          </div>
          <Progress value={hpPercent} className="h-3 bg-red-100 [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500" />
        </div>

        {/* 灵力条 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-blue-500 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              灵力
            </span>
            <span className="text-slate-600">
              {character.stats.mp.toLocaleString()} / {character.stats.maxMp.toLocaleString()}
            </span>
          </div>
          <Progress value={mpPercent} className="h-3 bg-blue-100 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-500" />
        </div>

        {/* 属性 */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-2 border border-orange-100">
            <Sword className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-xs text-slate-500">攻击</div>
              <div className="font-bold text-orange-500">{character.stats.atk}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-cyan-50 rounded-lg p-2 border border-cyan-100">
            <Shield className="w-4 h-4 text-cyan-500" />
            <div>
              <div className="text-xs text-slate-500">防御</div>
              <div className="font-bold text-cyan-500">{character.stats.def}</div>
            </div>
          </div>
        </div>

        {/* 金币 */}
        <div className="flex items-center justify-between bg-amber-50 rounded-lg p-2 border border-amber-100">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-amber-600 font-bold">{character.gold.toLocaleString()}</span>
          </div>
          <span className="text-xs text-slate-500">金币</span>
        </div>

        {/* 永久加成 */}
        {character.permanentBonuses && (character.permanentBonuses.maxHp > 0 || character.permanentBonuses.maxMp > 0) && (
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-2 border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-red-500">
                ❤️ <span className="font-bold">+{character.permanentBonuses.maxHp}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-500">
                💫 <span className="font-bold">+{character.permanentBonuses.maxMp}</span>
              </div>
            </div>
            <span className="text-xs text-amber-600">永久加成</span>
          </div>
        )}

        {/* 操作按钮 - 移到装备上方 */}
        <div className="space-y-2 pt-2">
          <div className="text-sm text-blue-600 font-medium flex items-center gap-1">
            <Zap className="w-4 h-4" />
            快捷操作
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onMeditate}
              variant="outline"
              className="flex-1 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 h-10"
            >
              🧘 修炼
            </Button>
            <Button 
              onClick={onRestore}
              disabled={hpPills === 0 || character.stats.hp >= character.stats.maxHp}
              variant="outline"
              className={`flex-1 h-10 ${hpPills > 0 && character.stats.hp < character.stats.maxHp 
                ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
                : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              💚 使用丹药 ({hpPills})
            </Button>
          </div>
          {/* 物品快捷信息 */}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 text-xs border border-slate-100">
            <div className="flex items-center gap-1 text-red-500">
              💊 回血丹: <span className="font-bold">{hpPills}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-500">
              📿 渡劫丹: <span className="font-bold">{tribulationPillsInBag}</span>
            </div>
          </div>
        </div>

        {/* 装备栏 */}
        <div className="space-y-2 pt-2">
          <div className="text-sm text-amber-600 font-medium flex items-center gap-1">
            <Package className="w-4 h-4" />
            当前装备
          </div>
          <div className="space-y-2">
            {(['weapon', 'armor', 'accessory'] as const).map(slot => {
              const equipment = character.equipment[slot];
              const slotNames: Record<string, string> = {
                weapon: '武器',
                armor: '防具',
                accessory: '饰品'
              };
              const slotIcons: Record<string, string> = {
                weapon: '⚔️',
                armor: '🛡️',
                accessory: '💎'
              };
              
              return (
                <div 
                  key={slot}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${equipment 
                      ? 'bg-gradient-to-r from-amber-50 to-white border-amber-200' 
                      : 'bg-slate-50 border-slate-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{equipment ? equipment.icon : slotIcons[slot]}</span>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">{slotNames[slot]}</div>
                      {equipment ? (
                        <>
                          <div className={`font-medium ${QualityColors[equipment.quality]}`}>
                            {equipment.name}
                          </div>
                          <div className="text-xs text-green-600 mt-0.5">
                            {getEquipmentStats(equipment)}
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-400 text-sm">未装备</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 提示 */}
        {hpPills === 0 && character.stats.hp < character.stats.maxHp && (
          <div className="text-xs text-center text-amber-600">
            💡 打怪可获得回血丹，或去市场购买
          </div>
        )}
      </CardContent>
    </Card>
  );
}
