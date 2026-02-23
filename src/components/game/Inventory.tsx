'use client';

import { useState } from 'react';
import { Character, InventoryItem, GameItem, EquipmentItem, PillItem } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QualityNames, QualityColors, EquipmentTypeNames, ItemTypeNames } from '@/types/game';
import { 
  Package, 
  Pill, 
  Sword, 
  Shield, 
  Gem,
  Coins,
  X
} from 'lucide-react';

interface InventoryProps {
  character: Character;
  inventory: InventoryItem[];
  onUseItem: (item: GameItem, quantity?: number) => void;
  onEquip: (item: GameItem) => void;
  onUnequip: (slot: 'weapon' | 'armor' | 'accessory') => void;
  onSellItem: (item: GameItem, price: number) => void;
}

export function Inventory({ 
  character, 
  inventory, 
  onUseItem, 
  onEquip, 
  onUnequip, 
  onSellItem 
}: InventoryProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [sellPrice, setSellPrice] = useState('100');
  const [useQuantity, setUseQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('all');

  // 分类物品
  const categorizedItems = {
    all: inventory,
    pill: inventory.filter(i => i.item.type === 'pill' || i.item.type === 'tribulation_pill'),
    equipment: inventory.filter(i => i.item.type === 'equipment'),
    material: inventory.filter(i => i.item.type === 'material')
  };

  const handleUse = () => {
    if (selectedItem) {
      onUseItem(selectedItem.item, useQuantity);
      setSelectedItem(null);
      setUseQuantity(1);
    }
  };

  const handleEquip = () => {
    if (selectedItem && selectedItem.item.type === 'equipment') {
      onEquip(selectedItem.item);
      setSelectedItem(null);
    }
  };

  const handleSell = () => {
    if (selectedItem) {
      onSellItem(selectedItem.item, parseInt(sellPrice) || 0);
      setSelectedItem(null);
      setSellDialogOpen(false);
      setSellPrice('100');
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedItem) return;
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.min(Math.max(1, value), selectedItem.quantity);
    setUseQuantity(clampedValue);
  };

  const getItemQualityColor = (item: GameItem) => {
    if (item.type === 'equipment') {
      return QualityColors[(item as EquipmentItem).quality];
    }
    if (item.type === 'material') {
      return QualityColors[(item as any).rarity];
    }
    return 'text-slate-800';
  };

  const getItemDescription = (item: GameItem) => {
    if (item.type === 'pill') {
      const pill = item as PillItem;
      if (pill.effect === 'hp') return `恢复${pill.value}点气血`;
      if (pill.effect === 'mp') return `恢复${pill.value}点灵力`;
      if (pill.effect === 'exp') return `增加${pill.value}点经验`;
    }
    if (item.type === 'tribulation_pill') {
      return '渡劫成功率+10%';
    }
    if (item.type === 'equipment') {
      const eq = item as EquipmentItem;
      const stats: string[] = [];
      if (eq.stats.hp) stats.push(`气血+${eq.stats.hp}`);
      if (eq.stats.mp) stats.push(`灵力+${eq.stats.mp}`);
      if (eq.stats.atk) stats.push(`攻击+${eq.stats.atk}`);
      if (eq.stats.def) stats.push(`防御+${eq.stats.def}`);
      return stats.join(', ');
    }
    return item.description;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 装备栏 */}
      <Card className="bg-white border-amber-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-amber-600 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            当前装备
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
                    ? 'bg-gradient-to-r from-amber-50 to-white border-amber-300' 
                    : 'bg-slate-50 border-slate-200'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{equipment ? equipment.icon : slotIcons[slot]}</span>
                    <div>
                      <div className="text-sm text-slate-500 font-medium">{slotNames[slot]}</div>
                      {equipment ? (
                        <>
                          <div className={`font-bold ${QualityColors[equipment.quality]}`}>
                            {equipment.name}
                          </div>
                          <div className="text-xs text-green-600">
                            {getItemDescription(equipment)}
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-400 text-sm">未装备</div>
                      )}
                    </div>
                  </div>
                  {equipment && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onUnequip(slot)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 背包物品 */}
      <Card className="lg:col-span-2 bg-white border-blue-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-blue-600 flex items-center gap-2">
            <Package className="w-4 h-4" />
            背包 ({inventory.length} 种物品)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-slate-100">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">全部</TabsTrigger>
              <TabsTrigger value="pill" className="text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700">丹药</TabsTrigger>
              <TabsTrigger value="equipment" className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">装备</TabsTrigger>
              <TabsTrigger value="material" className="text-xs data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">材料</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-64 mt-3">
              {(['all', 'pill', 'equipment', 'material'] as const).map(tab => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-4">
                    {categorizedItems[tab].map((invItem, index) => (
                      <div 
                        key={`${invItem.item.id}-${index}`}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-all
                          ${selectedItem === invItem 
                            ? 'bg-blue-50 border-blue-400 shadow-md' 
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                          }
                        `}
                        onClick={() => setSelectedItem(invItem)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{invItem.item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold truncate ${getItemQualityColor(invItem.item)}`}>
                              {invItem.item.name}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              x{invItem.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {categorizedItems[tab].length === 0 && (
                      <div className="col-span-full text-center text-slate-400 py-8 font-medium">
                        暂无物品
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>

          {/* 物品操作 */}
          {selectedItem && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{selectedItem.item.icon}</span>
                <div className="flex-1">
                  <div className={`font-bold ${getItemQualityColor(selectedItem.item)}`}>
                    {selectedItem.item.name} x{selectedItem.quantity}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {getItemDescription(selectedItem.item)}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {(selectedItem.item.type === 'pill' || selectedItem.item.type === 'tribulation_pill') && (
                  <div className="flex items-center gap-2 mb-3">
                    <Label htmlFor="useQuantity" className="text-sm text-slate-600">使用数量:</Label>
                    <Input 
                      id="useQuantity" 
                      type="number"
                      min={1}
                      max={selectedItem.quantity}
                      value={useQuantity}
                      onChange={handleQuantityChange}
                      className="w-20 bg-white border-slate-300"
                    />
                    <span className="text-sm text-slate-500">/ {selectedItem.quantity}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {(selectedItem.item.type === 'pill' || selectedItem.item.type === 'tribulation_pill') && (
                    <Button 
                      size="sm" 
                      onClick={handleUse}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Pill className="w-4 h-4 mr-1" />
                      使用
                    </Button>
                  )}
                  {selectedItem.item.type === 'equipment' && (
                    <Button 
                      size="sm" 
                      onClick={handleEquip}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Sword className="w-4 h-4 mr-1" />
                      装备
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSellDialogOpen(true)}
                    className="border-amber-300 text-amber-600 hover:bg-amber-50"
                  >
                    <Coins className="w-4 h-4 mr-1" />
                    出售
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(null);
                      setUseQuantity(1);
                    }}
                    className="text-slate-500"
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 出售对话框 */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-800">
          <DialogHeader>
            <DialogTitle>出售物品</DialogTitle>
            <DialogDescription className="text-slate-500">
              将物品上架到交易市场
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              {selectedItem && (
                <>
                  <span className="text-2xl">{selectedItem.item.icon}</span>
                  <span className={`font-medium ${getItemQualityColor(selectedItem.item)}`}>
                    {selectedItem.item.name}
                  </span>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">出售价格 (金币)</Label>
              <Input 
                id="price" 
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="bg-slate-50 border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSellDialogOpen(false)} className="text-slate-600">
              取消
            </Button>
            <Button onClick={handleSell} className="bg-amber-500 hover:bg-amber-600 text-white">
              确认出售
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
